const db = require("../config/database");

class PesananModel {
  // ======================================================
  // 1. GET ALL PESANAN BY USER ID
  // ======================================================
  static async findAllByUserId(userId) {
    try {
      const [orders] = await db.query(
        `SELECT 
          p.id_pesanan,
          p.id_tempat,
          p.tgl_pesan,
          p.status_pesanan,
          p.total_biaya,
          p.num_people,
          p.tgl_mulai_sewa,
          p.durasi_sewa_jam,
          p.nomor_pesanan,
          
          t.title,
          t.location,
          t.image_url,
          t.average_rating,
          t.total_reviews_count
        FROM pemesanan p
        JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
        WHERE p.id_pengguna = ?
        ORDER BY p.tgl_pesan DESC`,
        [userId]
      );

      if (orders.length === 0) return [];

      const orderIds = orders.map((o) => o.id_pesanan);

      // Ambil item per pesanan
      const [allItems] = await db.query(
        `SELECT 
          d.id_pesanan,
          d.kuantitas AS quantity,
          i.nama_item AS name,
          d.harga_satuan_saat_pesan AS price
        FROM detail_pemesanan_item d
        JOIN item_sewa i ON d.id_item = i.id_item
        WHERE d.id_pesanan IN (?)`,
        [orderIds]
      );

      const itemsByOrder = {};
      allItems.forEach((item) => {
        if (!itemsByOrder[item.id_pesanan]) {
          itemsByOrder[item.id_pesanan] = [];
        }
        itemsByOrder[item.id_pesanan].push(item);
      });

      return orders.map((order) => ({
        id: order.id_pesanan,
        id_pesanan: order.id_pesanan,
        nomor_pesanan: order.nomor_pesanan,
        place_name: order.title,
        place_location: order.location,
        place_image: order.image_url,
        place_rating: order.average_rating || 0,
        place_review_count: order.total_reviews_count || 0,
        tanggal_mulai: order.tgl_mulai_sewa,
        durasi_jam: order.durasi_sewa_jam,
        jumlah_orang: order.num_people,
        status: order.status_pesanan,
        total_harga: order.total_biaya,
        items: itemsByOrder[order.id_pesanan] || [],
      }));
    } catch (error) {
      console.error("Error in findAllByUserId:", error);
      throw error;
    }
  }

  // ======================================================
  // 2. GET PESANAN BY ID (FIXED - LEFT JOIN pembayaran)
  // ======================================================
  static async findById(id) {
    try {
      const [orderRows] = await db.query(
        `SELECT
        p.id_pesanan,
        p.nomor_pesanan,
        p.total_biaya,
        p.status_pesanan,
        pb.kode_bayar,        
        pb.payment_method AS metode_pembayaran,
        p.tgl_pesan,
        p.tgl_mulai_sewa,
        p.durasi_sewa_jam,
        p.num_people,
        t.title AS place_name,
        t.location,
        t.image_url
      FROM pemesanan p
      INNER JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
      LEFT JOIN pembayaran pb ON p.id_pesanan = pb.id_pesanan
      WHERE p.id_pesanan = ?
      LIMIT 1`,
        [id]
      );

      if (orderRows.length === 0) return null;

      const order = orderRows[0];

      // ambil item pemesanan
      const [itemRows] = await db.query(
        `SELECT 
       i.nama_item AS name,
       d.kuantitas AS quantity,
       d.harga_satuan_saat_pesan AS price,
       d.subtotal
     FROM detail_pemesanan_item d
     JOIN item_sewa i ON d.id_item = i.id_item
     WHERE d.id_pesanan = ?`,
        [id]
      );

      return { ...order, item_sewa: itemRows };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }

  // ======================================================
  // 3. CANCEL PESANAN
  // ======================================================
  static async cancelOrder(orderId, userId) {
    try {
      const [rows] = await db.query(
        "SELECT status_pesanan FROM pemesanan WHERE id_pesanan = ? AND id_pengguna = ?",
        [orderId, userId]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Pesanan tidak ditemukan atau bukan milik Anda.",
        };
      }

      const currentStatus = rows[0].status_pesanan;

      if (currentStatus.toLowerCase() !== "menunggu pembayaran") {
        return {
          success: false,
          message: `Pesanan berstatus ${currentStatus} tidak dapat dibatalkan.`,
        };
      }

      await db.query(
        "UPDATE pemesanan SET status_pesanan = 'Dibatalkan' WHERE id_pesanan = ?",
        [orderId]
      );

      const [updatedOrder] = await db.query(
        `SELECT 
          p.id_pesanan, 
          p.nomor_pesanan,
          p.status_pesanan,
          p.total_biaya,
          t.title
        FROM pemesanan p
        JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
        WHERE p.id_pesanan = ?`,
        [orderId]
      );

      return { success: true, order: updatedOrder[0] };
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      throw error;
    }
  }

  static async create(pesananData, items) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert ke tabel 'pemesanan'
      const [orderResult] = await connection.query(
        `INSERT INTO pemesanan 
      (id_pengguna, id_tempat, nomor_pesanan, tgl_mulai_sewa, total_biaya, status_pesanan, num_people, durasi_sewa_jam) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pesananData.id_pengguna,
          pesananData.id_tempat,
          pesananData.nomor_pesanan,
          pesananData.tanggal_mulai,
          pesananData.total_harga,
          "Menunggu Pembayaran",
          pesananData.jumlah_orang,
          pesananData.durasi_sewa_jam,
        ]
      );

      const newOrderId = orderResult.insertId;

      // 1.5 Insert ke tabel 'pembayaran'
      const kodeBayar = `PAY-${Date.now()}`;
      await connection.query(
        `INSERT INTO pembayaran 
        (id_pesanan, kode_bayar, payment_method, jumlah_bayar, status_pembayaran, tgl_pembayaran) 
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          newOrderId,
          `PAY-${Date.now()}`,
          pesananData.metode_pembayaran, // Ini mengambil dari payload yang kita tambahkan di atas
          pesananData.total_harga,
          "Pending",
        ]
      );

      // 2. Insert ke tabel 'detail_pemesanan_item' jika ada item
      if (items && items.length > 0) {
        const itemQueries = items.map((item) => {
          return connection.query(
            `INSERT INTO detail_pemesanan_item 
          (id_pesanan, id_item, kuantitas, harga_satuan_saat_pesan, subtotal) 
          VALUES (?, ?, ?, ?, ?)`,
            [
              newOrderId,
              item.id_item,
              item.kuantitas,
              item.harga_satuan_saat_pesan,
              item.subtotal,
            ]
          );
        });
        await Promise.all(itemQueries);
      }

      await connection.commit();
      return newOrderId;
    } catch (error) {
      await connection.rollback();
      console.error("Error in PesananModel.create:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PesananModel;
