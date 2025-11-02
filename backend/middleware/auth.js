const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Lấy token từ header
  const authHeader = req.header('Authorization'); // Sửa tên biến cho rõ ràng hơn
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) { // Kiểm tra kỹ hơn
    return res.status(401).json({ msg: 'Không có token hoặc định dạng sai, từ chối truy cập' });
  }

  try {
    // 2. Tách "Bearer "
    const token = authHeader.split(' ')[1]; 
    if (!token) { // Nếu chỉ có "Bearer " mà không có token
        return res.status(401).json({ msg: 'Token bị thiếu' });
    }

    // 3. Xác thực token (SỬA Ở ĐÂY)
    // Lấy secret key từ file .env, nếu không có thì mới dùng key dự phòng
    const secretKey = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';
    const decoded = jwt.verify(token, secretKey);

    // 4. Gắn thông tin user
    req.user = decoded.user; 
    next();

  } catch (err) {
    // Phân biệt lỗi token hết hạn và lỗi khác
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token đã hết hạn' });
    }
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};