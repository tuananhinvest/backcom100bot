const fmt = (n, d = 2) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// Tỉ giá hiển thị gọn: 18 -> "18", 12.5 -> "12.5"
const fmtRate = (n) => String(+Number(n).toFixed(2));

/** Hai đầu bằng nhau -> 1 giá trị, khác nhau -> "min - max". */
function fmtRange(min, max, f = fmt) {
  const a = f(min), b = f(max);
  return a === b ? a : `${a} - ${b}`;
}

module.exports = { fmt, fmtRate, fmtRange };
