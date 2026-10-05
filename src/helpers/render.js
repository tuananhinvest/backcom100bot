const { t, getLang } = require('../i18n');
const { mainMenuKeyboard } = require('../keyboards/mainMenu');
const db = require('../db');

const escapeHtml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Từ nút bấm -> sửa tin nhắn hiện tại; từ lệnh gõ tay -> gửi tin mới. */
async function show(ctx, text, extra = {}) {
  const opts = { parse_mode: 'HTML', disable_web_page_preview: true, ...extra };
  if (ctx.callbackQuery?.message) {
    try {
      return await ctx.editMessageText(text, opts);
    } catch (err) {
      if ((err.description || err.message || '').includes('message is not modified')) return;
      // không sửa được -> gửi tin mới
    }
  }
  return ctx.reply(text, opts);
}

/** Menu chính kèm link lịch kinh tế hiện tại (đọc từ DB, có cache). */
async function menuKeyboard(lang) {
  return mainMenuKeyboard(lang, await db.getCalendarLinks());
}

/** Hiển thị menu chính (dùng cho /start, /menu, nút Quay lại). */
async function sendMainMenu(ctx) {
  ctx.session.state = null;
  const lang = getLang(ctx);
  const name = escapeHtml(ctx.from.first_name || 'trader');
  return show(ctx, t(lang, 'welcome', { name }), await menuKeyboard(lang));
}

module.exports = { show, sendMainMenu, menuKeyboard, escapeHtml };
