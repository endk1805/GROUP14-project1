import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import './UserList.css';

// Component này nhận các props: users (danh sách), onDeleteUser, onUpdateUser
const UserList = ({ users, onDeleteUser, onUpdateUser }) => {
    // State để quản lý user đang được chỉnh sửa
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    
    // State cho modal xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Hàm để lấy chữ cái đầu tiên của tên làm avatar
    const getInitials = (name) => {
        return name.charAt(0).toUpperCase();
    };

    // Bắt đầu chỉnh sửa user
    const startEditing = (user) => {
        setEditingId(user.id);
        setEditName(user.name);
        setEditEmail(user.email);
    };

    // Hủy chỉnh sửa
    const cancelEditing = () => {
        setEditingId(null);
        setEditName('');
        setEditEmail('');
    };

    // Lưu thay đổi
    const saveEdit = (userId) => {
        if (editName.trim() && editEmail.trim()) {
            onUpdateUser(userId, { name: editName, email: editEmail });
            cancelEditing();
        }
    };

    // Hiển thị modal xác nhận xóa
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Xử lý xóa user
    const handleDeleteConfirmed = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    // Đóng modal
    const closeModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    return (
        <div className="user-list-container">
            <h2>Danh Sách Người Dùng</h2>
            {users.length > 0 && (
                <div className="user-count">
                    Tổng số: {users.length} người dùng
                </div>
            )}
            {users.length === 0 ? (
                <div className="no-users">
                    Chưa có người dùng nào. <br />
                    Hãy thêm người dùng đầu tiên!
                </div>
            ) : (
                <ul className="users-list">
                    {users.map((user, index) => (
                        <li key={user.id || index} className="user-item">
                            {editingId === user.id ? (
                                // Chế độ chỉnh sửa
                                <div className="edit-mode">
                                    <div className="user-avatar">
                                        {getInitials(editName || user.name)}
                                    </div>
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="edit-input"
                                            placeholder="Tên người dùng"
                                        />
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="edit-input"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="edit-actions">
                                        <button 
                                            onClick={() => saveEdit(user.id)}
                                            className="btn-save"
                                            title="Lưu"
                                        >
                                            ✓
                                        </button>
                                        <button 
                                            onClick={cancelEditing}
                                            className="btn-cancel"
                                            title="Hủy"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Chế độ hiển thị thông thường
                                <>
                                    <div className="user-avatar">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                    <div className="user-actions">
                                        <button 
                                            onClick={() => startEditing(user)}
                                            className="btn-edit"
                                            title="Sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => confirmDelete(user)}
                                            className="btn-delete"
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            
            {/* Modal xác nhận xóa */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={closeModal}
                onConfirm={handleDeleteConfirmed}
                userName={userToDelete?.name}
            />
        </div>
    );
};

export default UserList;