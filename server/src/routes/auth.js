const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { nama_lengkap, email, password, no_telepon } = req.body;

    if (!nama_lengkap || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Lengkapi semua field",
      });
    }

    // Cek email sudah terdaftar
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Buat user baru
    const id = await UserModel.createUser({
      nama_lengkap,
      email,
      password_hash,
      no_telepon,
    });

    return res.json({
      success: true,
      data: {
        id_pengguna: id,
        nama_lengkap,
        email,
        no_telepon,
        tipe_user: "user",
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password dibutuhkan",
      });
    }

    // Cari user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    // Cek password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        id_pengguna: user.id_pengguna,
        tipe_user: user.tipe_user,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id_pengguna: user.id_pengguna,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          no_telepon: user.no_telepon,
          tipe_user: user.tipe_user,
        },
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: err.message,
    });
  }
});

// GET PROFILE
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id_pengguna);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      details: err.message,
    });
  }
});

module.exports = router;
