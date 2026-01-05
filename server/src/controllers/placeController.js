// server/src/controllers/placeController.js

const PlaceModel = require('../models/placeModel');

// 1. GET ALL PLACES
exports.getAllPlaces = async (req, res) => {
  try {
    const { mitra_id } = req.query;
    let places;
    if (mitra_id) {
      const all = await PlaceModel.findAll();
      places = all.filter(p => p.id_mitra == mitra_id);
    } else {
      places = await PlaceModel.findAll();
    }
    res.json({ success: true, data: places });
  } catch (error) {
    console.error("Error getAllPlaces:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. SEARCH PLACES
exports.searchPlaces = async (req, res) => {
  try {
    const { location, price, facilities } = req.query;
    const places = await PlaceModel.search(location, price, facilities);
    res.status(200).json({ success: true, count: places.length, data: places });
  } catch (error) {
    console.error("Error searchPlaces:", error);
    res.status(500).json({ success: false, message: "Terjadi Kesalahan", error: error.message });
  }
};

// 3. GET BY ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await PlaceModel.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: "Tempat tidak ditemukan" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. CREATE PLACE - DIPERBAIKI ✅
exports.createPlace = async (req, res) => {
  try {
    const data = req.body;
    const uploadedFiles = req.files || [];

    console.log("=== DEBUG CREATE PLACE ===");
    console.log("📦 req.body:", data);
    console.log("📁 req.files:", uploadedFiles);

    // 1. Validasi ID Mitra
    const mitraId = data.mitra_id || data.id_mitra;
    if (!mitraId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID Mitra tidak ditemukan" 
      });
    }

    // 2. Handle Gambar UTAMA
    let mainImageName = "default_place.jpg";
    const mainFile = uploadedFiles.find(file => file.fieldname === 'image_url');
    if (mainFile) {
      mainImageName = mainFile.filename;
    }
    console.log("🖼️  Main Image:", mainImageName);

    // 3. ✅ PERBAIKAN: Parse Items dari FormData format items[0][nama_item]
    let itemsParsed = [];
    
    // Cara 1: Jika backend sudah auto-parse ke array (dengan body-parser atau multer options)
    if (data.items && Array.isArray(data.items)) {
      itemsParsed = data.items.map((item, index) => {
        const itemImageField = `items[${index}][image_url]`;
        const itemFile = uploadedFiles.find(f => f.fieldname === itemImageField);

        return {
          nama_item: item.nama_item,    // ✅ Gunakan nama_item (bukan item.nama)
          price: item.price,            // ✅ Gunakan price (bukan item.harga)
          price_unit: item.price_unit,  // ✅ Gunakan price_unit (bukan item.unit)
          image_url: itemFile ? itemFile.filename : null
        };
      });
    } 
    // Cara 2: Manual parsing jika format masih items[0][nama_item]
    else {
      let i = 0;
      while (data[`items[${i}][nama_item]`] !== undefined) {
        const itemImageField = `items[${i}][image_url]`;
        const itemFile = uploadedFiles.find(f => f.fieldname === itemImageField);
        
        itemsParsed.push({
          nama_item: data[`items[${i}][nama_item]`],
          price: data[`items[${i}][price]`],
          price_unit: data[`items[${i}][price_unit]`],
          image_url: itemFile ? itemFile.filename : null
        });
        i++;
      }
    }

    console.log("🛠️  Parsed Items:", itemsParsed);

    // 4. Handle Fasilitas
    let fasilitasParsed = [];
    if (data.fasilitas) {
      try {
        fasilitasParsed = typeof data.fasilitas === 'string' 
          ? JSON.parse(data.fasilitas) 
          : data.fasilitas;
      } catch (e) { 
        fasilitasParsed = []; 
      }
    }

    // 5. Deskripsi & Jam
    let finalDescription = data.description || "";
    const jamBuka = data.jam_buka;
    const jamTutup = data.jam_tutup;

    if (jamBuka && jamTutup) {
      finalDescription = `Buka: ${jamBuka} - ${jamTutup}. ${finalDescription}`;
    }

    // 6. Simpan ke Database
    const placeData = {
      title: data.title,
      location: data.location,
      base_price: data.base_price,
      price_unit: data.price_unit,
      description: finalDescription,
      full_description: data.description,
      image_url: mainImageName,
      fasilitas: fasilitasParsed,
      item_sewa: itemsParsed,        // ✅ Array sudah benar
      id_mitra: mitraId,
      jam_buka: jamBuka,
      jam_tutup: jamTutup
    };

    console.log("💾 Data yang akan disimpan:", JSON.stringify(placeData, null, 2));

    const newPlace = await PlaceModel.create(placeData);

    res.status(201).json({
      success: true,
      message: "Tempat berhasil ditambahkan",
      data: newPlace
    });

  } catch (error) {
    console.error("❌ Create Place Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 5. UPDATE PLACE
exports.updatePlace = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    let finalDescription = undefined;
    
    if (data.deskripsi || (data.jamBuka && data.jamTutup)) {
      const descText = data.deskripsi || "";
      if (data.jamBuka && data.jamTutup) {
        finalDescription = `Buka: ${data.jamBuka} - ${data.jamTutup}. ${descText}`;
      } else {
        finalDescription = descText;
      }
    }

    const updateData = {
      title: data.namaProperti,
      location: data.alamatProperti,
      base_price: data.hargaSewa,
      price_unit: data.satuanSewa,
      description: finalDescription,
      full_description: data.deskripsi,
    };

    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const success = await PlaceModel.update(id, updateData);
    
    if (!success) {
      const check = await PlaceModel.findById(id);
      if (!check) {
        return res.status(404).json({ 
          success: false, 
          message: "Tempat tidak ditemukan" 
        });
      }
      return res.json({ 
        success: true, 
        message: "Tidak ada perubahan data" 
      });
    }

    res.json({ success: true, message: "Berhasil update tempat" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. DELETE PLACE
exports.deletePlace = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await PlaceModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: "Gagal hapus. Tempat tidak ditemukan." 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Berhasil menghapus tempat pemancingan." 
    });
    
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 7. GET ALL FACILITIES
exports.getAllFacilities = async (req, res) => {
  const db = require('../config/database');
  try {
    const [facilities] = await db.query(
      "SELECT id_fasilitas AS id, nama_fasilitas AS name FROM fasilitas"
    );
    res.status(200).json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Gagal ambil fasilitas" 
    });
  }
};