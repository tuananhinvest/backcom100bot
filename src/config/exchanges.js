// ============================================================================
// CẤU HÌNH SÀN - sửa thông số backcom ở đây (một nơi duy nhất)
//   rebatePercent : tỉ lệ backcom hoàn cho khách (%), ví dụ 100
//   ratePerLotMin : tỉ giá backcom thấp nhất (USD / lot)
//   ratePerLotMax : tỉ giá backcom cao nhất  (USD / lot)
//   (Min = Max => ước tính ra 1 giá trị; Min < Max => ước tính ra khoảng)
//   Backcom = số lot × ratePerLot × rebatePercent / 100
// id phải khớp cột `exchange` trong bảng backcom_user (chữ thường).
// ============================================================================
const EXCHANGES = [
  {
    id: 'bingx',
    name: 'BINGX',
    refLink: 'https://bingxdao.com/partner/thuckhuya/',
    rebatePercent: 100,
    ratePerLotMin: 9.68,
    ratePerLotMax: 9.68,
  },
  {
    id: 'vantage',
    name: 'Vantage',
    refLink: 'https://vigco.co/la-com-inv/vi/thuckhuya',
    rebatePercent: 100,
    ratePerLotMin: 11.3,
    ratePerLotMax: 18,
  },
];

function getExchange(id) {
  return EXCHANGES.find((e) => e.id === id);
}

/** Ước tính backcom (USD) theo số lot: trả về { min, max }. */
function calculateBackcom(exchangeId, lots) {
  const ex = getExchange(exchangeId);
  if (!ex) throw new Error(`Exchange not found: ${exchangeId}`);
  if (!lots || lots <= 0) throw new Error('Invalid lots');
  const a = (lots * ex.ratePerLotMin * ex.rebatePercent) / 100;
  const b = (lots * ex.ratePerLotMax * ex.rebatePercent) / 100;
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

module.exports = { EXCHANGES, getExchange, calculateBackcom };
