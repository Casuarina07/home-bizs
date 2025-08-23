// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // mysql2/promise connection or pool
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, role_id } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 1) Does user exist?
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    let user; // will hold the full row we return
    let isNew = false;

    if (rows.length > 0) {
      // Existing user
      user = rows[0];
    } else {
      // New user — insert
      const role = role_id || 2; // default role if not provided
      const [result] = await db.query(
        "INSERT INTO users (name, email, role_id) VALUES (?, ?, ?)",
        [name || email.split("@")[0], email, role]
      );

      // Build the user object to return
      user = {
        id: result.insertId,
        name: name || email.split("@")[0],
        email,
        role_id: role,
      };
      isNew = true;
    }

    // 2) Sign app token (include minimal claims)
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    // 3) Return token + user so the frontend can greet by name
    return res.status(isNew ? 201 : 200).json({
      token,
      isNew,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

module.exports = router;
