const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "🔒 Akses ditolak! Token tidak ditemukan. Silakan login terlebih dahulu."
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "🚫 Token tidak valid atau sudah kedaluwarsa. Silakan login ulang."
      });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
