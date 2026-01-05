const router = require('express').Router();
const reviewController = require('../controllers/reviewController');

// Ambil semua review untuk tempat tertentu (misal: /api/review/place/1)
router.get('/place/:placeId', reviewController.getReviewByPlace);

// Ambil history review user tertentu (misal: /api/review/user/5)
router.get('/user/:userId', reviewController.getReviewByUser);

// Tambah review baru
router.post('/', reviewController.create);

// Hapus review berdasarkan ID review
router.delete('/:id', reviewController.delete);

module.exports = router;