// --- File: frontend/src/App.js (Đã tích hợp) ---
import React from 'react';
// === THAY ĐỔI IMPORT: Thêm NavLink và alias nó thành Link ===
import { BrowserRouter, Routes, Route, NavLink as Link } from 'react-router-dom';
import './App.css'; // Load CSS chính
import { AuthProvider, AuthContext } from './context/AuthContext'; // <-- IMPORT AuthContext
import { useContext } from 'react'; // <-- IMPORT useContext

// Import các trang
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// === TẠO COMPONENT HEADER MỚI ===
const AppHeader = () => {
    // Lấy thông tin user và hàm logout từ Context
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="app-header"> {/* Dùng class từ App.css */}
            <nav className="app-nav"> {/* Dùng class từ App.css */}
                {!user ? ( // Nếu chưa đăng nhập
                    <>
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/signup">Đăng ký</Link>
                    </>
                ) : ( // Nếu đã đăng nhập
                    <>
                        {/* Các link chính */}
                        <Link to="/">Trang chủ</Link> {/* Ví dụ thêm link trang chủ */}
                        <Link to="/profile">Trang cá nhân</Link>
                        {user.role === 'Admin' && ( // Chỉ hiện nếu là Admin
                           <Link to="/admin">Quản lý User</Link>
                        )}

                        {/* Phần hiển thị thông tin user bên phải */}
                        <div className="user-info-display">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="header-avatar"/>
                            ) : (
                                // Hiển thị chữ cái đầu nếu không có avatar
                                <div className="header-avatar-placeholder">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <span className="header-username">{user.name}</span>
                            {/* Nút đăng xuất gọi hàm logout từ context */}
                            <button onClick={logout} className="logout-button">Đăng xuất</button>
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
};
// =============================


function App() {
  return (
    // === BỌC TOÀN BỘ APP BẰNG AuthProvider ===
    <AuthProvider>
        <BrowserRouter>
            {/* Gọi component Header mới */}
            <AppHeader />

            {/* Phần nội dung chính của trang */}
            <main className="app-main-content"> {/* Thêm class để CSS nếu cần */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {/* Route cho trang chủ */}
                    <Route path="/" element={
                        <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                            <h2>Chào mừng đến với ứng dụng!</h2>
                        </div>
                    } />
                </Routes>
            </main>
        </BrowserRouter>
    </AuthProvider>
    // ===================================
  );
}

export default App;
