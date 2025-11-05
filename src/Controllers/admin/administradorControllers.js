import Administrador from '../../Models/Administrador.js';

// Classe responsável por manipular novos usuários/administradores.
class AdministradorControllers {
  async store(req, res) {
    try {
      const newUser = await Administrador.create(req.body);
      const { id, nome, email } = newUser;
      return res.json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async index(req, res) {
    try {
      const users = await Administrador.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const user = await Administrador.findByPk(req.params.id, { attributes: ['id', 'nome', 'email'] });
      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada'],
        });
      }

      const admin = await Administrador.findByPk(req.params.id);

      if (!admin) {
        return res.status(400).json({
          errors: ['Usuário não localizado'],
        });
      }

      const novosDados = await admin.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new AdministradorControllers();
