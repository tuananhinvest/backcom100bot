const pool = require('./connection');

// Link lịch kinh tế lưu trong bảng calendar_link ('week' | 'month'). Cache 60 giây để menu không query liên tục.
const CACHE_MS = 60 * 1000;
let cache = { ts: 0, data: {} };

async function getCalendarLinks() {
  if (Date.now() - cache.ts < CACHE_MS) return cache.data;
  try {
    const [rows] = await pool.query('SELECT type, url FROM calendar_link');
    const data = {};
    for (const r of rows) {
      const url = String(r.url || '').trim();
      if (/^(https?:\/\/|tg:\/\/)/i.test(url)) data[r.type] = url; // chỉ nhận link hợp lệ
    }
    cache = { ts: Date.now(), data };
  } catch (err) {
    console.error('getCalendarLinks lỗi:', err.message); // lỗi DB -> dùng bản cũ
  }
  return cache.data;
}

module.exports = { getCalendarLinks };
