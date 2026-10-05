require('dotenv').config();
const { Telegraf, session } = require('telegraf');

const { getExchange } = require('./config/exchanges');
const { getGuide } = require('./guides');
const { t, getLang, SUPPORTED_LANGS } = require('./i18n');
const { languageKeyboard, exchangeDetailKeyboard, guideKeyboard } = require('./keyboards/mainMenu');
const { show, sendMainMenu, menuKeyboard } = require('./helpers/render');
const { fmtRange, fmtRate } = require('./helpers/format');
const { showCheckPrompt, runCheck } = require('./handlers/check');
const { showEstimateChoose, chooseEstimateExchange, handleEstimateInput } = require('./handlers/estimate');
const { showWeekCalendar, showMonthCalendar } = require('./handlers/calendar');
const db = require('./db');

if (!process.env.BOT_TOKEN) {
  console.error('❌ Thiếu BOT_TOKEN trong file .env (xem .env.example)');
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session({ defaultSession: () => ({}) }));

// ---------- /start ----------
bot.start(async (ctx) => {
  try {
    const name = [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' ') || null;
    const result = await db.addOrUpdateUser({
      telegramId: ctx.from.id,
      username: ctx.from.username || null,
      name,
      referralBranch: ctx.startPayload || null,
    });

    if (process.env.ADMIN_CHAT_ID) {
      ctx.telegram
        .sendMessage(
          process.env.ADMIN_CHAT_ID,
          `${result.created ? '🆕 User mới' : '🔁 User quay lại'}\n👤 Tên: ${name || 'N/A'}\n` +
            `🔗 Username: ${ctx.from.username ? '@' + ctx.from.username : '(không có)'}\n🆔 Telegram ID: ${ctx.from.id}`
        )
        .catch((err) => console.error('Không gửi được thông báo admin:', err.message));
    }
  } catch (err) {
    console.error('addOrUpdateUser lỗi:', err.message); // lỗi DB không chặn user dùng bot
  }
  await sendMainMenu(ctx);
});

// ---------- Lệnh ----------
bot.command('menu', sendMainMenu);
bot.command('check', showCheckPrompt);
bot.command('estimate', showEstimateChoose);
bot.command('wcalendar', showWeekCalendar);
bot.command('mcalendar', showMonthCalendar);
bot.command('language', (ctx) => ctx.reply(t(getLang(ctx), 'choose_language'), languageKeyboard(getLang(ctx))));
bot.help((ctx) => ctx.reply(t(getLang(ctx), 'help_text')));

// ---------- Nút bấm ----------
bot.action('MAIN', async (ctx) => {
  await ctx.answerCbQuery();
  await sendMainMenu(ctx);
});

// Trang thông tin sàn
bot.action(/^EX_(.+)$/, async (ctx) => {
  const lang = getLang(ctx);
  const ex = getExchange(ctx.match[1]);
  if (!ex) return ctx.answerCbQuery(t(lang, 'exchange_not_found'));
  await ctx.answerCbQuery();
  ctx.session.state = null;
  await show(
    ctx,
    t(lang, 'exchange_detail', {
      name: ex.name,
      percent: ex.rebatePercent,
      rate: fmtRange(ex.ratePerLotMin, ex.ratePerLotMax, fmtRate),
    }),
    exchangeDetailKeyboard(ex, lang)
  );
});

// Hướng dẫn tạo tài khoản hoặc chuyển IB (1 nút / sàn)
bot.action(/^GUIDE_(.+)$/, async (ctx) => {
  const lang = getLang(ctx);
  const ex = getExchange(ctx.match[1]);
  if (!ex) return ctx.answerCbQuery(t(lang, 'exchange_not_found'));
  await ctx.answerCbQuery();
  await show(ctx, getGuide(ex, lang) || t(lang, 'no_guide', { name: ex.name }), guideKeyboard(ex.id, lang));
});

bot.action('CHECK', async (ctx) => { await ctx.answerCbQuery(); await showCheckPrompt(ctx); });
bot.action('EST', async (ctx) => { await ctx.answerCbQuery(); await showEstimateChoose(ctx); });
bot.action(/^EST_EX_(.+)$/, (ctx) => chooseEstimateExchange(ctx, ctx.match[1]));
bot.action('WCAL', showWeekCalendar);
bot.action('MCAL', showMonthCalendar);

// ---------- Ngôn ngữ ----------
bot.action('LANG', async (ctx) => {
  await ctx.answerCbQuery();
  await show(ctx, t(getLang(ctx), 'choose_language'), languageKeyboard(getLang(ctx)));
});
bot.action(/^LANG_(.+)$/, async (ctx) => {
  const info = SUPPORTED_LANGS.find((l) => l.code === ctx.match[1]);
  if (!info) return ctx.answerCbQuery();
  ctx.session.lang = info.code;
  await ctx.answerCbQuery(t(info.code, 'language_set', { lang: info.name }));
  await sendMainMenu(ctx);
});

// ---------- Tin nhắn văn bản ----------
bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith('/')) return;

  const state = ctx.session.state;
  if (state?.type === 'estimate') return handleEstimateInput(ctx, text); // đang nhập số lot

  const compact = text.replace(/\s/g, '');
  if (/^\d+$/.test(compact)) return runCheck(ctx, compact);              // dãy số bất kỳ => check
  if (state?.type === 'check' && compact.length <= 40) return runCheck(ctx, compact); // UID có chữ

  const lang = getLang(ctx);
  return ctx.reply(t(lang, 'hint'), { parse_mode: 'HTML', ...(await menuKeyboard(lang)) });
});

bot.catch((err, ctx) => console.error(`⚠️ Lỗi ${ctx.updateType} từ user ${ctx.from?.id}:`, err));

// ---------- Khởi động ----------
(async () => {
  const me = await bot.telegram.getMe();
  console.log(`🤖 Đang chạy @${me.username} (long polling)...`);
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Bắt đầu / menu chính' },
    { command: 'check', description: 'Check hoàn phí - backcom' },
    { command: 'estimate', description: 'Ước tính hoàn phí - backcom' },
    { command: 'wcalendar', description: 'Lịch kinh tế tuần này' },
    { command: 'mcalendar', description: 'Lịch kinh tế tháng này' },
    { command: 'language', description: 'Đổi ngôn ngữ' },
  ]);
  bot.launch().catch((err) => { console.error('❌ Bot dừng do lỗi:', err); process.exit(1); });
})().catch((err) => {
  console.error('❌ Không khởi động được bot (kiểm tra BOT_TOKEN / mạng):', err.message);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
