const ReviewModel = require("../models/reviewModel");

// =======================================================
// GET REVIEW BY PLACE ID (Untuk Halaman Detail Tempat)
// =======================================================
exports.getReviewByPlace = async (req, res) => {
  try {
    // Asumsi routing: /api/review/place/:placeId
    const placeId = req.params.placeId;
    
    const data = await ReviewModel.findByPlaceId(placeId);

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in Review Controller (getReviewByPlace):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// GET REVIEW BY USER ID (Untuk Halaman History User)
// =======================================================
exports.getReviewByUser = async (req, res) => {
  try {
    // Asumsi routing: /api/review/user/:userId
    const userId = req.params.userId;
    
    const data = await ReviewModel.findByUserId(userId);

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in Review Controller (getReviewByUser):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// CREATE NEW REVIEW
// =======================================================
exports.create = async (req, res) => {
  try {
    const { id_tempat, id_pengguna, score, comment } = req.body;

    // 1. Validasi Input Wajib
    if (!id_tempat || !id_pengguna || !score) {
      return res.status(400).json({
        success: false,
        message: "Data review tidak lengkap (id_tempat, id_pengguna, dan score wajib diisi)",
      });
    }

    // 2. Validasi Range Score (1-5)
    if (score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: "Score harus antara 1 sampai 5",
      });
    }

    // 3. Simpan ke Database
    const insertId = await ReviewModel.create({
      id_tempat,
      id_pengguna,
      score,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review berhasil ditambahkan",
      data: { id_review: insertId },
    });
  } catch (error) {
    console.error("Error in Review Controller (create):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// DELETE REVIEW
// =======================================================
exports.delete = async (req, res) => {
  try {
    const id = req.params.id; // ID Review
    
    // Kita butuh placeId (id_tempat) agar Model bisa menghitung ulang rating setelah dihapus.
    // Opsi terbaik: Kirim placeId dari frontend di body saat request delete.
    const { placeId } = req.body; 

    const deleted = await ReviewModel.delete(id, placeId);

    if (deleted) {
      res.json({
        success: true,
        message: "Review berhasil dihapus",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Review tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error in Review Controller (delete):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};