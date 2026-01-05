const PesananModel = require("../models/pesananModel");

// Fungsi pembantu untuk mengekstrak ID Pengguna dari request (Simulasi Auth)
// Dalam aplikasi nyata, ini diambil dari token JWT/Sesi yang sudah diverifikasi oleh middleware.
const getUserIdFromAuth = (req) => {
  // Asumsi: Middleware autentikasi sudah mengisi req.userId
  if (req.userId) {
    return req.userId;
  }
  // Jika tidak ada ID, lempar error untuk memastikan autentikasi
  throw new Error("Pengguna tidak terautentikasi.");
};

// ======================================
// 1. GET ALL PESANAN BY USER ID
// ======================================
/**
 * Mengambil semua pesanan yang dimiliki oleh pengguna yang sedang login.
 * Rute: GET /api/pesanan/my-orders
 */
exports.getAllPesananByUserId = async (req, res) => {
  try {
    const userId = getUserIdFromAuth(req);

    const orders = await PesananModel.findAllByUserId(userId);

    // Response 200 OK, bahkan jika daftar pesanan kosong
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in getAllPesananByUserId:", error.message);
    // Error 401 jika gagal autentikasi
    if (error.message.includes("terautentikasi")) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Akses ditolak. Pengguna harus login.",
        });
    }
    res
      .status(500)
      .json({
        success: false,
        error: "Kesalahan Server Internal saat mengambil pesanan.",
        details: error.message,
      });
  }
};

// ======================================
// 2. CREATE PESANAN BARU
// ======================================
/**
 * Membuat entri pesanan baru.
 * Rute: POST /api/pesanan/create
 * Body: { id_tempat, tanggal_mulai, tanggal_selesai, jumlah_orang, total_harga, items: [...] }
 */
exports.createPesanan = async (req, res) => {
  try {
    const userId = getUserIdFromAuth(req);
    const {
      id_tempat,
      tanggal_mulai,
      tanggal_selesai,
      jumlah_orang,
      total_harga,
      items,
    } = req.body;

    // Validasi dasar
    if (
      !id_tempat ||
      !tanggal_mulai ||
      !tanggal_selesai ||
      !total_harga ||
      !items ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Data pesanan tidak lengkap." });
    }

    const pesananData = {
      id_pengguna: userId,
      id_tempat,
      tanggal_mulai,
      tanggal_selesai,
      jumlah_orang: jumlah_orang || 1, // Default 1 orang
      total_harga,
    };

    // Panggil model untuk membuat pesanan dan item-nya (dalam transaksi)
    const newPesananId = await PesananModel.create(pesananData, items);

    res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat. Menunggu Pembayaran.",
      id_pesanan: newPesananId,
    });
  } catch (error) {
    console.error("Error in createPesanan:", error);
    if (error.message.includes("terautentikasi")) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Akses ditolak. Pengguna harus login.",
        });
    }
    res
      .status(500)
      .json({
        success: false,
        error: "Gagal membuat pesanan. Kesalahan server internal.",
        details: error.message,
      });
  }
};

// ======================================
// 3. CANCEL PESANAN
// ======================================
/**
 * Membatalkan pesanan berdasarkan ID.
 * Rute: POST /api/pesanan/cancel/:id
 */
exports.cancelPesanan = async (req, res) => {
  try {
    const userId = getUserIdFromAuth(req);
    const orderId = req.params.id;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, error: "ID Pesanan diperlukan." });
    }

    const result = await PesananModel.cancelOrder(orderId, userId);

    if (!result.success) {
      // Error dari Model karena status tidak valid atau pesanan tidak ditemukan/bukan milik pengguna
      return res.status(400).json({ success: false, error: result.message });
    }

    res.status(200).json({
      success: true,
      message: "Pesanan berhasil dibatalkan.",
      data: result.order,
    });
  } catch (error) {
    console.error("Error in cancelPesanan:", error.message);
    if (error.message.includes("terautentikasi")) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Akses ditolak. Pengguna harus login.",
        });
    }
    res
      .status(500)
      .json({
        success: false,
        error: "Kesalahan Server Internal saat membatalkan pesanan.",
        details: error.message,
      });
  }
};

exports.getPesananById = async (req, res) => {
  try {
    // Ambil ID dari parameter URL (misal: /api/booking/87 -> id = 87)
    const orderId = req.params.id; 

    // Panggil Model findById yang sudah kita buat sebelumnya
    const order = await PesananModel.findById(orderId);

    // Cek jika pesanan tidak ditemukan
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Pesanan tidak ditemukan.",
      });
    }

    // Kirim data pesanan ke frontend
    res.status(200).json({
      success: true,
      data: order, // Ini berisi { nomor_pesanan: '...', total_biaya: ... }
    });

  } catch (error) {
    console.error("Error in getPesananById:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil detail pesanan.",
      details: error.message,
    });
  }
};