import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUserForm from './components/EditUserForm';
import './App.css';

// Định nghĩa URL của backend để dễ dàng thay đổi khi cần
// <<< SỬA LỖI 1: Đổi port từ 3000 thành 5000 cho khớp với backend
const API_URL = "http://localhost:3000/api/users"; 

function App() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    // Tải danh sách người dùng
    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            alert("Không thể tải danh sách người dùng");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm này sẽ được truyền xuống cho component AddUser
    const handleUserAdded = async (newUser) => {
        try {
            // Gửi dữ liệu người dùng mới lên server bằng phương thức POST
            const response = await axios.post(API_URL, newUser);
            console.log('Server response:', response.data);
            
            // <<< SỬA LỖI 2: Chỉ cập nhật state 1 LẦN với data server trả về
            // Bỏ đi lệnh gọi axios.get(API_URL) bị thừa
            setUsers([...users, response.data]);
            
            return response.data; // Trả về dữ liệu cho component AddUser
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
            throw error; // Ném lỗi để component AddUser có thể xử lý
        }
    };

    // Bắt đầu chỉnh sửa người dùng
    const handleEdit = (user) => {
        setEditingUser(user);
    };

    // Lưu thông tin người dùng sau khi chỉnh sửa
    const handleUpdateUser = async (updatedUser) => {
        try {
            const response = await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);
            setUsers(users.map(user => 
                user.id === updatedUser.id ? response.data : user
            ));
            setEditingUser(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            alert("Không thể cập nhật thông tin người dùng");
        }
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    // Xóa người dùng
    const handleDelete = async (user) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng ${user.name}?`)) {
            try {
                console.log('Deleting user:', user); // Thêm log để debug
                const response = await axios.delete(`${API_URL}/${user.id}`);
                console.log('Delete response:', response); // Thêm log để debug
                
                if (response.status === 200) {
                    setUsers(users.filter(u => u.id !== user.id));
                    alert('Xóa người dùng thành công!');
                }
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                alert("Không thể xóa người dùng. Lỗi: " + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="app">
            <div className="bg-image"></div>
            <div className="bg-overlay"></div>
            <div className="header">
                <nav className="nav">
                    <div className="nav__menu">☰</div>
                    <h1 className="nav__title">Quản lý người dùng</h1>
                </nav>
            </div>
            <div className="container">
                <div className="content">
                    <div className="card">
                        {editingUser ? (
                            <EditUserForm
                                user={editingUser}
                                onSubmit={handleUpdateUser}
                                onCancel={handleCancelEdit}
                            />
                        ) : (
                            <AddUser onUserAdded={handleUserAdded} />
                        )}
                    </div>
                    <div className="card">
                        <UserList 
                            users={users} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;