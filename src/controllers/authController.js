const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({
        success: false,
        message: "⚠️ Mohon lengkapi data — username dan password wajib diisi!"
      });

    const [exist] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (exist.length > 0)
      return res.status(409).json({
        success: false,
        message: "😅 Username sudah terdaftar, coba nama lain ya!"
      });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: `🎉 Selamat datang, ${username}! Akun kamu berhasil dibuat.`,
      data: { id: result.insertId, username }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "🔥 Terjadi kesalahan di server, coba lagi nanti.",
      error: error.message
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    const user = users[0];

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({
        success: false,
        message: "❌ Username atau password kamu salah. Coba lagi ya!"
      });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: `✅ Login sukses! Selamat datang kembali, ${username}.`,
      token,
      note: "Gunakan token ini di header Authorization dengan format: Bearer <token>"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "⚡ Server sedang sibuk. Mohon coba beberapa saat lagi.",
      error: error.message
    });
  }
};
