const db = require("../config/database");

class BookingModel {
  // =======================================================
  // GET ALL BOOKINGS
  // =======================================================
  static async getAll() {
    let query = `
      SELECT 
        p.id_pesanan AS id,
        p.nomor_pesanan AS orderNumber,
        p.tgl_pesan AS orderDate,
        p.tgl_mulai_sewa AS startDate,
        p.durasi_sewa_jam AS durationHours,
        p.num_people AS numPeople,
        p.total_biaya AS totalCost,
        p.status_pesanan AS status,
        u.id_pengguna AS userId,
        u.nama_lengkap AS userName,
        u.email AS userEmail,
        u.no_telepon AS userPhone,
        t.id_tempat AS placeId,
        t.title AS placeTitle,
        t.location AS placeLocation,
        t.image_url AS placeImage
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.id_pengguna = u.id_pengguna
      LEFT JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
      ORDER BY p.tgl_pesan DESC
    `.trim();

    const [bookings] = await db.query(query);

    if (bookings.length === 0) return [];

    // Ambil detail item untuk setiap booking
    for (let booking of bookings) {
      const itemsQuery = `
        SELECT 
          i.id_item AS itemId,
          i.nama_item AS itemName,
          i.tipe_item AS itemType,
          i.image_url AS itemImage,
          d.kuantitas AS quantity,
          d.harga_satuan_saat_pesan AS unitPrice,
          d.subtotal AS subtotal
        FROM detail_pemesanan_item d
        LEFT JOIN item_sewa i ON d.id_item = i.id_item
        WHERE d.id_pesanan = ?
        ORDER BY d.id_detail ASC
      `.trim();

      const [items] = await db.query(itemsQuery, [booking.id]);

      // Ambil data pembayaran jika ada
      const paymentQuery = `
        SELECT 
          id_pembayaran AS paymentId,
          kode_bayar AS paymentCode,
          payment_method AS paymentMethod,
          jumlah_bayar AS amount,
          tgl_pembayaran AS paymentDate,
          status_pembayaran AS paymentStatus,
          image_qris AS qrisImage
        FROM pembayaran
        WHERE id_pesanan = ?
      `.trim();

      const [payment] = await db.query(paymentQuery, [booking.id]);

      booking.items = items;
      booking.payment = payment.length > 0 ? payment[0] : null;
    }

    return bookings;
  }

  // =======================================================
  // GET BOOKING BY ID
  // =======================================================
  static async findById(id) {
    const query = `
      SELECT 
        p.id_pesanan AS id,
        p.nomor_pesanan AS orderNumber,
        p.tgl_pesan AS orderDate,
        p.tgl_mulai_sewa AS startDate,
        p.durasi_sewa_jam AS durationHours,
        p.num_people AS numPeople,
        p.total_biaya AS totalCost,
        p.status_pesanan AS status,
        u.id_pengguna AS userId,
        u.nama_lengkap AS userName,
        u.email AS userEmail,
        u.no_telepon AS userPhone,
        t.id_tempat AS placeId,
        t.title AS placeTitle,
        t.location AS placeLocation,
        t.base_price AS placeBasePrice,
        t.price_unit AS placePriceUnit,
        t.image_url AS placeImage,
        t.description AS placeDescription
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.id_pengguna = u.id_pengguna
      LEFT JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
      WHERE p.id_pesanan = ?
    `.trim();

    const [bookings] = await db.query(query, [id]);

    if (bookings.length === 0) return null;

    const booking = bookings[0];

    // Ambil detail item
    const itemsQuery = `
      SELECT 
        i.id_item AS itemId,
        i.nama_item AS itemName,
        i.tipe_item AS itemType,
        i.price AS itemPrice,
        i.price_unit AS itemPriceUnit,
        i.image_url AS itemImage,
        d.kuantitas AS quantity,
        d.harga_satuan_saat_pesan AS unitPrice,
        d.subtotal AS subtotal
      FROM detail_pemesanan_item d
      LEFT JOIN item_sewa i ON d.id_item = i.id_item
      WHERE d.id_pesanan = ?
      ORDER BY d.id_detail ASC
    `.trim();

    const [items] = await db.query(itemsQuery, [id]);

    // Ambil data pembayaran
    const paymentQuery = `
      SELECT 
        id_pembayaran AS paymentId,
        kode_bayar AS paymentCode,
        payment_method AS paymentMethod,
        jumlah_bayar AS amount,
        tgl_pembayaran AS paymentDate,
        status_pembayaran AS paymentStatus,
        image_qris AS qrisImage
      FROM pembayaran
      WHERE id_pesanan = ?
    `.trim();

    const [payment] = await db.query(paymentQuery, [id]);

    booking.items = items;
    booking.payment = payment.length > 0 ? payment[0] : null;

    return booking;
  }

