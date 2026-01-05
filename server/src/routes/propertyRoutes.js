const express = require('express');
const router = express.Router();
// Kita pakai controller dummy dulu atau arahkan ke placeController jika fungsinya mirip
// Untuk sementara kosongkan route-nya agar server jalan dulu
// Nanti kita isi untuk fitur Dashboard Pesanan

router.get('/bookings/:mitraId', (req, res) => {
    // Placeholder biar gak error 404 di frontend dashboard
    res.json({ success: true, data: [] });
});

module.exports = router;