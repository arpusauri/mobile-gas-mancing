const db = require("../config/database");

class ReviewModel {
  // =======================================================
  // GET REVIEW BY PLACE ID (Untuk Halaman Detail Tempat)
  // =======================================================
  static async findByPlaceId(placeId) {
    const query = `
      SELECT 
        r.id_review AS id,
        r.score AS rating,
        r.comment AS comment,
        r.review_date AS date,
        u.id_pengguna AS userId,
        u.nama_lengkap AS userName,
        u.email AS userEmail
      FROM review r
      LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
      WHERE r.id_tempat = ?
      ORDER BY r.review_date DESC
    `.trim();

    const [review] = await db.query(query, [placeId]);
    return review;
  }

  // =======================================================
  // GET REVIEW BY USER ID (Untuk Riwayat Review User)
  // =======================================================
  static async findByUserId(userId) {
    const query = `
      SELECT 
        r.id_review AS id,
        r.score AS rating,
        r.comment AS comment,
        r.review_date AS date,
        t.id_tempat AS placeId,
        t.title AS placeName,
        t.image_url AS placeImage
      FROM review r
      LEFT JOIN tempat_pemancingan t ON r.id_tempat = t.id_tempat
      WHERE r.id_pengguna = ?
      ORDER BY r.review_date DESC
    `.trim();

    const [review] = await db.query(query, [userId]);
    return review;
  }

  // =======================================================
  // CREATE NEW REVIEW & UPDATE PLACE RATING
  // =======================================================
  static async create(reviewData) {
    const { id_tempat, id_pengguna, score, comment } = reviewData;

    // 1. Insert Review ke tabel review
    const query = `
      INSERT INTO review (id_tempat, id_pengguna, score, comment)
      VALUES (?, ?, ?, ?)
    `.trim();

    const [result] = await db.query(query, [
      id_tempat,
      id_pengguna,
      score,
      comment
    ]);

    const newReviewId = result.insertId;

    // 2. Update Rata-rata Rating di tabel tempat_pemancingan
    // Kita panggil fungsi helper internal di bawah
    await this.updatePlaceRatingStats(id_tempat);

    return newReviewId;
  }

  // =======================================================
  // DELETE REVIEW
  // =======================================================
  static async delete(id, placeId) {
    // Hapus review
    const query = `DELETE FROM review WHERE id_review = ?`.trim();
    const [result] = await db.query(query, [id]);

    // Jika berhasil dihapus dan placeId disertakan, update rating tempat tersebut
    if (result.affectedRows > 0 && placeId) {
      await this.updatePlaceRatingStats(placeId);
    }

    return result.affectedRows > 0;
  }

  // =======================================================
  // INTERNAL HELPER: RECALCULATE RATING
  // =======================================================
  // Fungsi ini menghitung ulang rata-rata dan jumlah review
  // lalu mengupdate tabel tempat_pemancingan
  static async updatePlaceRatingStats(placeId) {
    // Hitung rata-rata dan total count dari tabel review
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(score) as avg_rating
      FROM review
      WHERE id_tempat = ?
    `.trim();

    const [stats] = await db.query(statsQuery, [placeId]);
    
    const totalReviews = stats[0].total_reviews || 0;
    // Format desimal 1 angka di belakang koma (misal: 4.5)
    const averageRating = stats[0].avg_rating ? parseFloat(stats[0].avg_rating).toFixed(1) : 0.0;

    // Update tabel tempat_pemancingan
    const updateQuery = `
      UPDATE tempat_pemancingan
      SET 
        total_reviews_count = ?,
        average_rating = ?
      WHERE id_tempat = ?
    `.trim();

    await db.query(updateQuery, [totalReviews, averageRating, placeId]);
  }
}

module.exports = ReviewModel;