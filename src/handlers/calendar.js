const { t, getLang } = require('../i18n');
const { backToMainKeyboard, calendarKeyboard } = require('../keyboards/mainMenu');
const { show } = require('../helpers/render');
const db = require('../db');

// Lịch kinh tế = link bài viết trên Telegram channel, lưu trong bảng calendar_link.
// Ở menu chính hai nút này là nút URL mở thẳng bài viết; hàm này dùng cho lệnh /wcalendar, /mcalendar
// (và khi chưa có link thì nút trong menu sẽ báo "chưa có link").
async function showCalendar(ctx, type) {
  const lang = getLang(ctx);
  ctx.session.state = null;
  const url = (await db.getCalendarLinks())[type];

  if (!url) {
    if (ctx.callbackQuery) return ctx.answerCbQuery(t(lang, 'cal_empty'), { show_alert: true });
    return ctx.reply(t(lang, 'cal_empty'), backToMainKeyboard(lang));
  }
  if (ctx.callbackQuery) await ctx.answerCbQuery();
  return show(ctx, t(lang, type === 'week' ? 'cal_week_msg' : 'cal_month_msg'), calendarKeyboard(lang, url));
}

module.exports = {
  showWeekCalendar: (ctx) => showCalendar(ctx, 'week'),
  showMonthCalendar: (ctx) => showCalendar(ctx, 'month'),
};
