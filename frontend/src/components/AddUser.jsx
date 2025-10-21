import React, { useState } from 'react';
import './AddUser.css';

// Component này nhận một prop là hàm 'onUserAdded'
const AddUser = ({ onUserAdded }) => {
    // useState dùng để tạo ra các "biến trạng thái" cho component.
    // Khi giá trị của các biến này thay đổi, component sẽ được vẽ lại.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // State để quản lý lỗi validation
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = (event) => {
        // Ngăn trình duyệt tải lại trang khi submit form
        event.preventDefault();

        // Reset lỗi cũ
        setNameError('');
        setEmailError('');

        let isValid = true;

        // Validation tên
        if (!name.trim()) {
            setNameError('Tên không được để trống');
            isValid = false;
        }

        // Validation email cơ bản
        if (!email.trim()) {
            setEmailError('Email không được để trống');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email không hợp lệ (ví dụ: example@mail.com)');
            isValid = false;
        }

        if (!isValid) return; // nếu lỗi thì dừng

        // Gọi hàm onUserAdded đã được truyền từ cha và gửi dữ liệu form đi
        onUserAdded({ name: name.trim(), email: email.trim() });

        // Xóa trống các ô input sau khi đã submit
        setName('');
        setEmail('');
    };

    return (
        <div className="add-user-container">
            <h2>Thêm Người Dùng Mới</h2>
            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="form-group">
                    <label htmlFor="name">Tên người dùng</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nhập tên người dùng"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError('');
                        }}
                        required
                    />
                    {nameError && <div className="input-error">{nameError}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                        }}
                        required
                    />
                    {emailError && <div className="input-error">{emailError}</div>}
                </div>
                <button type="submit" className="submit-btn">
                    ➕ Thêm Người Dùng
                </button>
            </form>
        </div>
    );
};

export default AddUser;