// --- File: frontend/src/pages/AdminDashboard.js (Corrected Syntax) ---

import React, { useState, useEffect, useCallback, useContext } from 'react'; // Added useContext, useCallback
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './AdminDashboard.css';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext); // Get token from context

  // Function to fetch users
  const fetchUsers = useCallback(async () => {
    if (!token) {
        setError('Vui lòng đăng nhập với quyền Admin.');
        setLoading(false);
        return;
    }
    setLoading(true);
    setError('');
    try {
      // Axios requests use global headers set by AuthContext
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) { // Check syntax within this block
      console.error("Lỗi fetch users:", err);
      setError(err.response?.data?.msg || 'Không thể tải danh sách. Bạn có quyền Admin không?');
      setUsers([]);
    } finally { // Ensure finally block is correct
        setLoading(false);
    } // <-- Ensure closing brace for try/catch/finally is correct
  }, [token]); // <-- Dependency array for useCallback

  // Fetch users on component mount or when fetchUsers changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // <-- Correct dependency array for useEffect

  // Function to delete a user
  const deleteUser = async (idToDelete) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này không?')) {
      if (!token) {
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'); return;
      }
  try {
  await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${idToDelete}`);
        setUsers(currentUsers => currentUsers.filter(user => user._id !== idToDelete));
        alert('Xóa thành công!');
      } catch (err) {
        console.error("Lỗi xóa user:", err);
        alert(`Xóa thất bại: ${err.response?.data?.msg || 'Lỗi không xác định'}`);
      }
    }
  }; // <-- Ensure closing brace for deleteUser is correct

  return (
    // Add wrapper div
    <div className="admin-dashboard-wrapper"> 
        {/* Add container div */}
        <div className="admin-dashboard-container"> 
          <h1>Admin - Quản lý User</h1>

          {/* Update loading/error message classes */}
          {loading && <p className="admin-loading">Đang tải...</p>} 
          {error && <p className="admin-error-message">{error}</p>} 

          {!loading && !error && (
              <table className="admin-table"> {/* Add table class */}
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                      users.map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <button onClick={() => deleteUser(user._id)} className="delete-btn">Xóa</button>
                          </td>
                        </tr>
                      ))
                  ) : (
                      // Add class for no users row
                      <tr className="no-users-row"> 
                          <td colSpan="4">Không có người dùng nào để hiển thị.</td>
                      </tr>
                  )}
                </tbody>
              </table>
          )}
        </div> {/* Close container */}
    </div> // Close wrapper
  );
};

export default AdminDashboard;