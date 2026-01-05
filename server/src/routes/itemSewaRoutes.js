const express = require('express');
const router = express.Router();
const itemSewaController = require('../controllers/itemSewaController');

// Endpoint yang dipanggil oleh frontend: GET /api/item_sewa/place/:placeId
router.get('/place/:placeId', itemSewaController.getByPlaceId);

module.exports = router;