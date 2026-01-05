const PaymentConfirmationModel = require("../models/paymentConfirmationModel");

// GET DETAIL PAYMENT PAGE (Untuk ditampilkan di Frontend)
exports.getDetailByOrderNumber = async (req, res) => {
    try {
        const { nomorPesanan } = req.params; // Ambil dari URL (misal: /B-291478729)

        // 1. Validasi Input
        if (!nomorPesanan) {
            return res.status(400).json({
                success: false,
                message: "Nomor pesanan wajib disertakan",
            });
        }

        // 2. Ambil Data Header Pesanan (Info User, Total, Status)
        const bookingData = await PaymentConfirmationModel.getDetailByOrderNumber(nomorPesanan);

        if (!bookingData) {
            return res.status(404).json({
                success: false,
                message: "Data pesanan tidak ditemukan dengan nomor tersebut",
            });
        }

        // 3. Ambil Data Detail Item (Apa saja yang disewa)
        // Kita butuh ID Pesanan (integer) dari hasil query sebelumnya untuk cari itemnya
        const itemsData = await PaymentConfirmationModel.getItemsByBookingId(bookingData.id_pesanan);

        // 4. Gabungkan Data (Formatting Response)
        // Kita rapikan strukturnya biar Frontend enak membacanya
        const responseData = {
            booking_info: {
                id_pesanan: bookingData.id_pesanan,
                nomor_pesanan: bookingData.nomor_pesanan,
                status_pesanan: bookingData.status_pesanan,
                tgl_pesan: bookingData.tgl_pesan,
                durasi_sewa: bookingData.durasi_sewa_jam + " Jam",
                total_tagihan: bookingData.total_biaya,
            },
            customer_info: {
                nama: bookingData.nama_pemesan,
                email: bookingData.email_pemesan,
                telepon: bookingData.no_telepon,
            },
            place_info: {
                nama_tempat: bookingData.nama_tempat,
                lokasi: bookingData.lokasi_tempat,
                gambar: bookingData.gambar_tempat,
            },
            payment_info: {
                status: bookingData.status_pembayaran || "belum_bayar", // Handle jika null
                method: bookingData.payment_method || "-",
                paid_at: bookingData.tgl_pembayaran,
                qris_url: bookingData.image_qris
            },
            items: itemsData // Array daftar item
        };

        // 5. Kirim Response Sukses
        res.status(200).json({
            success: true,
            message: "Data konfirmasi pembayaran berhasil diambil",
            data: responseData,
        });

    } catch (error) {
        console.error("Error in PaymentConfirmation Controller:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat memuat data",
            error: error.message
        });
    }
};