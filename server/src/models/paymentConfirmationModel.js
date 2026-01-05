const db = require("../config/database");

class PaymentConfirmationModel {

    // MENDAPATKAN DATA LENGKAP PESANAN BERDASARKAN NOMOR PESANAN (B-XXXXX)
    // Digunakan agar URL di frontend lebih aman pakai nomor_pesanan, bukan ID angka biasa
    static async getDetailByOrderNumber(nomorPesanan) {
        const query = `
            SELECT 
                -- Info Pesanan
                p.id_pesanan,
                p.nomor_pesanan,
                p.tgl_pesan,
                p.tgl_mulai_sewa,
                p.durasi_sewa_jam,
                p.num_people,
                p.total_biaya,
                p.status_pesanan,

                -- Info Tempat
                t.title AS nama_tempat,
                t.location AS lokasi_tempat,
                t.image_url AS gambar_tempat,

                -- Info User
                u.nama_lengkap AS nama_pemesan,
                u.email AS email_pemesan,
                u.no_telepon,

                -- Info Pembayaran (Left Join karena mungkin belum dibayar)
                pay.status_pembayaran,
                pay.payment_method,
                pay.tgl_pembayaran,
                pay.image_qris

            FROM pemesanan p
            JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
            JOIN pengguna u ON p.id_pengguna = u.id_pengguna
            LEFT JOIN pembayaran pay ON p.id_pesanan = pay.id_pesanan
            WHERE p.nomor_pesanan = ?
        `.trim();

        const [result] = await db.query(query, [nomorPesanan]);
        
        if (result.length === 0) return null;
        return result[0];
    }

    // MENDAPATKAN LIST ITEM YANG DISEWA (Detail Transaksi)
    static async getItemsByBookingId(idPesanan) {
        const query = `
            SELECT 
                i.nama_item,
                i.tipe_item,
                d.kuantitas,
                d.harga_satuan_saat_pesan,
                d.subtotal
            FROM detail_pemesanan_item d
            JOIN item_sewa i ON d.id_item = i.id_item
            WHERE d.id_pesanan = ?
        `.trim();

        const [rows] = await db.query(query, [idPesanan]);
        return rows;
    }
}

module.exports = PaymentConfirmationModel;