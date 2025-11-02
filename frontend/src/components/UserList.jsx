import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import './UserList.css';

// Component nhận các props: users, onDeleteUser, onUpdateUser
const UserList = ({ users, onDeleteUser, onUpdateUser }) => {
    // Quản lý trạng thái chỉnh sửa
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    // Modal xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Lấy chữ cái đầu làm avatar
    const getInitials = (name = '') => name.charAt(0)?.toUpperCase() || '?';

    // Bắt đầu chỉnh sửa
    const startEditing = (user) => {
        setEditingId(user._id); // ✅ dùng _id thay vì id
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

    // Xác nhận xóa
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Thực hiện xóa sau khi xác nhận
    const handleDeleteConfirmed = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete._id); // ✅ dùng _id
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

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
                    Chưa có người dùng nào. <br /> Hãy thêm người dùng đầu tiên!
                </div>
            ) : (
                <ul className="users-list">
                    {users.map((user, index) => (
                        <li key={user._id || index} className="user-item">
                            {editingId === user._id ? (
                                // 🔧 Chế độ chỉnh sửa
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
                                            onClick={() => saveEdit(user._id)}
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
                                // 👤 Chế độ xem thông thường
                                <>
                                    <div className="user-avatar">{getInitials(user.name)}</div>
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

            {/* 🧩 Modal xác nhận xóa */}
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













