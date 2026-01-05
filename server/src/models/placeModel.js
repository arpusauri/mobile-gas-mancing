const db = require("../config/database");

class PlaceModel {
  // ======================================
  // 1. GET ALL TEMPAT PEMANCINGAN
  // ======================================
  static async findAll() {
    // Q1: Ambil semua tempat utama
    const [places] = await db.query("SELECT * FROM tempat_pemancingan");

    if (places.length === 0) return [];

    const placeIds = places.map((p) => p.id_tempat);

    // Q2: Ambil fasilitas (Join tabel pivot)
    const [allFacilities] = await db.query(
      `SELECT 
      tf.id_tempat, 
      f.nama_fasilitas AS nama_fasilitas
      FROM tempat_fasilitas tf
      JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
      WHERE tf.id_tempat IN (?)`,
      [placeIds]
    );

    // Q3: Ambil item sewa
    const [allItems] = await db.query(
      `SELECT id_tempat, id_item, nama_item, price, price_unit, image_url, tipe_item
       FROM item_sewa
       WHERE id_tempat IN (?)`,
      [placeIds]
    );

    // Q4: Ambil review
    const [allReviews] = await db.query(
      `SELECT 
          r.id_tempat, r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
       FROM review r
       LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
       WHERE r.id_tempat IN (?)`,
      [placeIds]
    );

    // MAPPING DATA
    const mappedFacilities = {};
    allFacilities.forEach((f) => {
      if (!mappedFacilities[f.id_tempat]) mappedFacilities[f.id_tempat] = [];
      mappedFacilities[f.id_tempat].push(f.nama_fasilitas);
    });

    const mappedItems = {};
    allItems.forEach((i) => {
      if (!mappedItems[i.id_tempat]) mappedItems[i.id_tempat] = [];
      mappedItems[i.id_tempat].push(i);
    });

    const mappedReviews = {};
    allReviews.forEach((r) => {
      if (!mappedReviews[r.id_tempat]) mappedReviews[r.id_tempat] = [];
      mappedReviews[r.id_tempat].push(r);
    });

    // Final Assembly
    return places.map((place) => ({
      ...place,
      fasilitas: mappedFacilities[place.id_tempat] || [],
      item_sewa: mappedItems[place.id_tempat] || [],
      reviews: mappedReviews[place.id_tempat] || [],
    }));
  }

  // ======================================
  // 2. GET TEMPAT BY ID
  // ======================================
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM tempat_pemancingan WHERE id_tempat = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const place = rows[0];

    // Fasilitas
    const [facilities] = await db.query(
      `SELECT f.nama_fasilitas 
       FROM fasilitas f
       JOIN tempat_fasilitas tf ON f.id_fasilitas = tf.id_fasilitas
       WHERE tf.id_tempat = ?`,
      [id]
    );
    place.fasilitas = facilities.map((f) => f.nama_fasilitas);

    // Item sewa
    const [items] = await db.query(
      `SELECT id_item, nama_item, price, price_unit, image_url, tipe_item
       FROM item_sewa
       WHERE id_tempat = ?`,
      [place.id_tempat]
    );
    place.item_sewa = items;

    // Review
    const [reviews] = await db.query(
      `SELECT r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
       FROM review r
       LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
       WHERE r.id_tempat = ?`,
      [id]
    );
    place.reviews = reviews;

