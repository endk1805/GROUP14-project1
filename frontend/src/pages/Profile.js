// --- File: frontend/src/pages/Profile.js (Đã thêm lại Avatar Display) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Đảm bảo bạn đang import đúng file CSS cho giao diện mong muốn
import './ProfileGlass.css'; 

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const Profile = () => {
    const [user, setUser] = useState(null);
    // Form states
    const [name, setName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    // Message states
    const [message, setMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            const fetchUser = async () => {
                try {
                        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`);
                    setUser(res.data);
                    setName(res.data.name);
                    setEmailInput(res.data.email);
                } catch (err) {
                    console.error("Token lỗi hoặc hết hạn", err);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            };
            fetchUser();
        } else {
            window.location.href = '/login';
        }
    }, [token]);

    // Update Password handler
    const onPasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage(''); setPasswordMessage(''); setIsError(false);
        if (!currentPassword || !newPassword || !confirmPassword) { setPasswordMessage('Vui lòng nhập đầy đủ các trường mật khẩu.'); setIsError(true); return; }
        if (newPassword.length < 6) { setPasswordMessage('Mật khẩu mới phải có ít nhất 6 ký tự.'); setIsError(true); return; }
        if (newPassword !== confirmPassword) { setPasswordMessage('Mật khẩu mới và xác nhận không khớp.'); setIsError(true); return; }
        try {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/password`, { currentPassword, newPassword });
            setPasswordMessage('Đổi mật khẩu thành công!');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err) {
            console.error("Lỗi đổi mật khẩu:", err);
            setPasswordMessage(`Đổi mật khẩu thất bại: ${err.response?.data?.msg || err.message}`);
            setIsError(true);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
        setMessage(''); setPasswordMessage('');
        setIsError(false);
    };

    // Handle avatar upload
    const onAvatarUpload = async () => {
        if (!avatarFile) { setMessage('Vui lòng chọn file.'); setIsError(true); return; }
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        setMessage('Đang tải ảnh lên...'); setPasswordMessage(''); setIsError(false);
        try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/profile/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setUser(prevUser => ({ ...prevUser, avatar: res.data.avatarUrl }));
            setMessage('Cập nhật ảnh đại diện thành công!');
            setAvatarFile(null);
        } catch (err) {
            console.error("Lỗi tải avatar:", err);
            setMessage(`Tải ảnh lên thất bại: ${err.response?.data?.msg || err.message}`);
            setIsError(true);
        }
    };

    // Combined Save Changes handler for Name & Email
    const handleSaveChanges = async () => {
        setMessage(''); setPasswordMessage(''); setIsError(false);
        const updateData = {};
        if (name && name.trim() !== user.name) { updateData.name = name.trim(); }
        if (emailInput && emailInput.trim().toLowerCase() !== user.email) {
             if (!/\S+@\S+\.\S+/.test(emailInput.trim())) {setMessage('Định dạng email không hợp lệ.'); setIsError(true); return; }
            updateData.email = emailInput.trim().toLowerCase();
        }

        if (Object.keys(updateData).length > 0) {
            try {
                 const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, updateData);
                setUser(res.data);
                setName(res.data.name);
                setEmailInput(res.data.email);
                setMessage('Lưu thay đổi thành công!');
            } catch (err) {
                 console.error("Lỗi khi lưu thay đổi:", err);
                 setMessage(`Lưu thay đổi thất bại: ${err.response?.data?.msg || err.message}`);
                 setIsError(true);
            }
        } else {
             setMessage('Không có thay đổi nào để lưu.');
        }
    };

    if (!token) return null;
    if (!user) {
        return (
            <div className="profile-page-wrapper">
                <h2 style={{ color: 'white' }}>Đang tải thông tin...</h2>
            </div>
        );
    }

    // === PHẦN RETURN ĐÃ SỬA ===
    return (
        <div className="profile-page-wrapper">
            <div className="profile-container profile-container-dark-glass"> {/* Add dark glass class */}

                {/* --- Outer Header --- */}
                <div className="profile-header">
                    <h2 className="profile-main-title" style={{color: '#ffffff'}}>Thông Tin Tài Khoản</h2>
                    <p className="profile-subtitle" style={{color: 'rgba(255,255,255,0.7)'}}>Xem và cập nhật thông tin tài khoản của bạn</p>
                </div>

                {/* --- Inner Card Title (Optional) --- */}
                {/* <h3 className="inner-card-title" style={{color: '#fff'}}>Chỉnh Sửa Thông Tin</h3> */}

                {/* === KHUNG HIỂN THỊ AVATAR TRÒN === */}
                 <div style={{ textAlign: 'center', marginBottom: '20px' }}> {/* Simple centering wrapper */}
                    <div className="avatar-display"> {/* Use class from ProfilePage.css */}
                        {user.avatar ? (
                            <img src={user.avatar} alt="Ảnh đại diện" />
                        ) : (
                            <span>{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        )}
                    </div>
                </div>
                {/* ================================ */}

                {/* --- User Info Display --- */}
                <div className="profile-info-textboxes">
                    <div className="profile-form-group"> <label>TÊN:</label> <input type="text" className="form-input info-input" value={user.name} readOnly /> </div>
                    <div className="profile-form-group"> <label>EMAIL:</label> <input type="email" className="form-input info-input" value={user.email} readOnly /> </div>
                    <div className="profile-form-group"> <label>VAI TRÒ:</label> <input type="text" className="form-input info-input" value={user.role} readOnly /> </div>
                    <div className="profile-form-group"> <label>ID TOKEN (User ID):</label> <input type="text" className="form-input info-input id-input" value={user._id} readOnly /> </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0' }} />

                {/* --- Avatar Upload Section (Input/Button) --- */}
                <div className="avatar-section">
                     <label htmlFor="avatar-upload-main"> <span className="icon">🖼️</span> Thay đổi ảnh đại diện: </label>
                     <input id="avatar-upload-main" type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ padding: '10px' }} />
                     {avatarFile && <span className="avatar-file-name" style={{textAlign:'left', marginLeft:'5px'}}>{avatarFile.name}</span>}
                     {avatarFile && (<button onClick={onAvatarUpload} className="avatar-upload-button"> Tải Ảnh Này Lên </button> )}
                </div>

                {/* --- REMOVED DUPLICATE UPLOAD FIELDS --- */}
                
                {/* --- Name/Email Update Grid --- */}
                <div className="profile-form-grid">
                    <div className="profile-form-group">
                        <label htmlFor="profile-name-edit"> <span className="icon">👤</span> Họ và tên * </label>
                        <input id="profile-name-edit" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="profile-form-group">
                         <label htmlFor="profile-email-edit"> <span className="icon">📧</span> Email * </label>
                        <input id="profile-email-edit" type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required />
                    </div>
                     {/* Placeholder Phone */}
                     <div className="profile-form-group"> <label htmlFor="profile-phone"> <span className="icon">📞</span> Số điện thoại </label> <input id="profile-phone" type="tel" placeholder="Nhập số điện thoại" disabled /> <div className="input-hint">Ví dụ: 0912345678</div> </div>
                     {/* Placeholder Address */}
                     <div className="profile-form-group full-width"> <label htmlFor="profile-address"> <span className="icon">🏠</span> Địa chỉ </label> <textarea id="profile-address" placeholder="Nhập địa chỉ chi tiết" disabled /> </div>
                </div>

                {/* --- Password Section --- */}
                <div className="password-section">
                    {!showPasswordForm ? (
                        <button onClick={() => { setShowPasswordForm(true); setPasswordMessage(''); setIsError(false); }} className="password-toggle-btn"> Thay Đổi Mật Khẩu </button>
                    ) : (
                        <div className="password-change-form">
                            <form onSubmit={onPasswordUpdate}>
                                <div className="profile-form-group"> <label>Mật khẩu hiện tại:</label> <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-input" required /> </div>
                                <div className="profile-form-group"> <label>Mật khẩu mới (tối thiểu 6 ký tự):</label> <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input" required minLength={6} /> </div>
                                <div className="profile-form-group"> <label>Xác nhận mật khẩu mới:</label> <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input" required minLength={6} /> </div>
                                <div className="password-form-actions">
                                    <button type="submit" className="profile-btn save save-password"> Lưu Thay Đổi </button>
                                    <button type="button" onClick={() => setShowPasswordForm(false)} className="profile-btn cancel cancel-password"> Hủy </button>
                                </div>
                                {passwordMessage && ( <p className={`profile-message ${isError ? 'error' : 'success'}`}> {passwordMessage} </p> )}
                            </form>
                        </div>
                    )}
                </div>

                {/* --- Main Action Buttons --- */}
                <div className="profile-actions">
                     <button type="button" className="profile-btn cancel" onClick={() => window.history.back()}> Hủy </button>
                     <button type="button" className="profile-btn save" onClick={handleSaveChanges}> Lưu Thay Đổi </button>
                </div>

                {/* --- General Message Area --- */}
                {message && ( <p className={`profile-message ${isError ? 'error' : 'success'}`}> {message} </p> )}

            </div> {/* End profile-container */}
        </div> 
    ); 
}; 
export default Profile;