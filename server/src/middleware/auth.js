const jwt = require("jsonwebtoken");

// Middleware untuk verifikasi JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tambahkan user info ke request
    req.user = decoded;
    req.userId = decoded.id_pengguna; // Untuk pesananController

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

module.exports = {
  authenticateToken,
};
