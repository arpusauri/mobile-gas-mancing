const express = require("express");
const router = express.Router();
const mitraController = require("../controllers/mitraController");
const { authenticateToken } = require("../middleware/auth"); // Import middleware

// --- TAMBAHAN SETUP MULTER ---
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Format nama file: timestamp-namaasli.jpg
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ==========================================
// ROUTE PUBLIC (TIDAK PERLU AUTH)
// ==========================================

// 1. CREATE (Pendaftaran Mitra)
router.post(
  "/register",
  upload.single("fotoProperti"),
  mitraController.createMitra
);

// 2. LOGIN MITRA
router.post("/login", mitraController.login);

// ==========================================
// ROUTE YANG BUTUH AUTH (PINDAH MIDDLEWARE KE SINI)
// ==========================================
router.use(authenticateToken); // Middleware auth mulai dari sini

// 3. READ (Get Mitra By ID)
router.get("/:id", mitraController.getMitraById);

// 4. UPDATE MITRA
router.put("/:id", mitraController.updateMitra);

// 5. DELETE MITRA
router.delete("/:id", mitraController.deleteMitra);

// 6. GET PROPERTY BOOKINGS BY MITRA ID
router.get("/property/bookings/:mitraId", mitraController.getPropertyBookings);

// 7. UPDATE PROPERTY BOOKING STATUS
router.put(
  "/property/bookings/:id/status",
  mitraController.updatePropertyBookingStatus
);

// 8. DELETE PROPERTY BOOKING
router.delete("/property/bookings/:id", mitraController.deletePropertyBooking);

module.exports = router;
