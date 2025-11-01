// --- File: frontend/src/pages/ResetPassword.js ---
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Hook để lấy token từ URL và chuyển hướng
import './Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { token } = useParams(); // Lấy token từ URL (ví dụ: /reset-password/:token)
    const navigate = useNavigate(); // Dùng để chuyển hướng sau khi thành công

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp.');
            setIsError(true);
            return;
        }
        if (password.length < 6) {
             setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
             setIsError(true);
             return;
        }

        setMessage('Đang xử lý...');
        setIsError(false);
        try {
            // Gọi API reset với token từ URL và password mới từ body
            const res = await axios.post(`http://localhost:3002/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.msg + " Bạn sẽ được chuyển về trang đăng nhập sau 3 giây.");
            // Chuyển về trang đăng nhập sau 3 giây
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error("Lỗi reset password:", err);
            setMessage(err.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại.');
            setIsError(true);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <h2 className="auth-title">Đặt Lại Mật Khẩu</h2>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                            required
                            minLength={6}
                        />
                    </div>
                     <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Đặt Lại Mật Khẩu
                    </button>
                </form>
                {message && (
                    <p className={`auth-message ${isError ? 'error' : 'success'}`} style={{ marginTop: '1rem' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;