const pool = require('../database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🔄 Executando migrations...');
    
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'create_users_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar migration
    await pool.query(sql);
    
    console.log('✅ Migration concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigrations();
