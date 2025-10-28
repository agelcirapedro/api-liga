const pool = require('./database');

async function createTables() {
  try {
    // Criar tabela de gestos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gestures (
        id SERIAL PRIMARY KEY,
        word VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        video_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir dados iniciais
    await pool.query(`
      INSERT INTO gestures (word, category, description) 
      VALUES 
        ('bom dia', 'saudacao', 'Saudação matinal'),
        ('obrigado', 'educacao', 'Agradecimento'),
        ('água', 'necessidades', 'Pedido de água')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    pool.end();
  }
}

createTables();