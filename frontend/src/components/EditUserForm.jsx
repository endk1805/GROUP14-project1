import React, { useState, useEffect } from 'react';

const EditUserForm = ({ user, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...user, name, email });
    };

    return (
        <form onSubmit={handleSubmit} className="edit-user-form">
            <h3>Chỉnh sửa người dùng</h3>
            <div className="form-group">
                <label htmlFor="edit-name">Tên người dùng</label>
                <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div className="button-group">
                <button type="submit" className="button button--primary">
                    Lưu thay đổi
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="button button--secondary"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default EditUserForm;