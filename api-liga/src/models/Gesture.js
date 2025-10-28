const pool = require('../../config/database');

class Gesture {
  // Buscar todos os gestos
  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT * FROM gestures 
        ORDER BY id
      `);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar todos os gestos:', error);
      throw error;
    }
  }

  // Buscar gesto por ID
  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT * FROM gestures 
        WHERE id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar gesto por ID:', error);
      throw error;
    }
  }

  // Criar novo gesto
  static async create(gestureData) {
    try {
      const { word_pt, word_lga, category, description } = gestureData;
      const result = await pool.query(`
        INSERT INTO gestures (word_pt, word_lga, category, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [word_pt, word_lga, category, description]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar gesto:', error);
      throw error;
    }
  }

  // Atualizar gesto com URL do vídeo
  static async updateVideoUrl(gestureId, videoUrl) {
    try {
      const result = await pool.query(`
        UPDATE gestures 
        SET video_url = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 
        RETURNING *
      `, [videoUrl, gestureId]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      throw error;
    }
  }

  // Buscar gestos com vídeos
  static async findWithVideos() {
    try {
      const result = await pool.query(`
        SELECT * FROM gestures 
        WHERE video_url IS NOT NULL
        ORDER BY id
      `);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar gestos com vídeos:', error);
      throw error;
    }
  }
}

module.exports = Gesture;