    return place;
  }

  // ======================================
  // 3. CREATE TEMPAT PEMANCINGAN (FIXED)
  // ======================================
  static async create(placeData) {
    const {
      title,
      location,
      base_price,
      price_unit,
      image_url,
      description,
      full_description,
      fasilitas = [], // Ini berisi Array ID: [1, 3]
      item_sewa = [], // Ini berisi Array Object Item
      id_mitra        // ID Mitra Pemilik
    } = placeData;

    // 1. Insert Data Utama Tempat
    const [result] = await db.query(
      `INSERT INTO tempat_pemancingan 
       (title, location, base_price, price_unit, image_url, description, full_description, id_mitra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        location,
        base_price,
        price_unit,
        image_url,
        description,
        full_description,
        id_mitra // Penting: Disimpan ke DB
      ]
    );

    const placeId = result.insertId;

    // 2. Insert Fasilitas (Bulk Insert ID)
    if (fasilitas.length > 0) {
      // Pastikan ID berupa integer
      const facilityValues = fasilitas.map((facId) => [
        placeId,
        parseInt(facId), 
      ]);

      // Insert ke tabel pivot (tempat_fasilitas)
      // Query: INSERT INTO tempat_fasilitas (id_tempat, id_fasilitas) VALUES (12, 1), (12, 3)
      if (facilityValues.length > 0) {
        await db.query(
          "INSERT INTO tempat_fasilitas (id_tempat, id_fasilitas) VALUES ?",
          [facilityValues]
        );
      }
    }

    // 3. Insert Item Sewa (Bulk Insert)
    if (item_sewa.length > 0) {
      const equipmentValues = item_sewa.map((e) => [
        e.nama_item,
        e.price,
        e.price_unit,
        e.image_url || null, // Gambar item mungkin null di tahap ini
        e.tipe_item || "peralatan",
        placeId,
      ]);

      if (equipmentValues.length > 0) {
        await db.query(
          `INSERT INTO item_sewa (nama_item, price, price_unit, image_url, tipe_item, id_tempat) VALUES ?`,
          [equipmentValues]
        );
      }
    }

    // Kembalikan data lengkap yang baru dibuat
    return this.findById(placeId);
  }

  // ======================================
  // 4. SEARCH PLACES
  // ======================================
static async search(location, price, facilities) {
    let query = `SELECT DISTINCT p.* FROM tempat_pemancingan p`;
    let conditions = [];
    let params = [];

    // 1. Lokasi
    if (location && location !== "Semua Lokasi") {
      const searchTerm = `%${location}%`;
      conditions.push(`(p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?)`);
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // 2. Harga (DIPERBAIKI)
    if (price) {
      const targetPrice = parseInt(price);
      
      // Pastikan angka valid dan bukan 0 atau NaN
      if (!isNaN(targetPrice) && targetPrice > 0) {
          const minPrice = targetPrice - 10000;
          const maxPrice = targetPrice + 10000;
          
          // Debugging: Cek apakah masuk sini
          // console.log(`Searching price between ${minPrice} and ${maxPrice}`);

          conditions.push(`p.base_price BETWEEN ? AND ?`);
          params.push(minPrice, maxPrice);
      }
    }

    // 3. Fasilitas
    if (facilities) {
      query += ` JOIN tempat_fasilitas tf ON p.id_tempat = tf.id_tempat 
                 JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas `;
      conditions.push(`f.nama_fasilitas LIKE ?`);
      params.push(`%${facilities}%`);
    }

    // Gabung WHERE
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.average_rating DESC";

    // ... execute query ...
    const [places] = await db.query(query, params);
    if (places.length === 0) return [];

    // Fetch relations (sama seperti findAll)
    const placeIds = places.map((p) => p.id_tempat);

    const [allFacilities] = await db.query(
      `SELECT tf.id_tempat, f.nama_fasilitas 
       FROM tempat_fasilitas tf JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
       WHERE tf.id_tempat IN (?)`,
      [placeIds]
    );
    const [allItems] = await db.query(
      `SELECT id_tempat, nama_item, price, price_unit, image_url, tipe_item
       FROM item_sewa WHERE id_tempat IN (?)`,
      [placeIds]
    );
    const [allReviews] = await db.query(
      `SELECT r.id_tempat, r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
       FROM review r LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
       WHERE r.id_tempat IN (?)`,
      [placeIds]
    );

    const mappedFacilities = {};
    allFacilities.forEach((f) => {
      if (!mappedFacilities[f.id_tempat]) mappedFacilities[f.id_tempat] = [];
      mappedFacilities[f.id_tempat].push(f.nama_fasilitas);
    });

    const mappedItems = {};
    allItems.forEach((i) => {
      if (!mappedItems[i.id_tempat]) mappedItems[i.id_tempat] = [];
      mappedItems[i.id_tempat].push(i);
    });

    const mappedReviews = {};
    allReviews.forEach((r) => {
      if (!mappedReviews[r.id_tempat]) mappedReviews[r.id_tempat] = [];
      mappedReviews[r.id_tempat].push(r);
    });

    return places.map((place) => ({
      ...place,
      fasilitas: mappedFacilities[place.id_tempat] || [],
      item_sewa: mappedItems[place.id_tempat] || [],
      reviews: mappedReviews[place.id_tempat] || [],
    }));
  }

  static async update(id, data) {
    // Siapkan penampung untuk query
    const fields = [];
    const values = [];

    // Cek satu per satu field, jika ada di data, tambahkan ke query
    if (data.title) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.location) {
      fields.push("location = ?");
      values.push(data.location);
    }
    if (data.base_price) {
      fields.push("base_price = ?");
      values.push(data.base_price);
    }
    if (data.price_unit) {
      fields.push("price_unit = ?");
      values.push(data.price_unit);
    }
    if (data.description) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.full_description) {
      fields.push("full_description = ?");
      values.push(data.full_description);
    }
    // (Opsional) Jika ingin update image_url lewat edit
    if (data.image_url) {
      fields.push("image_url = ?");
      values.push(data.image_url);
    }

    // Jika tidak ada data yang dikirim untuk diupdate
    if (fields.length === 0) return false;

    // Tambahkan ID ke values untuk WHERE clause
    values.push(id);

    const query = `UPDATE tempat_pemancingan SET ${fields.join(", ")} WHERE id_tempat = ?`;

    const [result] = await db.query(query, values);
    
    // Mengembalikan true jika ada baris yang berubah
    return result.affectedRows > 0;
  }

  static async delete(id) {
    // 1. Hapus dulu Fasilitas yang nyangkut
    await db.query("DELETE FROM tempat_fasilitas WHERE id_tempat = ?", [id]);

    // 2. Hapus dulu Item Sewa yang nyangkut
    await db.query("DELETE FROM item_sewa WHERE id_tempat = ?", [id]);

    // 3. Hapus Review yang nyangkut (Opsional, jika ada tabel review)
    await db.query("DELETE FROM review WHERE id_tempat = ?", [id]);

    // 4. Hapus Pemesanan/Booking (HATI-HATI: Ini akan menghapus history order)
    // Jika Anda ingin menyimpan history, jangan hapus tempat ini, tapi pakai sistem "Soft Delete" (status=inactive)
    // Tapi untuk sekarang agar error hilang, kita hapus saja:
    // await db.query("DELETE FROM pemesanan WHERE id_tempat = ?", [id]); 
    // (Uncomment baris di atas jika error masih muncul karena ada booking)

    // 5. BARU Hapus Tempat Utamanya
    const query = `DELETE FROM tempat_pemancingan WHERE id_tempat = ?`;
    const [result] = await db.query(query, [id]);
    
    return result.affectedRows > 0;
  }
}

module.exports = PlaceModel;