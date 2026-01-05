const router = require('express').Router();
const paymentController = require('../controllers/paymentController');

// CREATE PAYMENT
// Endpoint: POST /api/payments
router.post('/', paymentController.create);

// GET PAYMENT BY BOOKING ID
// Endpoint: GET /api/payments/booking/:bookingId
// Kita pakai prefix /booking/ agar jelas kita cari berdasarkan ID Pesanan
router.get('/booking/:bookingId', paymentController.getByBookingId);

// UPDATE PAYMENT STATUS
// Endpoint: PATCH /api/payments/:id_pesanan/status
// Digunakan untuk update manual atau callback
router.patch('/:id_pesanan/status', paymentController.updateStatus);

// SIMULASI WEBHOOK (TESTING ONLY)
// Endpoint: POST /api/payments/webhook/simulate
// Gunakan ini di Postman untuk pura-pura jadi Midtrans/Bank
router.post('/webhook/simulate', paymentController.simulateWebhook);

module.exports = router;