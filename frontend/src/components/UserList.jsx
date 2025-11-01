import React from 'react';

// Component này nhận các props: users (mảng người dùng) và các hàm xử lý sự kiện
const UserList = ({ users, onEdit, onDelete }) => {
    console.log('UserList received users:', users); // Log để debug

    return (
        <div className="user-list-section">
            <h2 className="section-title">Danh sách người dùng</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id || user.email}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button 
                                            className="button button--small"
                                            onClick={() => onEdit && onEdit(user)}
                                            type="button"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            className="button button--small button--danger"
                                            onClick={() => onDelete && onDelete(user)}
                                            type="button"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>
                                    Chưa có người dùng nào trong danh sách
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
