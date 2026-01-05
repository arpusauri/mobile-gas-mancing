const router = require("express").Router();
const bookingController = require("../controllers/bookingController");

// 1. IMPORT MIDDLEWARE (Wajib)
const { authenticateToken } = require("../middleware/auth");

// 2. PASANG MIDDLEWARE DI ROUTE CREATE
// Tambahkan 'authenticateToken' sebagai argumen kedua sebelum controller
router.post("/create", authenticateToken, bookingController.create);

// Route lainnya...
router.get("/user/:userId", bookingController.getByUserId);
router.patch("/:id/status", authenticateToken, bookingController.updateStatus); // Sebaiknya ini juga dilindungi
router.get("/:id", bookingController.getById);
router.get("/", bookingController.getAll);
router.delete("/:id", authenticateToken, bookingController.delete);

module.exports = router;
