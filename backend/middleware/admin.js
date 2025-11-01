// --- File: backend/middleware/admin.js (Cleaned) ---

// Middleware này phải được dùng SAU middleware 'auth'
module.exports = function(req, res, next) {
  // Kiểm tra xem trường 'role' trong thông tin user (được middleware 'auth' giải mã từ token)
  // có phải là 'Admin' không.
  if (!req.user || req.user.role !== 'Admin') { // Added check for req.user existence
    // Nếu không có user hoặc không phải Admin, trả về lỗi 403 Forbidden (Cấm truy cập)
    return res.status(403).json({ msg: 'Không có quyền Admin, từ chối truy cập' });
  }
  // Nếu là Admin, cho phép request đi tiếp đến hàm xử lý tiếp theo (API)
  next();
}; // <-- Ensure this is the final closing brace and semicolon (optional) is correct