"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Administrador = require('../../Models/Administrador'); var _Administrador2 = _interopRequireDefault(_Administrador);

// Classe responsável por manipular novos usuários/administradores.
class AdministradorControllers {
  async store(req, res) {
    try {
      const newUser = await _Administrador2.default.create(req.body);
      const { id, nome, email } = newUser;
      return res.json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async index(req, res) {
    try {
      const users = await _Administrador2.default.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const user = await _Administrador2.default.findByPk(req.params.id, { attributes: ['id', 'nome', 'email'] });
      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
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

      const admin = await _Administrador2.default.findByPk(req.params.id);

      if (!admin) {
        return res.status(400).json({
          errors: ['Usuário não localizado'],
        });
      }

      const novosDados = await admin.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _10 => _10.errors, 'optionalAccess', _11 => _11.map, 'call', _12 => _12((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new AdministradorControllers();
