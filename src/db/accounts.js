const pool = require('./connection');

// ============================================================================
// Tra cứu theo cấu trúc bảng trong sql/schema.sql:
//   backcom_user(uid, exchange)            - UID trên sàn, dùng chung các sàn
//   trading_account(account_number, uid)   - số tài khoản giao dịch (Vantage)
//   bingx_trade(uid, time, volume, commission)
//   vantage_trade(account_number, time, volume, commission)
// Muốn thêm sàn mới: thêm 1 dòng vào TRADE (bảng giao dịch + cột khoá).
// ============================================================================
const TRADE = {
  bingx: { table: 'bingx_trade', keyCol: 'uid' },
  vantage: { table: 'vantage_trade', keyCol: 'account_number' },
};

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

// Các mốc thời gian theo giờ GMT+7 (dạng 'YYYY-MM-DD 00:00:00' để so với cột `time`)
function dateRanges() {
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
  return {
    monthStart: `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-01 00:00:00`,
    todayStart: `${ymd(now)} 00:00:00`,
    yesterdayStart: `${ymd(yesterday)} 00:00:00`,
  };
}

/**
 * Khối lượng (lot) + hoa hồng của các khoá (uid hoặc số tài khoản):
 *   - tháng này (từ ngày 1 đến hiện tại)
 *   - hôm qua (yesterdayCount = số giao dịch hôm qua; 0 => không có dữ liệu)
 */
async function getStats(exchange, keys) {
  const cfg = TRADE[exchange];
  const stats = { monthLots: 0, monthCommission: 0, yesterdayLots: 0, yesterdayCommission: 0, yesterdayCount: 0 };
  if (!cfg || keys.length === 0) return stats;

  const { monthStart, todayStart, yesterdayStart } = dateRanges();
  const from = monthStart < yesterdayStart ? monthStart : yesterdayStart; // ngày 1 của tháng thì "hôm qua" nằm ở tháng trước

  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN time >= ? THEN volume ELSE 0 END), 0) AS monthLots,
            COALESCE(SUM(CASE WHEN time >= ? THEN commission ELSE 0 END), 0) AS monthCommission,
            COALESCE(SUM(CASE WHEN time >= ? AND time < ? THEN volume ELSE 0 END), 0) AS yesterdayLots,
            COALESCE(SUM(CASE WHEN time >= ? AND time < ? THEN commission ELSE 0 END), 0) AS yesterdayCommission,
            COALESCE(SUM(CASE WHEN time >= ? AND time < ? THEN 1 ELSE 0 END), 0) AS yesterdayCount
       FROM ${cfg.table}
      WHERE ${cfg.keyCol} IN (?) AND time >= ?`,
    [
      monthStart,
      monthStart,
      yesterdayStart, todayStart,
      yesterdayStart, todayStart,
      yesterdayStart, todayStart,
      keys,
      from,
    ]
  );
  const r = rows[0] || {};
  return {
    monthLots: Number(r.monthLots || 0),
    monthCommission: Number(r.monthCommission || 0),
    yesterdayLots: Number(r.yesterdayLots || 0),
    yesterdayCommission: Number(r.yesterdayCommission || 0),
    yesterdayCount: Number(r.yesterdayCount || 0),
  };
}

/**
 * Tìm theo số nhập vào: là số tài khoản giao dịch (trading_account) hoặc UID (backcom_user).
 * @returns {Promise<Array<{exchange:string, uid:string, accountNumber:string|null, accountCount:number, stats:object}>>}
 *          mảng rỗng = chưa đăng ký dưới hệ thống Backcom
 */
async function findAccounts(input) {
  const results = [];

  // 1) Nhập số tài khoản giao dịch (VD: Vantage)
  const [accs] = await pool.query(
    `SELECT ta.account_number, ta.uid, bu.exchange
       FROM trading_account ta
       JOIN backcom_user bu ON bu.uid = ta.uid
      WHERE ta.account_number = ?`,
    [input]
  );
  for (const a of accs) {
    const exchange = String(a.exchange).toLowerCase();
    results.push({
      exchange, uid: a.uid, accountNumber: a.account_number, accountCount: 1,
      stats: await getStats(exchange, [a.account_number]),
    });
  }

  // 2) Nhập UID (VD: BingX, hoặc UID Vantage -> gộp tất cả số tài khoản của UID đó)
  const [users] = await pool.query('SELECT uid, exchange FROM backcom_user WHERE uid = ?', [input]);
  for (const u of users) {
    const exchange = String(u.exchange).toLowerCase();
    const [accRows] = await pool.query('SELECT account_number FROM trading_account WHERE uid = ?', [u.uid]);
    const numbers = accRows.map((x) => x.account_number);
    const keys = TRADE[exchange]?.keyCol === 'uid' ? [u.uid] : numbers;
    results.push({
      exchange, uid: u.uid, accountNumber: null, accountCount: numbers.length,
      stats: await getStats(exchange, keys),
    });
  }

  return results;
}

module.exports = { findAccounts };
