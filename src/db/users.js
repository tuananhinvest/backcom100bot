const pool = require('./connection');

// Bảng bot_user: telegram_id (VARCHAR, PK), username, name, referral_branch, create_time
/** Thêm user mới nếu chưa có, hoặc cập nhật username nếu đã đổi. Gọi khi /start. */
async function addOrUpdateUser({ telegramId, username = null, name = null, referralBranch = null }) {
  const tgId = String(telegramId);
  const [rows] = await pool.query('SELECT username FROM bot_user WHERE telegram_id = ? LIMIT 1', [tgId]);

  if (rows.length === 0) {
    await pool.query(
      'INSERT INTO bot_user (telegram_id, username, name, referral_branch) VALUES (?, ?, ?, ?)',
      [tgId, username, name, referralBranch]
    );
    return { created: true };
  }
  if (rows[0].username !== username) {
    await pool.query('UPDATE bot_user SET username = ? WHERE telegram_id = ?', [username, tgId]);
  }
  return { created: false };
}

module.exports = { addOrUpdateUser };
