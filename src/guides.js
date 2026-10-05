// ============================================================================
// HƯỚNG DẪN TẠO TÀI KHOẢN HOẶC CHUYỂN IB (HTML) - mỗi sàn 1 nội dung / ngôn ngữ.
// ⚠️ Nội dung MẪU, hãy sửa theo quy trình thật. Thiếu ngôn ngữ thì dùng 'vi'.
// {{refLink}} = link ref trong config/exchanges.js, {{support}} = SUPPORT bên dưới.
// ============================================================================
const SUPPORT = '@MoonBackcom'; // TODO: username admin hỗ trợ

const GUIDES = {
  bingx: {
    vi:
      `📖 <b>Hướng dẫn tạo tài khoản hoặc chuyển IB - BINGX</b>\n\n` +
      `<b>1. Chưa có tài khoản BingX</b>\n↳ Đăng ký qua link: {{refLink}}\n↳ Hoàn tất KYC rồi giao dịch như bình thường.\n\n` +
      `<b>2. Đã có tài khoản, chưa thuộc ref nào</b>\n↳ Gửi UID cho {{support}} để được đăng ký nhận backcom.\n\n` +
      `<b>3. Đã có tài khoản thuộc ref khác (chuyển IB)</b>\n↳ Đăng ký tài khoản mới qua link: {{refLink}}\n↳ Sau đó chuyển KYC từ tài khoản cũ sang tài khoản mới.\n\n` +
      `<a href="https://www.thuckhuyacungforex.com/bingx-chuyen-ib-nhan-backcom">👉 Xem hướng dẫn</a>\n\n` +
      `💡 Sau khi hoàn tất, dùng <b>Check hoàn phí</b> để kiểm tra tài khoản đã vào hệ thống Backcom chưa.`,
    en:
      `📖 <b>How to open an account or transfer your IB - BINGX</b>\n\n` +
      `<b>1. No BingX account yet</b>\n↳ Register here: {{refLink}}\n↳ Complete KYC, then trade as usual.\n\n` +
      `<b>2. Have an account, not under any referral</b>\n↳ Send your UID to {{support}} to be registered for backcom.\n\n` +
      `<b>3. Have an account under another referral (IB transfer)</b>\n↳ Register a new account here: {{refLink}}\n↳ Then transfer your KYC from the old account to the new one.\n\n` +
      `<a href="https://www.thuckhuyacungforex.com/bingx-chuyen-ib-nhan-backcom">👉 View guide</a>\n\n` +
      `💡 When done, use <b>Check rebate</b> to confirm your account is in the Backcom system.`,
  },

  vantage: {
    vi:
      `📖 <b>Hướng dẫn tạo tài khoản hoặc chuyển IB - Vantage</b>\n\n` +
      `<b>1. Chưa có tài khoản Vantage</b>\n↳ Đăng ký qua link: {{refLink}}\n↳ Hoàn tất xác minh, nạp tiền và giao dịch.\n<a href="https://www.youtube.com/watch?v=lweV75Ctih0">👉 Xem hướng dẫn</a>\n\n` +
      `<b>2. Đã có tài khoản Vantage (chuyển IB)</b>\n↳ Dùng Email đã đăng kí tài khoản để gửi mail chuyển IB như sau\n- <b>Gửi đến:</b> <code>vietnam.support@vantagemarkets.com</code>\n- <b>Chủ đề:</b> <code>Change Account Owner</code>\n- <b>Nội dung:</b> <code>Hi team, Please move my account under IB 32367453</code>\n↳ Nhắn tin cho @MoonBackcom email của bạn để được duyệt nhanh hơn\n<a href="https://www.thuckhuyacungforex.com/vantage-chuyen-ib-nhan-backcom">👉 Xem hướng dẫn</a>\n\n` +
      `💡 Sau khi hoàn tất, dùng <b>Check hoàn phí</b> để kiểm tra.`,
    en:
      `📖 <b>How to open an account or transfer your IB - Vantage</b>\n\n` +
      `<b>1. No Vantage account yet</b>\n↳ Register here: {{refLink}}\n↳ Complete verification, deposit and trade.\n<a href="https://www.youtube.com/watch?v=lweV75Ctih0">👉 Watch tutorial</a>\n\n` +
      `<b>2. Already have a Vantage account (IB transfer)</b>\n↳ Use your registered email to send an email for IB transfer as follows:\nTo: <code>vietnam.support@vantagemarkets.com</code>\nSubject: <code>Change Account Owner</code>\nBody: <code>Hi team, Please move my account under IB 32367453</code>\n\n↳ Message @MoonBackcom with your email for faster approval.\n<a href="https://www.thuckhuyacungforex.com/vantage-chuyen-ib-nhan-backcom">👉 View guide</a>\n\n` +
      `💡 When done, use <b>Check rebate</b> to verify.`,
  },
};

function getGuide(exchange, lang) {
  const set = GUIDES[exchange.id];
  const raw = set && (set[lang] || set.vi);
  if (!raw) return null;
  return raw.replace(/\{\{refLink\}\}/g, exchange.refLink).replace(/\{\{support\}\}/g, SUPPORT);
}

module.exports = { getGuide };
