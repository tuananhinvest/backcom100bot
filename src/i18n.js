// Chuỗi giao diện (parse_mode HTML). Thêm ngôn ngữ: copy khối `en`, đổi mã + dịch.
// Thiếu key thì dùng tiếng Việt.
const LOCALES = {
  vi: {
    langName: 'Tiếng Việt', langFlag: '🇻🇳',
    welcome:
      `👋 Chào mừng <b>{{name}}</b> đã đến với <b>Thức khuya cùng Forex</b>\n\n` +
      `Nơi gác chart đêm và quản trị rủi ro | <b>Backcom 100%</b> (Back 100% commission)\n\n` +
      `🔍 Gửi <b>ID tài khoản</b> hoặc <b>Tài khoản giao dịch</b> của bạn cho bot để kiểm tra backcom\n` +
      `<i>Nếu bạn chưa đăng kí backcom - hãy đăng kí ngay một trong các sàn giao dịch mà chúng tôi hỗ trợ</i>\n\n` +
      `<b>Các tính năng của bot</b>\n` +
      `/check - Kiểm tra backcom - hoàn phí giao dịch của bạn\n` +
      `/estimate - Ước tính backcom - phí giao dịch bạn được hoàn lại\n` +
      `/wcalendar /mcalendar - Xem lịch kinh tế quan trọng\n\n` +
      `<b>MXH:</b> <a href="https://www.thuckhuyacungforex.com/">Website</a> - <a href="https://t.me/thuckhuyacungforex">Telegram</a> - <a href="https://x.com/thuckhuyacungfx">X</a>\n\n` +
      `👇 Chọn một trong các sàn mà chúng tôi hỗ trợ để đăng kí backcom tự động hàng ngày:`,
    choose_language: '🌐 Vui lòng chọn ngôn ngữ:',
    language_set: '✅ Đã chuyển sang {{lang}}.',
    language_btn: '🌐 Ngôn ngữ',
    check_btn: '🔍 Check Hoàn phí - Backcom',
    estimate_btn: '🧮 Ước tính Hoàn phí - Backcom',
    wcal_btn: '📅 Lịch kinh tế tuần này',
    mcal_btn: '🗓 Lịch kinh tế tháng này',
    back_btn: '⬅️ Quay lại',
    register_btn: '🚀 Đăng ký tài khoản',
    guide_btn: '📖 Hướng dẫn tạo tài khoản hoặc chuyển IB',
    exchange_not_found: 'Không tìm thấy sàn này',
    exchange_detail: `🏦 Sàn: <b>{{name}}</b>\n\n` +
      `💰Thông tin hoàn phí\n` +
      `- Backcom <b>{{percent}}%</b>\n` +
      `- Lên đến <b>{{rate}} USD/lot</b> vàng\n` +
      `- Hoàn phí tự động hàng ngày\n\n` +
      `👇 Đăng ký tài khoản nhận backcom ngay thôi`,
    no_guide: 'Chưa có hướng dẫn cho <b>{{name}}</b>.',
    check_prompt:
      `🔍 <b>Check hoàn phí - Backcom</b>\n\n` +
      `Vui lòng nhập <b>số tài khoản</b> giao dịch của bạn (ví dụ: <code>12345678</code>).\n\n` +
      `💡 Bạn cũng có thể gửi thẳng một dãy số bất kỳ cho bot để kiểm tra nhanh.`,
    check_found: `✅ <b>Tài khoản đã đăng ký dưới hệ thống Backcom</b>\n\n` +
      `🏦 Sàn: <b>{{exchange}}</b>\n` +
      `{{idLines}}\n\n` +
      `📅 <b>Tháng này</b>\n` +
      `• Khối lượng: {{monthLots}} lot\n` +
      `• Backcom ({{percent}}%): {{monthBackcom}} USD\n\n` +
      `🌙 <b>Hôm qua</b>\n` +
      `• Khối lượng: {{yesterdayLots}}\n` +
      `• Backcom ({{percent}}%): {{yesterdayBackcom}}`,
    check_not_found:
      `❌ Tài khoản <code>{{account}}</code> <b>chưa đăng ký dưới hệ thống Backcom</b> của chúng tôi.\n\n` +
      `Chọn sàn ở menu để xem hướng dẫn tạo tài khoản hoặc chuyển IB.`,
    check_error: '⚠️ Hệ thống đang bận, vui lòng thử lại sau.',
    label_account: '🔢 Số tài khoản',
    label_uid: '🆔 UID',
    unit_lot: 'lot',
    label_accounts_count: '📑 Số lượng tài khoản',
    check_again_btn: '🔍 Check tài khoản khác',
    estimate_choose: '🧮 <b>Ước tính hoàn phí - Backcom</b>\n\nChọn sàn bạn giao dịch:',
    estimate_prompt:
      `Bạn đã chọn <b>{{name}}</b>.\n\n` +
      `Vui lòng nhập <b>tổng số lot giao dịch trong tháng</b> (ví dụ: <code>10</code> hoặc <code>2.5</code>):`,
    estimate_invalid: '❌ Số lot không hợp lệ. Vui lòng nhập số lớn hơn 0, ví dụ: 10 hoặc 2.5',
    estimate_result: `📊 <b>Ước tính Backcom - {{name}}</b>\n\n` +
      `📏 Số lot trong tháng: <b>{{lots}}</b>\n` +
      `💵 Tỉ giá: {{rate}} USD/lot\n` +
      `💰 Backcom ({{percent}}%): <b>{{backcom}} USD</b>\n\n` +
      `<i>Đây chỉ là số liệu ước tính. Nếu bạn chưa đăng kí hoàn phí, bạn đã mất {{backcom}} USD mỗi tháng</i>`,
    estimate_again_btn: '🔁 Tính lại',
    cal_week_msg: '📅 Lịch kinh tế tuần này: bấm nút bên dưới để xem bài viết trên kênh.',
    cal_month_msg: '🗓 Lịch kinh tế tháng này: bấm nút bên dưới để xem bài viết trên kênh.',
    cal_open_btn: '🔗 Xem bài viết',
    cal_empty: 'Chưa có link lịch, vui lòng quay lại sau.',
    hint:
      `🤔 Mình chưa hiểu tin nhắn này.\n\n` +
      `Gửi <b>dãy số</b> (số tài khoản hoặc UID) để check hoàn phí, hoặc chọn chức năng ở menu bên dưới:`,
    help_text:
      `/start - Bắt đầu / menu chính\n/menu - Hiện lại menu\n/check - Check hoàn phí - backcom\n` +
      `/estimate - Ước tính hoàn phí - backcom\n/wcalendar - Lịch kinh tế tuần\n/mcalendar - Lịch kinh tế tháng\n/language - Đổi ngôn ngữ`,
  },

  en: {
    langName: 'English', langFlag: '🇬🇧',

    welcome:
        `👋 Welcome <b>{{name}}</b> to <b>Stay Up Late with Forex</b>\n\n` +
        `Where we stay up late watching the charts and manage risk | <b>Backcom 100%</b> (100% commission back)\n\n` +
        `🔍 Send your <b>Account ID</b> or <b>Trading Account</b> to the bot to check your backcom\n` +
        `<i>If you have not registered for backcom yet, register now with one of the brokers we support</i>\n\n` +
        `<b>Bot features</b>\n` +
        `/check - Check your backcom - trading fee rebate\n` +
        `/estimate - Estimate your backcom - trading fees you can get back\n` +
        `/wcalendar /mcalendar - View important economic calendars\n\n` +
        `<b>Socials:</b> <a href="https://www.thuckhuyacungforex.com/">Website</a> - <a href="https://t.me/thuckhuyacungforex">Telegram</a> - <a href="https://x.com/thuckhuyacungfx">X</a>\n\n` +
        `👇 Choose one of the brokers we support to register for automatic daily backcom:`,

    choose_language: '🌐 Please choose your language:',
    language_set: '✅ Language changed to {{lang}}.',
    language_btn: '🌐 Language',

    check_btn: '🔍 Check Backcom - Rebate',
    estimate_btn: '🧮 Estimate Backcom - Rebate',
    wcal_btn: '📅 This week\'s economic calendar',
    mcal_btn: '🗓 This month\'s economic calendar',

    back_btn: '⬅️ Back',
    register_btn: '🚀 Register an account',
    guide_btn: '📖 Guide to creating an account or transferring IB',

    exchange_not_found: 'Broker not found',

    exchange_detail:
        `🏦 Broker: <b>{{name}}</b>\n\n` +
        `💰 Backcom information\n` +
        `- Backcom <b>{{percent}}%</b>\n` +
        `- Up to <b>{{rate}} USD/lot</b> of gold\n` +
        `- Automatic daily rebate\n\n` +
        `👇 Register an account and start receiving backcom now`,

    no_guide: 'No guide available yet for <b>{{name}}</b>.',

    check_prompt:
        `🔍 <b>Check Backcom - Rebate</b>\n\n` +
        `Please enter your <b>trading account number</b> (e.g. <code>12345678</code>).\n\n` +
        `💡 You can also send any number directly to the bot for a quick check.`,

    check_found:
        `✅ <b>Account is registered under our Backcom system</b>\n\n` +
        `🏦 Broker: <b>{{exchange}}</b>\n` +
        `{{idLines}}\n\n` +
        `📅 <b>This month</b>\n` +
        `• Volume: {{monthLots}} lots\n` +
        `• Backcom ({{percent}}%): {{monthBackcom}} USD\n\n` +
        `🌙 <b>Yesterday</b>\n` +
        `• Volume: {{yesterdayLots}} lots\n` +
        `• Backcom ({{percent}}%): {{yesterdayBackcom}} USD`,

    check_not_found:
        `❌ Account <code>{{account}}</code> is <b>not registered under our Backcom system</b>.\n\n` +
        `Select a broker from the menu to see the guide for creating an account or transferring your IB.`,

    check_error: '⚠️ The system is currently busy, please try again later.',

    label_account: '🔢 Account number',
    label_uid: '🆔 UID',
    unit_lot: 'lots',
    label_accounts_count: '📑 Number of accounts',

    check_again_btn: '🔍 Check another account',

    estimate_choose:
        `🧮 <b>Estimate Backcom - Rebate</b>\n\n` +
        `Choose your broker:`,

    estimate_prompt:
        `You selected <b>{{name}}</b>.\n\n` +
        `Please enter your <b>total number of lots traded this month</b> (e.g. <code>10</code> or <code>2.5</code>):`,

    estimate_invalid:
        '❌ Invalid lot size. Please enter a number greater than 0, e.g. 10 or 2.5',

    estimate_result:
        `📊 <b>Backcom Estimate - {{name}}</b>\n\n` +
        `📏 Lots this month: <b>{{lots}}</b>\n` +
        `💵 Rate: {{rate}} USD/lot\n` +
        `💰 Backcom ({{percent}}%): <b>{{backcom}} USD</b>\n\n` +
        `<i>This is only an estimate. If you have not registered for a rebate, you are losing {{backcom}} USD every month.</i>`,

    estimate_again_btn: '🔁 Calculate again',

    cal_week_msg:
        '📅 This week\'s economic calendar: tap the button below to view the post on our channel.',

    cal_month_msg:
        '🗓 This month\'s economic calendar: tap the button below to view the post on our channel.',

    cal_open_btn: '🔗 View post',

    cal_empty: 'No calendar link is available yet, please come back later.',

    hint:
        `🤔 I didn't understand this message.\n\n` +
        `Send a <b>number</b> (account number or UID) to check your rebate, or select a function from the menu below:`,

    help_text:
        `/start - Start / main menu\n` +
        `/menu - Show the main menu\n` +
        `/check - Check backcom - trading fee rebate\n` +
        `/estimate - Estimate backcom - trading fee rebate\n` +
        `/wcalendar - Weekly economic calendar\n` +
        `/mcalendar - Monthly economic calendar\n` +
        `/language - Change language`,
},
};

const DEFAULT_LANG = 'vi';
const SUPPORTED_LANGS = Object.keys(LOCALES).map((code) => ({
  code, name: LOCALES[code].langName, flag: LOCALES[code].langFlag,
}));

function t(lang, key, vars = {}) {
  const dict = LOCALES[lang] || LOCALES[DEFAULT_LANG];
  const str = dict[key] ?? LOCALES[DEFAULT_LANG][key] ?? key;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function getLang(ctx) {
  return LOCALES[ctx.session?.lang] ? ctx.session.lang : DEFAULT_LANG;
}

module.exports = { t, getLang, LOCALES, SUPPORTED_LANGS, DEFAULT_LANG };
