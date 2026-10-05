const { getExchange, calculateBackcom } = require('../config/exchanges');
const { t, getLang } = require('../i18n');
const { estimateChooseKeyboard, estimatePromptKeyboard, estimateResultKeyboard } = require('../keyboards/mainMenu');
const { show } = require('../helpers/render');
const { fmt, fmtRate, fmtRange } = require('../helpers/format');

// "2.5", "2,5", "1,000.5" -> số; sai -> null
function parseLots(text) {
  let s = String(text).replace(/\s/g, '');
  s = s.includes(',') && s.includes('.') ? s.replace(/,/g, '') : s.replace(',', '.');
  if (!/^\d*\.?\d+$/.test(s)) return null;
  const n = Number(s);
  return n > 0 && n <= 1e7 ? n : null;
}

/** Bước 1: danh sách sàn (nút Ước tính / lệnh /estimate). */
async function showEstimateChoose(ctx) {
  const lang = getLang(ctx);
  ctx.session.state = null;
  return show(ctx, t(lang, 'estimate_choose'), estimateChooseKeyboard(lang));
}

/** Bước 2: đã chọn sàn -> hỏi số lot. */
async function chooseEstimateExchange(ctx, exchangeId) {
  const lang = getLang(ctx);
  const ex = getExchange(exchangeId);
  if (!ex) return ctx.answerCbQuery(t(lang, 'exchange_not_found'));
  await ctx.answerCbQuery();
  ctx.session.state = { type: 'estimate', exchangeId: ex.id };
  return show(ctx, t(lang, 'estimate_prompt', { name: ex.name }), estimatePromptKeyboard(lang));
}

/** Bước 3: nhận số lot -> tính khoảng backcom theo ratePerLotMin/Max của sàn trong config/exchanges.js. */
async function handleEstimateInput(ctx, text) {
  const lang = getLang(ctx);
  const ex = getExchange(ctx.session.state?.exchangeId);
  if (!ex) return showEstimateChoose(ctx);

  const lots = parseLots(text);
  if (lots === null) {
    return ctx.reply(t(lang, 'estimate_invalid'), { parse_mode: 'HTML', ...estimatePromptKeyboard(lang) });
  }

  const r = calculateBackcom(ex.id, lots);
  ctx.session.state = null;
  return ctx.reply(
    t(lang, 'estimate_result', {
      name: ex.name,
      lots: Number.isInteger(lots) ? lots : lots.toFixed(2),
      rate: fmtRange(ex.ratePerLotMin, ex.ratePerLotMax, fmtRate),
      percent: ex.rebatePercent,
      backcom: fmtRange(r.min, r.max, fmt), // min = max -> 1 giá trị, khác nhau -> khoảng
    }),
    { parse_mode: 'HTML', ...estimateResultKeyboard(lang) }
  );
}

module.exports = { showEstimateChoose, chooseEstimateExchange, handleEstimateInput };
