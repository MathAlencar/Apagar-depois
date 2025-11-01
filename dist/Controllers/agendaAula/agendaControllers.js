"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _sequelize = require('sequelize');
var _AgendaAulas = require('../../Models/AgendaAulas'); var _AgendaAulas2 = _interopRequireDefault(_AgendaAulas);
var _PersonalAgenda = require('../../Models/PersonalAgenda'); var _PersonalAgenda2 = _interopRequireDefault(_PersonalAgenda);

// Não é necessário criar um SHOW e nem INDEX, porque esse valor está sendo retornado junto com o SHOW/INDEX do Personal Trainer e no Aluno;
// Sendo necessário somente as API's de alteração de estados

class AgendaControllers {
  async store(req, res) {
    try {
      const {
        personal_id, date_init, date_end,
      } = req.body;

      const restricao = await _PersonalAgenda2.default.findOne({
        where: {
          personal_id,
          [_sequelize.Op.and]: [
            { date_init: { [_sequelize.Op.lte]: date_end } },
            { date_end: { [_sequelize.Op.gte]: date_init } },
          ],
        },
        attributes: ['title', 'date_init', 'date_end'],
      });

      if (restricao) {
        return res.status(404).json({
          errors: ['Professor indisponível neste horário'],
          agenda: conflito,
        });
      }

      const conflito = await _AgendaAulas2.default.findOne({
        where: {
          personal_id,
          [_sequelize.Op.and]: [
            { date_init: { [_sequelize.Op.lte]: date_end } },
            { date_end: { [_sequelize.Op.gte]: date_init } },
          ],
        },
        attributes: ['id', 'status', 'date_init', 'date_end', 'endereco'],
      });

      if (conflito && conflito.dataValues.status === 'aceita') {
        return res.status(404).json({
          errors: ['Já existe um horário marcado com este personal nesta data'],
        });
      }

      const aula = await _AgendaAulas2.default.create(req.body);

      return res.status(200).json(aula);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(200).json({
          errors: ['Nenhuma chave foi enviada'],
        });
      }

      const aula = await _AgendaAulas2.default.findByPk(req.params.id);

      if (!aula) {
        return res.status(404).json({
          errors: ['Aula não localizada'],
        });
      }

      await aula.destroy();

      return res.status(200).json({
        success: ['Aula exclúida com sucesso'],
      });
    } catch (e) {
      return res.status(404).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  // Somente irá receber a alteração de status
  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const aula = await _AgendaAulas2.default.findByPk(req.params.id);

      if (!aula) {
        return res.status(400).json({
          errors: ['Aula não encontrado'],
        });
      }

      const novosDados = await aula.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new AgendaControllers();
