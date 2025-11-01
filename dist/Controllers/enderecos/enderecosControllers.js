"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Enderecos = require('../../Models/Enderecos'); var _Enderecos2 = _interopRequireDefault(_Enderecos);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);

class EnderecosControllers {
  async store(req, res) {
    try {
      const { aluno_id, personal_id } = req.body;
      let endereco = '';

      if (aluno_id) {
        const id = aluno_id;
        const aluno = await _Alunos2.default.findByPk(id, {
          include: {
            model: _Enderecos2.default,
            attributes: ['id', 'aluno_id'],
            order: [['id', 'DESC']],
          },
        });

        if (!aluno) {
          return res.status(404).json({
            errors: ['Nenhum aluno foi encontrado'],
          });
        }

        if (aluno.dataValues.Endereco) {
          return res.status(401).json({
            errors: ['Já há um endereço vinculado a este perfil'],
          });
        }

        endereco = await _Enderecos2.default.create(req.body);
      }

      if (personal_id) {
        const id = personal_id;
        const personal = await _Personal2.default.findByPk(id, {
          include: {
            model: _Enderecos2.default,
            attributes: ['id', 'personal_id'],
            order: [['id', 'DESC']],
          },
        });

        if (!personal) {
          return res.status(404).json({
            errors: ['Nenhum personal foi encontrado'],
          });
        }

        if (personal.dataValues.Endereco) {
          return res.status(401).json({
            errors: ['Já há um endereço vinculado a este perfil'],
          });
        }

        endereco = await _Enderecos2.default.create(req.body);
      }

      return res.status(200).json(endereco);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const endereco = await _Enderecos2.default.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      const novosDados = await endereco.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para delete'],
        });
      }

      const endereco = await _Enderecos2.default.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      await endereco.destroy();

      return res.status(200).json({
        success: ['Excluido com sucesso'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new EnderecosControllers();
