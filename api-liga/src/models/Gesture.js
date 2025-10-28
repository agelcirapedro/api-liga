// Modelo para futura integração com PostgreSQL
class Gesture {
  constructor(id, word, category) {
    this.id = id;
    this.word = word;
    this.category = category;
  }

  // Método estático para buscar todos (mock por enquanto)
  static async findAll() {
    // TODO: Substituir por consulta PostgreSQL
    return [
      { id: 1, word: 'bom dia', category: 'saudacao' },
      { id: 2, word: 'obrigado', category: 'educacao' },
      { id: 3, word: 'água', category: 'necessidades' }
    ];
  }

  // Método para buscar por ID
  static async findById(id) {
    // TODO: Substituir por consulta PostgreSQL
    const gestures = await this.findAll();
    return gestures.find(g => g.id === parseInt(id));
  }
}

module.exports = Gesture;