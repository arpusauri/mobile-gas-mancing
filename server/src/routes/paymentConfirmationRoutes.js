const router = require('express').Router();
const paymentConfirmationController = require('../controllers/paymentConfirmationController');

// GET PAYMENT CONFIRMATION DETAIL
// Endpoint: GET /api/payment-confirmation/:nomorPesanan
// Digunakan untuk mengambil data lengkap (Header + Item + Status) berdasarkan Nomor Pesanan (misal: B-291478729)
router.get('/:nomorPesanan', paymentConfirmationController.getDetailByOrderNumber);

module.exports = router;