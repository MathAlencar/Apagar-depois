"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _PersonalAgenda = require('../../Models/PersonalAgenda'); var _PersonalAgenda2 = _interopRequireDefault(_PersonalAgenda);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);

// Realizar a criação do Delete, store (somente);
// Não é necessário criar um SHOW, porque esse valor está sendo retornado junto com o show do Personal Trainer
class PersonalAgenda {
  async store(req, res) {
    try {
      const { personal_id } = req.body;

      const user = await _Personal2.default.findByPk(personal_id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não localizado'],
        });
      }

      console.log(req.body);

      const registerDate = await _PersonalAgenda2.default.create(req.body);

      return res.status(200).json(registerDate);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Nenhum ID foi enviado'],
        });
      }

      const agenda = await _PersonalAgenda2.default.findByPk(req.params.id);

      if (!agenda) {
        return res.status(404).json({
          errors: ['Nenhum registro foi localizado'],
        });
      }

      await agenda.destroy();

      return res.status(200).json({
        sucess: ['Registro excluido com sucesso!'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new PersonalAgenda();
