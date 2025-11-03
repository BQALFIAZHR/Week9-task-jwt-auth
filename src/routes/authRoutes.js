const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");


router.post("/register", authController.register);
router.post("/login", authController.login);


router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: `🌟 Halo ${req.user.username}! Ini adalah halaman profil rahasia kamu.`,
    user: req.user
  });
});

module.exports = router;
