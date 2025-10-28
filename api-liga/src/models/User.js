const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Buscar todos os usuários
  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        ORDER BY id
      `);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        WHERE id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  // Buscar usuário por email (com senha, para autenticação)
  static async findByEmail(email) {
    try {
      const result = await pool.query(`
        SELECT * FROM users 
        WHERE email = $1
      `, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { name, email, password, role = 'user' } = userData;
      
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
      `, [name, email, hashedPassword, role]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async update(id, userData) {
    try {
      const { name, email, role } = userData;
      const result = await pool.query(`
        UPDATE users 
        SET name = $1, 
            email = $2, 
            role = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, email, role, created_at, updated_at
      `, [name, email, role, id]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Atualizar senha
  static async updatePassword(id, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const result = await pool.query(`
        UPDATE users 
        SET password = $1, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, email, role
      `, [hashedPassword, id]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const result = await pool.query(`
        DELETE FROM users 
        WHERE id = $1
        RETURNING id, name, email, role
      `, [id]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // Verificar senha
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
