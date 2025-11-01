// controllers/userController.js
let users = [
    { id: 1, name: "Kiet", email: "kiet@example.com" },
    { id: 2, name: "Phuc", email: "phuc@example.com" }
];
let nextId = 3; 

exports.getUsers = (req, res) => {
    res.status(200).json(users);
};

exports.addUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Vui lòng nhập đủ tên và email" });
    }
    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
};

// HÀM QUAN TRỌNG ĐỂ SỬA LỖI
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    if (!name || !email) {
        return res.status(400).json({ message: "Vui lòng nhập đủ tên và email" });
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.status(200).json(users[userIndex]);
};

// HÀM QUAN TRỌNG ĐỂ SỬA LỖI
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const initialLength = users.length;
    users = users.filter(u => u.id != id);

    if (users.length === initialLength) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để xóa" });
    }
    res.status(200).json({ message: "Xóa người dùng thành công" });
};