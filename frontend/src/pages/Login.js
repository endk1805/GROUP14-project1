// --- File: frontend/src/pages/Login.js (Updated with AuthContext) ---
import React, { useState, useContext } from 'react'; // <-- Import useContext
import axios from 'axios';
import './Auth.css'; // Your styling
import { AuthContext } from '../context/AuthContext'; // <-- IMPORT AUTHCONTEXT
import { Navigate, Link } from 'react-router-dom'; // <-- Import Navigate for redirection, Link for forgot password

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  // Get login function and current user state from AuthContext
  const { login, user } = useContext(AuthContext); 

  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMessage(''); // Clear previous message
    setIsError(false);
    try {
      const res = await axios.post('http://localhost:3002/api/auth/login', formData);

      // === CHANGE HERE: Use the login function from context ===
      // This will handle saving the token AND updating the global user state
      login(res.data.token); 
      // =======================================================
      
      // No need to set message or redirect here, context handles it by updating 'user' state
      setMessage('Đăng nhập thành công! Đang chuyển hướng...'); 
     setTimeout(() => { window.location.href = '/profile'; }, 1500); 

    } catch (err) {
      setIsError(true);
      if (err.response) {
        setMessage(err.response.data.msg); // Show login error (e.g., "Email or password incorrect")
      } else {
        setMessage("Không thể kết nối server. Backend đã chạy chưa?"); // Network error
      }
    }
  };

  // If the user is ALREADY logged in (user object exists in context), redirect them
  if (user) {
      return <Navigate to="/profile" replace />; // Use Navigate for better redirection
  }

  // Render the login form
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập</h2>
        
        <form className="auth-form" onSubmit={onSubmit}>
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
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Đăng nhập
          </button>
        </form>

        {/* Use Link component for internal navigation */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/forgot-password" style={{ color: '#E5E9F0', fontSize: '0.9rem' }}>Quên mật khẩu?</Link>
        </div>

        {/* Display messages */}
        {message && (
          <p className={`auth-message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;