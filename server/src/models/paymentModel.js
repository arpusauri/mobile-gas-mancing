const db = require("../config/database");

class PaymentModel {
    // CREATE NEW PAYMENT
    static async create(paymentData) {
        const {
            id_pesanan,
            kode_bayar, // Opsional, biasanya dari payment gateway
            payment_method,
            jumlah_bayar,
            status_pembayaran = "pending",
            image_qris = "" // URL atau path gambar QRIS jika ada
        } = paymentData;

        const query = `INSERT INTO pembayaran 
        (id_pesanan, kode_bayar, payment_method, jumlah_bayar, status_pembayaran, image_qris)
        VALUES (?, ?, ?, ?, ?, ?)`.trim();

        const [result] = await db.query(query, [
            id_pesanan,
            kode_bayar,
            payment_method,
            jumlah_bayar,
            status_pembayaran,
            image_qris
        ]);

        return result.insertId;
    }

    // FIND PAYMENT BY BOOKING ID (id_pesanan)
    static async findByBookingId(bookingId) {
        const query = `SELECT 
        p.id_pembayaran AS paymentId,
        p.id_pesanan AS bookingId,
        p.kode_bayar AS paymentCode,
        p.payment_method AS paymentMethod,
        p.jumlah_bayar AS amount,
        p.tgl_pembayaran AS paymentDate,
        p.status_pembayaran AS paymentStatus,
        p.image_qris AS qrisImage,
        b.nomor_pesanan AS orderNumber,
        b.total_biaya AS bookingTotal
        FROM pembayaran p
        LEFT JOIN pemesanan b ON p.id_pesanan = b.id_pesanan
        WHERE p.id_pesanan = ?`.trim();

        const [result] = await db.query(query, [bookingId]);

        return result.length > 0 ? result[0] : null;
    }

    // FIND PAYMENT BY EXTERNAL ID / KODE BAYAR (untuk Webhook jika gateway mengirim ID unik)
    static async findByPaymentCode(paymentCode) {
        const query = `SELECT 
        id_pembayaran AS paymentId,
        id_pesanan AS bookingId,
        kode_bayar AS paymentCode,
        status_pembayaran AS paymentStatus
        FROM pembayaran WHERE kode_bayar = ?`.trim();

        const [result] = await db.query(query, [paymentCode]);

        return result.length > 0 ? result[0] : null;
    }

    // UPDATE PAYMENT STATUS
    static async updateStatus(id_pesanan, status) {
        const query = `UPDATE pembayaran SET 
        status_pembayaran = ?,
        tgl_pembayaran = NOW() -- Update waktu saat status berubah
        WHERE id_pesanan = ?`.trim();

        const [result] = await db.query(query, [status, id_pesanan]);

        return result.affectedRows > 0;
    }

    // UPDATE PAYMENT METHOD & QRIS (Jika user ganti metode)
    static async updateMethod(id_pesanan, method, qrisUrl, kodeBayar) {
        const query = `UPDATE pembayaran SET 
        payment_method = ?, 
        image_qris = ?,
        kode_bayar = ?
        WHERE id_pesanan = ?`.trim();

        const [result] = await db.query(query, [method, qrisUrl, kodeBayar, id_pesanan]);

        return result.affectedRows > 0;
    }

    // CHECK IF PAYMENT EXISTS FOR BOOKING
    static async checkExists(id_pesanan) {
        const query = `SELECT id_pembayaran FROM pembayaran WHERE id_pesanan = ?`.trim();

        const [result] = await db.query(query, [id_pesanan]);
        return result.length > 0;
    }
}

module.exports = PaymentModel;