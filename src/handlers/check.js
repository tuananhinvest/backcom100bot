const { getExchange } = require('../config/exchanges');
const { t, getLang } = require('../i18n');
const { backToMainKeyboard, checkResultKeyboard } = require('../keyboards/mainMenu');
const { show, escapeHtml } = require('../helpers/render');
const { fmt } = require('../helpers/format');
const db = require('../db');

/** Hiện màn hình yêu cầu nhập số tài khoản / UID (nút Check / lệnh /check). */
async function showCheckPrompt(ctx) {
  const lang = getLang(ctx);
  ctx.session.state = { type: 'check' };
  return show(ctx, t(lang, 'check_prompt'), backToMainKeyboard(lang));
}

// Backcom = hoa hồng nhận từ sàn × tỉ lệ backcom (rebatePercent) của sàn đó
function renderResult(lang, r) {
  const ex = getExchange(r.exchange);
  const percent = ex ? ex.rebatePercent : 100;
  const backcom = (commission) => fmt((Number(commission) * percent) / 100);
  const hasYesterday = r.stats.yesterdayCount > 0;

  const idLines = r.accountNumber
    ? `${t(lang, 'label_account')}: <code>${escapeHtml(r.accountNumber)}</code>\n${t(lang, 'label_uid')}: <code>${escapeHtml(r.uid)}</code>`
    : `${t(lang, 'label_uid')}: <code>${escapeHtml(r.uid)}</code>` +
      (r.accountCount > 0 ? `\n${t(lang, 'label_accounts_count')}: ${r.accountCount}` : '');

  return t(lang, 'check_found', {
    exchange: escapeHtml(ex?.name || r.exchange),
    idLines,
    percent,
    monthLots: fmt(r.stats.monthLots),
    monthBackcom: backcom(r.stats.monthCommission),
    // Hôm qua: có giao dịch -> hiện số liệu, không có -> "--"
    yesterdayLots: hasYesterday ? `${fmt(r.stats.yesterdayLots)} ${t(lang, 'unit_lot')}` : '--',
    yesterdayBackcom: hasYesterday ? `${backcom(r.stats.yesterdayCommission)} USD` : '--',
  });
}

/** Tra cứu trong DB: có -> thông tin backcom, không -> báo chưa đăng ký. */
async function runCheck(ctx, input) {
  const lang = getLang(ctx);
  ctx.session.state = null;

  let results;
  try {
    results = await db.findAccounts(input);
  } catch (err) {
    console.error('findAccounts lỗi:', err);
    return ctx.reply(t(lang, 'check_error'), { parse_mode: 'HTML', ...backToMainKeyboard(lang) });
  }

  if (results.length === 0) {
    return ctx.reply(t(lang, 'check_not_found', { account: escapeHtml(input) }), { parse_mode: 'HTML', ...backToMainKeyboard(lang) });
  }
  const text = results.map((r) => renderResult(lang, r)).join('\n\n──────────\n\n');
  return ctx.reply(text, { parse_mode: 'HTML', ...checkResultKeyboard(lang) });
}

module.exports = { showCheckPrompt, runCheck };
