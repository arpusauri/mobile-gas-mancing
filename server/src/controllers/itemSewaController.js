const ItemSewaModel = require('../models/itemSewaModel');

exports.getByPlaceId = async (req, res) => {
    try {
        const placeId = req.params.placeId;
        
        if (!placeId) {
            return res.status(400).json({ success: false, message: "ID Tempat tidak ditemukan." });
        }

        const data = await ItemSewaModel.findByPlaceId(placeId);
        
        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Error in ItemSewa Controller (getByPlaceId):", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};