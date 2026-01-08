// backend/controllers/user.controller.js
const User = require("../models/usersModel"); // สมมติคุณมี model User

exports.updateUser = async (req, res) => {
  try {
    const { userId, user_birthdate, user_phone, user_allergies } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { user_birthdate, user_phone, user_allergies },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
