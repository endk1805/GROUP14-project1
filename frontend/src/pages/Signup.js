import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // <-- 1. IMPORT FILE CSS MỚI

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3002/api/auth/signup', formData);
      setMessage(res.data.msg); // "Đăng ký thành công"
      setIsError(false);
    } catch (err) {
      setIsError(true);
      if (err.response) {
        setMessage(err.response.data.msg); // "Email đã tồn tại"
      } else {
        setMessage("Không thể kết nối server. Backend đã chạy chưa?");
      }
    }
  };

  // 2. THAY THẾ TOÀN BỘ PHẦN RETURN
  return (
    <div className="auth-page-wrapper">
    <div className="auth-container">
      <h2 className="auth-title">Tạo tài khoản</h2>
      
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Tên</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Mật khẩu (tối thiểu 6 ký tự)</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={password}
            onChange={onChange}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" className="auth-button">
          Đăng ký
        </button>
      </form>
      
      {message && (
        <p className={`auth-message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
    </div>
  );
};

export default Signup;