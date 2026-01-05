const EnsiklopediaModel = require("../models/ensiklopediaModel");

exports.getAll = async (req, res) => {
  try {
    // Ambil semua data dari Model
    const data = await EnsiklopediaModel.getAll();
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in Ensiklopedia Controller:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await EnsiklopediaModel.findById(id);
    if (data) {
      res.json({ success: true, data: data });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Artikel tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
