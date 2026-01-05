const db = require("../config/database");

class EnsiklopediaModel {
  // =======================================================
  // GET ALL ARTICLES (PERBAIKAN QUERY)
  // =======================================================
  static async getAll() {
    let query = `
        SELECT 
          id_artikel,      -- JANGAN DI-ALIAS jadi 'id'
          judul,           -- JANGAN DI-ALIAS jadi 'title'
          description,
          image_url,       -- JANGAN DI-ALIAS jadi 'image'
          tgl_terbit
        FROM ensiklopedia
        ORDER BY tgl_terbit DESC
    `.trim();

    const [articles] = await db.query(query);

    if (articles.length === 0) return [];

    // Ambil media untuk setiap artikel
    for (let article of articles) {
      const mediaQuery = `
        SELECT 
          media_type,
          media_url,
          keterangan
        FROM ensiklopedia_media
        WHERE id_artikel = ?
        ORDER BY id_media ASC
      `.trim();

      const [mediaData] = await db.query(mediaQuery, [article.id_artikel]);

      article.description = article.description || "";
      // article.details = article.description; // Opsional
      article.media = mediaData;
    }

    return articles;
  }

  // =======================================================
  // GET ARTICLE BY ID
  // =======================================================
  static async findById(id) {
    const query = `
            SELECT * FROM ensiklopedia WHERE id_artikel = ?
        `.trim();

    const [articles] = await db.query(query, [id]);

    if (articles.length === 0) return null;

    const article = articles[0];

    const mediaQuery = `
            SELECT * FROM ensiklopedia_media
            WHERE id_artikel = ?
            ORDER BY id_media ASC
        `.trim();

    const [mediaData] = await db.query(mediaQuery, [id]);

    article.description = article.description || "";
    article.media = mediaData;

    return article;
  }
}

module.exports = EnsiklopediaModel;