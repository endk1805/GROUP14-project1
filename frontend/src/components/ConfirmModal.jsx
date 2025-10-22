import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon">⚠️</div>
                    <h2>Xác Nhận Xóa</h2>
                </div>
                <div className="modal-body">
                    <p>Bạn có chắc chắn muốn xóa người dùng:</p>
                    <p className="user-name-highlight">"{userName}"?</p>
                    <p className="warning-text">Hành động này không thể hoàn tác!</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>
                        ❌ Hủy
                    </button>
                    <button className="btn-modal-confirm" onClick={onConfirm}>
                        ✓ Xác Nhận Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
