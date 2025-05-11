const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// POST /api/users/register

router.post("/register", async (req, res) => {
  const { name, email, role_id } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    let userId;
    let isNew = false;

    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const [result] = await db.query(
        "INSERT INTO users (name, email, role_id) VALUES (?, ?, ?)",
        [name, email, role_id]
      );
      userId = result.insertId;
      isNew = true;
    }

    const token = jwt.sign(
      { userId, name, email, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, isNew });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

module.exports = router;
