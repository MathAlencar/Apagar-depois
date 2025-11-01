"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _sessaoTreino = require('../../Models/sessaoTreino'); var _sessaoTreino2 = _interopRequireDefault(_sessaoTreino);

class SessaoTreinoControllers {

  async store(req, res) {
    try {
        
      const {identificador, titulo, ordem} = req.body;

      const body = {
        plano_treino_id: req.params.id,
        identificador,
        titulo,
        ordem
      }

      const newSessaoTreino = await _sessaoTreino2.default.create(body);

      return res.status(200).json(newSessaoTreino);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
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

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const sessaoTreino = await _sessaoTreino2.default.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!sessaoTreino) {
        return res.status(400).json({
          errors: ['Sessão não encontrada'],
        });
      }
      
      const newSessaoTreino = await sessaoTreino.update(req.body);

      return res.status(200).json(newSessaoTreino);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const sessaoTreino = await _sessaoTreino2.default.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!sessaoTreino) {
        return res.status(400).json({
          errors: ['sessão não encontrado'],
        });
      }
      
      await sessaoTreino.destroy();

      return res.status(200).json({
        message: ['Excluido com sucesso!']
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
      });
    }
  }

}

exports. default = new SessaoTreinoControllers();
