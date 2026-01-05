const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
   try {
      // Asumsi: userModel memiliki findAll()
      const users = await userModel.findAll();
      res.json({ success: true, data: users });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Get user by ID
exports.getUserById = async (req, res) => {
   try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
         return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, data: user });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Create new user (Menggunakan nama kolom yang benar)
exports.createUser = async (req, res) => {
   try {
      // Catatan: Anda perlu mendapatkan nama_lengkap, email, password_hash, dan no_telepon dari req.body
      const { nama_lengkap, email, password_hash, no_telepon } = req.body;

      if (!nama_lengkap || !email || !password_hash) {
         return res.status(400).json({ success: false, error: "Missing required fields for creation." });
      }

      const newUser = await userModel.createUser({ nama_lengkap, email, password_hash, no_telepon });
      
      res.status(201).json({ success: true, data: { id_pengguna: newUser } });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Update user (FIXED: Menggunakan userModel.updateUser dan nama kolom yang benar)
exports.updateUser = async (req, res) => {
   try {
      let { nama_lengkap, email, no_telepon, password_hash } = req.body;
      const id = req.params.id;

      if (password_hash && password_hash.trim() !== "") {
        //jika password disediakan, hash dulu
        password_hash = await bcrypt.hash(password_hash, 10);
      } else {
        //jika tidak disediakan, jangan ikutsertakan dalam update
        password_hash = undefined;
      }

      // Objek data yang akan di-update
      const updateData = { nama_lengkap, email, no_telepon, password_hash };
      
      // Hapus properti yang undefined agar tidak diikutsertakan dalam query update (penting)
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      // PANGGIL FUNGSI MODEL YANG BENAR: userModel.updateUser
      const affectedRows = await userModel.updateUser(id, updateData);

      if (affectedRows === 0) {
         // Periksa apakah pengguna benar-benar tidak ditemukan (404) atau tidak ada perubahan (200)
         const userExists = await userModel.findById(id);
         if (!userExists) {
               return res.status(404).json({ success: false, error: "User not found" });
         }
         // Jika pengguna ditemukan tapi 0 baris terpengaruh, berarti tidak ada data yang berbeda
         return res.status(200).json({ success: true, message: "No new data to update or user data is the same." });
      }

      res.json({ success: true, message: "User updated successfully" });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Delete user
exports.deleteUser = async (req, res) => {
   try {
      // Asumsi: userModel memiliki deleteById()
      const deleted = await userModel.deleteById(req.params.id);
      if (!deleted) {
         return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, message: "User deleted successfully" });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};