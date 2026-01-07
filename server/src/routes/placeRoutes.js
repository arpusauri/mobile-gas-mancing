const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- SETUP MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){ 
            fs.mkdirSync(dir, { recursive: true }); 
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ✅ MIDDLEWARE: Parse FormData Array Format items[0][nama_item]
const parseFormDataArrays = (req, res, next) => {
    const items = [];
    let i = 0;
    
    // Loop sampai tidak ada lagi items[i][nama_item]
    while (req.body[`items[${i}][nama_item]`] !== undefined) {
        items.push({
            nama_item: req.body[`items[${i}][nama_item]`],
            price: req.body[`items[${i}][price]`],
            price_unit: req.body[`items[${i}][price_unit]`],
            // File akan di-handle terpisah di controller
        });
        
        // Hapus field individual dari req.body agar tidak bingung
        delete req.body[`items[${i}][nama_item]`];
        delete req.body[`items[${i}][price]`];
        delete req.body[`items[${i}][price_unit]`];
        
        i++;
    }
    
    // Tambahkan items yang sudah di-parse ke req.body
    if (items.length > 0) {
        req.body.items = items;
    }
    
    console.log('✅ Parsed Items from FormData:', items);
    
    next();
};

// ==========================================
// DEFINISI ROUTES
// ==========================================

// 1. GET Facilities (Harus DI ATAS /:id)
router.get("/facilities/list", placeController.getAllFacilities);

// 2. Search Places
router.get("/search", placeController.searchPlaces);

// 3. GET All Places
router.get("/", placeController.getAllPlaces);

// 3.5. GET Places by Mitra ID (HARUS DI ATAS /:id)
router.get("/mitra/:mitraId", authenticateToken, placeController.getPlacesByMitraId);

// 4. GET Place by ID
router.get("/:id", placeController.getPlaceById);

// 5. POST Create New Place
// ✅ Tambahkan middleware parser setelah multer
router.post("/", 
    upload.any(), 
    parseFormDataArrays,  // ✅ Parse items[0][field] → items array
    placeController.createPlace
);

// 6. UPDATE Place
router.put('/:id', placeController.updatePlace);    

// 7. DELETE Place
router.delete('/:id', placeController.deletePlace); 

module.exports = router;