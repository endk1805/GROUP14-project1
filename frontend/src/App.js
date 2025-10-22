import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import Toast from './components/Toast';
import './App.css';

// Định nghĩa URL của backend để dễ dàng thay đổi khi cần.
// Nếu muốn override, đặt REACT_APP_API_URL (ví dụ: http://api.example.com/api)
const API_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || 'http://localhost:8080/api';

function App() {
    // Tạo biến trạng thái 'users' để lưu trữ danh sách người dùng
    const [users, setUsers] = useState([]);
    // Search và loading state
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    
    // State cho toast notification
    const [toast, setToast] = useState(null);

    // Hàm hiển thị toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // useEffect là một "hook" đặc biệt của React.
    // Code bên trong nó sẽ được chạy sau khi component được render lần đầu tiên.
    // Dấu ngoặc vuông [] ở cuối có nghĩa là "chỉ chạy đúng 1 lần duy nhất".
    useEffect(() => {
        // Định nghĩa một hàm để gọi API và lấy danh sách người dùng
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/users`);
                // Chuẩn hoá mỗi user để có trường `id` (UserList, AddUser dùng `id`)
                const normalized = response.data.map(u => ({ ...u, id: u._id }));
                setUsers(normalized); // Cập nhật danh sách users với dữ liệu từ server
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUsers(); // Gọi hàm đó
    }, []);

    // Hàm này sẽ được truyền xuống cho component AddUser
    const handleUserAdded = async (newUser) => {
        try {
            // Gửi dữ liệu người dùng mới lên server bằng phương thức POST
            const response = await axios.post(`${API_URL}/users`, newUser);

            // response.data là user vừa tạo. Chuẩn hoá để có `id`.
            const created = { ...response.data, id: response.data._id };

            // Cập nhật danh sách người dùng trên giao diện mà không cần tải lại trang
            setUsers(prev => [created, ...prev]); // thêm lên đầu
            showToast('✨ Thêm người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
            showToast('❌ Không thể thêm người dùng. Vui lòng thử lại!', 'error');
        }
    };

    // Hàm xóa người dùng
    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            // Cập nhật danh sách bằng cách loại bỏ user đã xóa
            setUsers(prev => prev.filter(user => user.id !== userId));
            showToast('🗑️ Đã xóa người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            showToast('❌ Không thể xóa người dùng. Vui lòng thử lại!', 'error');
        }
    };

    // Hàm cập nhật người dùng
    const handleUpdateUser = async (userId, updatedUser) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, updatedUser);
            // Cập nhật danh sách với thông tin mới
            const updated = { ...response.data, id: response.data._id };
            setUsers(prev => prev.map(user => user.id === userId ? updated : user));
            showToast('✏️ Cập nhật người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            showToast('❌ Không thể cập nhật người dùng. Vui lòng thử lại!', 'error');
        }
    };

    return (
        <div className="App">
            <h1>🎯 Quản Lý Người Dùng</h1>
            <div className="app-toolbar">
                <div className="search-wrap">
                    <input
                        aria-label="Tìm kiếm người dùng"
                        className="search-input"
                        placeholder="Tìm theo tên hoặc email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {loading && (
                    <div className="spinner" aria-hidden="true"></div>
                )}
            </div>

            <div className="app-container">
                {/* Truyền hàm handleUserAdded xuống cho AddUser */}
                <AddUser onUserAdded={handleUserAdded} />
                {/* Truyền danh sách users và các hàm xử lý xuống cho UserList */}
                <UserList 
                    users={users.filter(u => {
                        if (!query.trim()) return true;
                        const q = query.toLowerCase();
                        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                    })} 
                    onDeleteUser={handleDeleteUser}
                    onUpdateUser={handleUpdateUser}
                />
            </div>
            
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default App;