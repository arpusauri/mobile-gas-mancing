const express = require("express");
const router = express.Router();
const pesananController = require("../controllers/pesananController");
const { authenticateToken } = require('../middleware/auth'); // Import middleware/auth.js

// ===================================
// Rute untuk Pengelolaan Pesanan (SEMUA BUTUH AUTH)
// ===================================

// GET /api/pesanan/my-orders
// Mengambil semua pesanan untuk pengguna yang sedang login.
router.get(
  "/my-orders",
  authenticateToken,
  pesananController.getAllPesananByUserId
);

// POST /api/pesanan/create
// Membuat pesanan baru.
router.post("/create", authenticateToken, pesananController.createPesanan);

// POST /api/pesanan/cancel/:id
// Membatalkan pesanan berdasarkan ID.
router.post("/cancel/:id", authenticateToken, pesananController.cancelPesanan);

// GET /api/pesanan/:id
// Mengambil detail pesanan berdasarkan ID.
router.get("/:id", authenticateToken, pesananController.getPesananById);

module.exports = router;