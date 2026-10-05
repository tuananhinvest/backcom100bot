const { Markup } = require('telegraf');
const { EXCHANGES } = require('../config/exchanges');
const { t, SUPPORTED_LANGS } = require('../i18n');

const btn = Markup.button.callback;
const backRow = (lang, target = 'MAIN') => [btn(t(lang, 'back_btn'), target)];
const exchangeRow = (prefix) => EXCHANGES.map((ex) => btn(ex.name, `${prefix}${ex.id}`));

// links = { week, month } lấy từ bảng calendar_link. Có link -> nút mở thẳng bài viết; chưa có -> nút báo "chưa có link".
function mainMenuKeyboard(lang, links = {}) {
  const calBtn = (type, textKey, action) =>
    links[type] ? Markup.button.url(t(lang, textKey), links[type]) : btn(t(lang, textKey), action);
  return Markup.inlineKeyboard([
    exchangeRow('EX_'),
    [btn(t(lang, 'check_btn'), 'CHECK')],
    [btn(t(lang, 'estimate_btn'), 'EST')],
    [calBtn('week', 'wcal_btn', 'WCAL'), calBtn('month', 'mcal_btn', 'MCAL')],
    [btn(t(lang, 'language_btn'), 'LANG')],
  ]);
}

function languageKeyboard(lang) {
  const rows = SUPPORTED_LANGS.map((l) => btn(`${l.flag} ${l.name}`, `LANG_${l.code}`));
  return Markup.inlineKeyboard([rows, backRow(lang)]);
}

function exchangeDetailKeyboard(exchange, lang) {
  return Markup.inlineKeyboard([
    [Markup.button.url(t(lang, 'register_btn'), exchange.refLink)],
    [btn(t(lang, 'guide_btn'), `GUIDE_${exchange.id}`)],
    backRow(lang),
  ]);
}

// Từ màn hướng dẫn -> về trang sàn
const guideKeyboard = (exchangeId, lang) => Markup.inlineKeyboard([backRow(lang, `EX_${exchangeId}`)]);

// Màn lịch (khi gõ /wcalendar, /mcalendar): nút mở bài viết + Quay lại
const calendarKeyboard = (lang, url) =>
  Markup.inlineKeyboard([[Markup.button.url(t(lang, 'cal_open_btn'), url)], backRow(lang)]);

// Chỉ có nút Quay lại menu chính (nhập số tài khoản...)
const backToMainKeyboard = (lang) => Markup.inlineKeyboard([backRow(lang)]);

// Kết quả check: Check tiếp + Quay lại
const checkResultKeyboard = (lang) =>
  Markup.inlineKeyboard([[btn(t(lang, 'check_again_btn'), 'CHECK')], backRow(lang)]);

// Ước tính: chọn sàn
const estimateChooseKeyboard = (lang) => Markup.inlineKeyboard([exchangeRow('EST_EX_'), backRow(lang)]);

// Ước tính: đang nhập lot -> quay lại danh sách sàn
const estimatePromptKeyboard = (lang) => Markup.inlineKeyboard([backRow(lang, 'EST')]);

const estimateResultKeyboard = (lang) =>
  Markup.inlineKeyboard([[btn(t(lang, 'estimate_again_btn'), 'EST')], backRow(lang)]);

module.exports = {
  mainMenuKeyboard, languageKeyboard, exchangeDetailKeyboard, guideKeyboard, backToMainKeyboard, calendarKeyboard,
  checkResultKeyboard, estimateChooseKeyboard, estimatePromptKeyboard, estimateResultKeyboard,
};