  // =======================================================
  // GET BOOKINGS BY USER ID
  // =======================================================
  static async findByUserId(userId) {
    const query = `
      SELECT 
        p.id_pesanan AS id,
        p.nomor_pesanan AS orderNumber,
        p.tgl_pesan AS orderDate,
        p.tgl_mulai_sewa AS startDate,
        p.durasi_sewa_jam AS durationHours,
        p.num_people AS numPeople,
        p.total_biaya AS totalCost,
        p.status_pesanan AS status,
        t.id_tempat AS placeId,
        t.title AS placeTitle,
        t.location AS placeLocation,
        t.image_url AS placeImage
      FROM pemesanan p
      LEFT JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
      WHERE p.id_pengguna = ?
      ORDER BY p.tgl_pesan DESC
    `.trim();

    const [bookings] = await db.query(query, [userId]);

    if (bookings.length === 0) return [];

    // Ambil detail untuk setiap booking
    for (let booking of bookings) {
      const itemsQuery = `
        SELECT 
          i.id_item AS itemId,
          i.nama_item AS itemName,
          i.tipe_item AS itemType,
          i.image_url AS itemImage,
          d.kuantitas AS quantity,
          d.harga_satuan_saat_pesan AS unitPrice,
          d.subtotal AS subtotal
        FROM detail_pemesanan_item d
        LEFT JOIN item_sewa i ON d.id_item = i.id_item
        WHERE d.id_pesanan = ?
      `.trim();

      const [items] = await db.query(itemsQuery, [booking.id]);

      const paymentQuery = `
        SELECT 
          status_pembayaran AS paymentStatus,
          payment_method AS paymentMethod
        FROM pembayaran
        WHERE id_pesanan = ?
      `.trim();

      const [payment] = await db.query(paymentQuery, [booking.id]);

      booking.items = items;
      booking.payment = payment.length > 0 ? payment[0] : null;
    }

    return bookings;
  }

  // =======================================================
  // CREATE NEW BOOKING
  // =======================================================
  static async create(bookingData) {
    const {
      id_pengguna,
      id_tempat,
      nomor_pesanan,
      tgl_mulai_sewa,
      durasi_sewa_jam,
      num_people,
      total_biaya,
      status_pesanan = "Menunggu Pembayaran",
    } = bookingData;

    const query = `
      INSERT INTO pemesanan 
      (id_pengguna, id_tempat, nomor_pesanan, tgl_mulai_sewa, 
       durasi_sewa_jam, num_people, total_biaya, status_pesanan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `.trim();

    const [result] = await db.query(query, [
      id_pengguna,
      id_tempat,
      nomor_pesanan,
      tgl_mulai_sewa,
      durasi_sewa_jam,
      num_people,
      total_biaya,
      status_pesanan,
    ]);

    return result.insertId;
  }

  // =======================================================
  // CREATE DETAIL ITEM
  // =======================================================
  // File: models/bookingModel.js (static async createDetailItem)

  static async createDetailItem(detailData) {
    const {
      id_pesanan,
      id_item,
      kuantitas,
      harga_satuan_saat_pesan,
      subtotal,
    } = detailData;

    const query = `
        INSERT INTO detail_pemesanan_item 
        (id_pesanan, id_item, kuantitas, harga_satuan_saat_pesan, subtotal)
        VALUES (?, ?, ?, ?, ?)
    `.trim();

    const [result] = await db.query(query, [
      id_pesanan,
      id_item,
      kuantitas,
      harga_satuan_saat_pesan,
      subtotal,
    ]);

    return result.insertId; // atau return result jika tidak perlu ID
  }

  // Tambahkan fungsi untuk mencari item sewa berdasarkan nama
  // ASUMSI: Ini akan diletakkan di ItemModel.js. Jika tidak ada, letakkan di sini.
  // Mari kita buat model baru ItemModel (atau gunakan BookingModel sementara jika ItemModel belum dibuat)
  // Kita akan menggunakan BookingModel untuk menyederhanakan.
  static async findItemByName(itemName) {
    const query = `
        SELECT id_item, price
        FROM item_sewa
        WHERE nama_item = ?
    `.trim();
    const [result] = await db.query(query, [itemName]);
    return result.length > 0 ? result[0] : null;
  }

  // =======================================================
  // UPDATE BOOKING STATUS
  // =======================================================
  static async updateStatus(id, status) {
    const query = `
      UPDATE pemesanan 
      SET status_pesanan = ?
      WHERE id_pesanan = ?
    `.trim();

    const [result] = await db.query(query, [status, id]);

    return result.affectedRows > 0;
  }

  // =======================================================
  // DELETE BOOKING
  // =======================================================
  static async delete(id) {
    const query = `
      DELETE FROM pemesanan 
      WHERE id_pesanan = ?
    `.trim();

    const [result] = await db.query(query, [id]);

    return result.affectedRows > 0;
  }
}

module.exports = BookingModel;
