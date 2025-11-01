"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);
var _FotoPersonal = require('../../Models/FotoPersonal'); var _FotoPersonal2 = _interopRequireDefault(_FotoPersonal);
var _PersonalAgenda = require('../../Models/PersonalAgenda'); var _PersonalAgenda2 = _interopRequireDefault(_PersonalAgenda);
var _AgendaAulas = require('../../Models/AgendaAulas'); var _AgendaAulas2 = _interopRequireDefault(_AgendaAulas);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Enderecos = require('../../Models/Enderecos'); var _Enderecos2 = _interopRequireDefault(_Enderecos);

class PersonalControllers {
  async store(req, res) {
    try {
      const newUser = await _Personal2.default.create(req.body);
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
      // Seguindo o padrão Odata de seleção;
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      // Aqui você seleciona atributos de uma mesma tabela;
      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      // Aqui ele é usado para consultar de outras tabelas;
      if (expand && expand.includes('foto')) {
        options.include.push({
          model: _FotoPersonal2.default,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('agenda')) {
        options.include.push({
          model: _PersonalAgenda2.default,
          attributes: ['id', 'personal_id', 'title', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: _AgendaAulas2.default,
          attributes: ['id', 'aluno_id', 'status', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: _Alunos2.default,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: _Enderecos2.default,
          attributes: ['id', 'personal_id', 'rua', 'numero', 'cidade', 'complemento', 'bairro', 'cidade', 'estado', 'cep'],
          order: [['id', 'DESC']],
        });
      }

      const users = await _Personal2.default.findAll(options);
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      if (expand && expand.includes('foto')) {
        options.include = [{
          model: _FotoPersonal2.default,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        }];
      }

      if (expand && expand.includes('agenda')) {
        options.include.push({
          model: _PersonalAgenda2.default,
          attributes: ['id', 'personal_id', 'title', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: _AgendaAulas2.default,
          attributes: ['id', 'aluno_id', 'status', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: _Alunos2.default,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: _Enderecos2.default,
          attributes: ['id', 'personal_id', 'rua', 'numero,', 'cidade', 'complemento', 'bairro', 'cidade', 'estado', 'cep'],
          order: [['id', 'DESC']],
        });
      }

      const user = await _Personal2.default.findByPk(req.params.id, options);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado em nossa base de dados'],
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
          errors: ['Chave não enviada para update'],
        });
      }

      const personal = await _Personal2.default.findByPk(req.params.id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Usuário não encontrado'],
        });
      }

      const novosDados = await personal.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _10 => _10.errors, 'optionalAccess', _11 => _11.map, 'call', _12 => _12((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new PersonalControllers();
