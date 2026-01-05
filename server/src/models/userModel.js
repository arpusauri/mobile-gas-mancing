const db = require("../config/database");

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM pengguna WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT id_pengguna, nama_lengkap, email, no_telepon, tipe_user, tgl_daftar FROM pengguna WHERE id_pengguna = ?",
      [id]
    );
    return rows[0];
  }

  // Create user
  static async createUser(userData) {
    const { nama_lengkap, email, password_hash, no_telepon } = userData;
    const [result] = await db.query(
      "INSERT INTO pengguna (nama_lengkap, email, password_hash, no_telepon, tipe_user) VALUES (?, ?, ?, ?, ?)",
      [nama_lengkap, email, password_hash, no_telepon || null, "customer"]
    );
    return result.insertId;
  }

  static async updateUser(id, userData) {
    // Bangun query UPDATE secara dinamis
    const fields = [];
    const values = [];

    // Daftar kolom yang diizinkan untuk diperbarui
    const allowedFields = [
      "nama_lengkap",
      "email",
      "no_telepon",
      "password_hash",
    ];

    for (const key of allowedFields) {
      if (userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    }

    if (fields.length === 0) {
      // Tidak ada data untuk diperbarui
      return 0;
    }

    // Gabungkan bagian SET dan tambahkan ID pengguna ke akhir nilai
    const query = `UPDATE pengguna SET ${fields.join(
      ", "
    )} WHERE id_pengguna = ?`;
    values.push(id);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  }
}

module.exports = UserModel;
