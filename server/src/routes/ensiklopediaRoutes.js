const express = require("express");
const router = express.Router();
const ensiklopediaController = require("../controllers/ensiklopediaController");

// Endpoint: GET /api/ensiklopedia
router.get("/", ensiklopediaController.getAll);

// Endpoint: GET /api/ensiklopedia/:id
router.get("/:id", ensiklopediaController.getById);

module.exports = router;
