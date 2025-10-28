// Modelo para futura integração com PostgreSQL
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
      console.error('Erro ao buscar gestos:', error);
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
      console.error('Erro ao buscar gesto:', error);
      throw error;
    }
  }

  // Criar novo gesto
  static async create(gestureData) {
    try {
      const { word, category, description } = gestureData;
      const result = await pool.query(`
        INSERT INTO gestures (word, category, description) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `, [word, category, description]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar gesto:', error);
      throw error;
    }
  }
}

module.exports = Gesture;