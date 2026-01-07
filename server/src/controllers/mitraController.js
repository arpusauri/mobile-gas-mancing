const MitraModel = require("../models/mitraModel");
const PlaceModel = require("../models/placeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_api";

exports.createMitra = async (req, res) => {
  let newMitraId = null;

  try {
    const data = req.body;
    console.log("1. Menerima Data Registrasi...");
    console.log("Data received:", data);

    // --- VALIDASI DASAR ---
    if (!data.nama_lengkap || !data.email || !data.password_hash) {
      return res
        .status(400)
        .json({ success: false, message: "Data diri tidak lengkap." });
    }

    // --- LANGKAH 1: BUAT USER MITRA ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password_hash, salt);

    const mitraData = {
      nama_lengkap: data.nama_lengkap,
      email: data.email,
      password_hash: hashedPassword,
      no_telepon: data.no_telepon,
      alamat: data.alamat,
      nama_bank: data.nama_bank,
      no_rekening: data.no_rekening,
      atas_nama_rekening: data.atas_nama_rekening,
    };

    // Insert ke DB dan DAPATKAN ID BARU
    newMitraId = await MitraModel.create(mitraData);
    console.log("2. Mitra Terdaftar dengan ID:", newMitraId);

    // --- LANGKAH 2: BUAT TEMPAT PEMANCINGAN ---
    if (data.namaProperti) {
      console.log("3. Menyimpan Data Properti...");

      try {
        // === PARSING & FORMATTING DATA ===
        let itemsParsed = [];
        let fasilitasIds = [];

        // Parse 'items' (item_sewa)
        if (data.items) {
          const rawItems = typeof data.items === "string" ? JSON.parse(data.items) : data.items;
          
          // Format items sesuai yang diharapkan placeModel
          itemsParsed = rawItems
            .filter(item => item.name && item.price) // Filter item yang valid
            .map(item => ({
              nama_item: item.name || '',
              price: parseFloat(item.price) || 0,
              price_unit: item.unit || 'Pcs',
              tipe_item: item.type || 'peralatan',
              image_url: item.image || null
            }));
          
          console.log("Items parsed:", itemsParsed);
        }

        // Parse 'fasilitas' - KONVERSI NAMA KE ID
        if (data.fasilitas) {
          const namaFasilitas = typeof data.fasilitas === "string" 
            ? JSON.parse(data.fasilitas) 
            : data.fasilitas;

          // Mapping nama fasilitas ke ID (sesuai tabel fasilitas di database)
          const fasilitasMap = {
            'Toilet': 1,
            'Musholla': 2,
            'Parkiran': 3,
            'Kantin': 4,
            'Wifi': 5
          };

          fasilitasIds = namaFasilitas
            .map(nama => fasilitasMap[nama])
            .filter(id => id !== undefined);
          
          console.log("Fasilitas IDs:", fasilitasIds);
        }
        // =========================================

        // Handle Upload Image
        let uploadedImage = "default_place.jpg";
        if (req.file) {
          uploadedImage = req.file.filename;
          console.log("Image uploaded:", uploadedImage);
        }

        const propertyData = {
          title: data.namaProperti,
          location: data.alamatProperti,
          base_price: parseFloat(data.hargaSewa) || 0,
          price_unit: data.satuanSewa || 'Jam',
          description: `Buka: ${data.jamBuka || '08:00'} - ${data.jamTutup || '20:00'}. ${data.deskripsi || ''}`,
          full_description: data.deskripsi || '',
          image_url: uploadedImage,
          fasilitas: fasilitasIds,
          item_sewa: itemsParsed,
          id_mitra: newMitraId,
        };

        console.log("Property data to save:", propertyData);

        await PlaceModel.create(propertyData);
        console.log("4. Properti Berhasil Disimpan");
      } catch (placeError) {
        console.error(
          "Gagal simpan tempat, melakukan rollback mitra...",
          placeError
        );
        // Rollback
        if (newMitraId) {
          await MitraModel.delete(newMitraId);
        }
        throw new Error("Gagal menyimpan data tempat: " + placeError.message);
      }
    }

    const token = jwt.sign(
      { id: newMitraId, role: "mitra", email: data.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Registrasi Mitra & Tempat Berhasil.",
      data: {
        token: token,
        mitra: { id_mitra: newMitraId, ...mitraData },
      },
    });
  } catch (error) {
    console.error("Error createMitra:", error);
    // Handle duplicate email
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ success: false, message: "Email sudah terdaftar." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mitra = await MitraModel.findByEmail(email);

    if (!mitra) {
      return res.status(404).json({
        success: false,
        message: "Email tidak ditemukan atau Anda bukan Mitra.",
      });
    }

    const isMatch = await bcrypt.compare(password, mitra.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password salah." });
    }

    const token = jwt.sign(
      {
        id: mitra.id_mitra,
        role: "mitra",
        email: mitra.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login Mitra Berhasil",
      data: {
        token: token,
        mitra: {
          id_mitra: mitra.id_mitra,
          nama_lengkap: mitra.nama_lengkap,
          email: mitra.email,
          no_telepon: mitra.no_telepon,
          role: "mitra",
          tipe_user: "mitra",
        },
      },
    });
  } catch (error) {
    console.error("Login Mitra Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getMitraById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MitraModel.findById(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Mitra tidak ditemukan." });
    }

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error getMitraById:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.updateMitra = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const isUpdated = await MitraModel.update(id, data);

    if (!isUpdated) {
      const checkUser = await MitraModel.findById(id);
      if (!checkUser) {
        return res
          .status(404)
          .json({ success: false, message: "Mitra tidak ditemukan." });
      }
      return res.json({ success: true, message: "Tidak ada perubahan data." });
    }

    res.json({ success: true, message: "Data mitra berhasil diperbarui." });
  } catch (error) {
    console.error("Error updateMitra:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.deleteMitra = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await MitraModel.delete(id);

    if (!isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Mitra tidak ditemukan." });
    }

    res.json({ success: true, message: "Mitra berhasil dihapus." });
  } catch (error) {
    console.error("Error deleteMitra:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getPropertyBookings = async (req, res) => {
  try {
    const { mitraId } = req.params;
    const bookings = await MitraModel.getPropertyBookings(mitraId);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error("Error getPropertyBookings:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.updatePropertyBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isUpdated = await MitraModel.updatePropertyBookingStatus(id, status);

    if (!isUpdated) {
      return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    res.json({ success: true, message: "Status pesanan berhasil diperbarui." });
  } catch (error) {
    console.error("Error updatePropertyBookingStatus:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.deletePropertyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await MitraModel.deletePropertyBooking(id);

    if (!isDeleted) {
      return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    res.json({ success: true, message: "Pesanan berhasil dihapus." });
  } catch (error) {
    console.error("Error deletePropertyBooking:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};