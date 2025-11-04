"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _itemExercicio = require('../../Models/itemExercicio'); var _itemExercicio2 = _interopRequireDefault(_itemExercicio);

class ItemExercicioControllers {

  async store(req, res) {
    try {

      const {ordem, series, repeticoes, tempo_descanso_segundos, observacoes, exercicio_personal_id} = req.body;

      const body = {
        exercicio_personal_id,
        sessao_treino_id: req.params.id,
        ordem,
        series,
        repeticoes,
        tempo_descanso_segundos,
        observacoes
      }

      const newItemExercicio = await _itemExercicio2.default.create(body);

      return res.status(200).json(newItemExercicio);
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

      const ItemExercicio = await _itemExercicio2.default.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!ItemExercicio) {
        return res.status(400).json({
          errors: ['Sessão não encontrada'],
        });
      }

      const newItemExercicio = await ItemExercicio.update(req.body);

      return res.status(200).json(newItemExercicio);
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

      const ItemExercicio = await _itemExercicio2.default.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!ItemExercicio) {
        return res.status(400).json({
          errors: ['item não encontrado'],
        });
      }

      await ItemExercicio.destroy();

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

exports. default = new ItemExercicioControllers();
