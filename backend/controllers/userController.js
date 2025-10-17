// controllers/userController.js

let users = [
  { id: 1, name: "Kiet", email: "kiet@example.com" },
  { id: 2, name: "Phuc", email: "phuc@example.com" }
];

// [GET] /api/users
exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// [POST] /api/users
exports.addUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Missing name or email" });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};
