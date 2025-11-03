require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./src/routes/authRoutes");

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Server JWT aktif dan siap digunakan!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server berjalan di port ${PORT}`);
});
