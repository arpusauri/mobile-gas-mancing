const PaymentModel = require("../models/paymentModel");
const BookingModel = require("../models/bookingModel"); // Kita butuh ini untuk update status booking

// CREATE NEW PAYMENT (Saat user klik "Bayar")
exports.create = async (req, res) => {
    try {
        const { id_pesanan, payment_method, jumlah_bayar } = req.body;

        // 1. Validasi Input
        if (!id_pesanan || !payment_method || !jumlah_bayar) {
            return res.status(400).json({
                success: false,
                message: "Data pembayaran tidak lengkap (ID Pesanan, Metode, dan Jumlah wajib diisi)",
            });
        }

        // 2. Cek apakah booking ini sudah punya pembayaran aktif?
        const exists = await PaymentModel.checkExists(id_pesanan);
        if (exists) {
            // Jika sudah ada, jangan buat baru, tapi update method/qris yang baru
            const kode_bayar = "PAY-" + Date.now() + "-" + id_pesanan; // Generate kode baru
            const image_qris = "img/QRISRangga.jpg";

            await PaymentModel.updateMethod(id_pesanan, payment_method, image_qris, kode_bayar);

            // Opsional: Bisa di-handle update method di sini, tapi untuk sekarang kita tolak double entry
            return res.json({
                success: true, // Beri status sukses, tapi sebagai update
                message: "Metode pembayaran berhasil diubah",
                data: { // Kembalikan data baru
                    kode_bayar: kode_bayar,
                    status: "pending",
                    image_qris: image_qris
                },
            });
        }

        // 3. Simulasi Generate Kode Bayar & QRIS (Karena belum ada Gateway asli)
        // Nanti bagian ini diganti respon dari Midtrans/Xendit
        const kode_bayar = "PAY-" + Date.now() + "-" + id_pesanan;
        const image_qris = "/img/QRISRangga.jpg"; // Default dummy

        const paymentData = {
            id_pesanan,
            kode_bayar,
            payment_method,
            jumlah_bayar,
            status_pembayaran: "pending", // Default awal selalu pending
            image_qris
        };

        // 4. Simpan ke Database
        const insertId = await PaymentModel.create(paymentData);

        res.status(201).json({
            success: true,
            message: "Pembayaran berhasil dibuat",
            data: {
                id_pembayaran: insertId,
                kode_bayar: kode_bayar,
                status: "pending",
                image_qris: image_qris
            },
        });

    } catch (error) {
        console.error("Error in Payment Controller (create):", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// GET PAYMENT BY BOOKING ID (Untuk Halaman Konfirmasi)
exports.getByBookingId = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const data = await PaymentModel.findByBookingId(bookingId);

        if (data) {
            res.json({ success: true, data: data });
        } else {
            res.status(404).json({
                success: false,
                message: "Data pembayaran belum ditemukan untuk pesanan ini",
            });
        }
    } catch (error) {
        console.error("Error in Payment Controller (getByBookingId):", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// UPDATE STATUS (Bisa dipanggil manual atau via Webhook)
exports.updateStatus = async (req, res) => {
    try {
        // Biasanya ID ini didapat dari parameter URL atau Body dari Payment Gateway
        const { id_pesanan } = req.params;
        const { status_pembayaran } = req.body; // 'sukses', 'gagal', 'pending'

        // 1. Validasi Status yang diperbolehkan di database enum kamu
        const validStatuses = ["pending", "sukses", "gagal"];
        if (!validStatuses.includes(status_pembayaran)) {
            return res.status(400).json({ message: "Status pembayaran tidak valid" });
        }

        // 2. Update tabel Pembayaran
        const updatedPayment = await PaymentModel.updateStatus(id_pesanan, status_pembayaran);

        if (!updatedPayment) {
            return res.status(404).json({ message: "Data pembayaran tidak ditemukan" });
        }

        // 3. LOGIKA PENTING: Jika pembayaran SUKSES, update juga tabel PEMESANAN jadi 'Lunas'
        if (status_pembayaran === 'sukses') {
            await BookingModel.updateStatus(id_pesanan, 'Lunas');
            console.log(`Booking ID ${id_pesanan} otomatis di-set Lunas.`);
        } else if (status_pembayaran === 'gagal') {
            // Opsional: Jika gagal bayar, apakah booking batal?
            // await BookingModel.updateStatus(id_pesanan, 'Dibatalkan');
        }

        res.json({
            success: true,
            message: `Status pembayaran diperbarui menjadi ${status_pembayaran}`,
        });

    } catch (error) {
        console.error("Error in Payment Controller (updateStatus):", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// SIMULASI WEBHOOK (Penting untuk testing tanpa Gateway)
// Ini endpoint pura-pura seolah-olah Payment Gateway memberi kabar "Sudah Bayar"
exports.simulateWebhook = async (req, res) => {
    try {
        const { kode_bayar, status } = req.body;

        // Cari ID Pesanan berdasarkan kode bayar
        const payment = await PaymentModel.findByPaymentCode(kode_bayar);

        if (!payment) {
            return res.status(404).json({ message: "Kode bayar tidak valid" });
        }

        // Update Status Pembayaran
        await PaymentModel.updateStatus(payment.bookingId, status);

        // Update Status Booking jika sukses
        if (status === 'sukses') {
            await BookingModel.updateStatus(payment.bookingId, 'Lunas');
        }

        res.json({ success: true, message: "Simulasi Webhook Berhasil" });

    } catch (error) {
        console.error("Error Webhook:", error);
        res.status(500).json({ error: "Internal Error" });
    }
}