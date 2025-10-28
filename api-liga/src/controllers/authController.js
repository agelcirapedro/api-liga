const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Registrar novo usuário
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: name, email, password'
        });
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // Validar tamanho da senha
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter no mínimo 6 caracteres'
        });
      }

      // Verificar se email já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      // Criar usuário
      const user = await User.create({ name, email, password });

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário',
        error: error.message
      });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login',
        error: error.message
      });
    }
  },

  // Obter perfil do usuário autenticado
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar perfil',
        error: error.message
      });
    }
  },

  // Atualizar perfil do usuário autenticado
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      // Verificar se usuário existe
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Se mudou o email, verificar se já existe
      if (email && email !== existingUser.email) {
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email já cadastrado'
          });
        }
      }

      const updatedUser = await User.update(userId, {
        name: name || existingUser.name,
        email: email || existingUser.email,
        role: existingUser.role
      });

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedUser
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar perfil',
        error: error.message
      });
    }
  },

  // Atualizar senha
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validação
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A nova senha deve ter no mínimo 6 caracteres'
        });
      }

      // Buscar usuário com senha
      const user = await User.findByEmail(req.user.email);
      
      // Verificar senha atual
      const isValidPassword = await User.comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      // Atualizar senha
      await User.updatePassword(userId, newPassword);

      res.json({
        success: true,
        message: 'Senha atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar senha',
        error: error.message
      });
    }
  }
};

module.exports = authController;
