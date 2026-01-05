const db = require('../config/database'); // Pastikan path ke koneksi DB sudah benar

class ItemSewaModel {
    /**
     * Mencari semua item sewa yang terdaftar untuk suatu tempat (id_tempat).
     * Digunakan oleh ItemSewaController.getByPlaceId
     */
    static async findByPlaceId(placeId) {
        const query = `
            SELECT id_item, nama_item, price, price_unit, image_url, tipe_item
            FROM item_sewa
            WHERE id_tempat = ?
        `.trim();
        
        const [rows] = await db.query(query, [placeId]);
        return rows;
    }
}

module.exports = ItemSewaModel;