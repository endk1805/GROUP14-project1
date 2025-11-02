
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Tái sử dụng CSS

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang gửi yêu cầu...');
        setIsError(false);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
            setMessage(res.data.msg); // "Email reset đã được gửi."
        } catch (err) {
            console.error("Lỗi forgot password:", err);
            setMessage(err.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại.');
            setIsError(true);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <h2 className="auth-title">Quên Mật Khẩu</h2>
                <p style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '1.5rem', color: '#6c757d' }}>
                    Nhập email của bạn để nhận link đặt lại mật khẩu.
                </p>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email đã đăng ký"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Gửi Link Reset
                    </button>
                </form>
                {message && (
                    <p className={`auth-message ${isError ? 'error' : 'success'}`} style={{ marginTop: '1rem' }}>
                        {message}
                    </p>
                )}
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    <a href="/login" style={{ color: '#5E81AC' }}>Quay lại Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;