"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _ExercicioPersonal = require('../../Models/ExercicioPersonal'); var _ExercicioPersonal2 = _interopRequireDefault(_ExercicioPersonal);
var _videoExercicio = require('../../Models/videoExercicio'); var _videoExercicio2 = _interopRequireDefault(_videoExercicio);

class ExercicioControllers {

  async store(req, res) {
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const { nome, grupo_muscular, descricao } = req.body;

      const body = {
        personal_id: req.userID,
        nome,
        grupo_muscular,
        descricao
      }

      const newExercicio = await _ExercicioPersonal2.default.create(body);

      return res.status(200).json(newExercicio);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async index(req,res){
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const options = {
        order: [['id', 'DESC']],
        include: [
          {
            model: _videoExercicio2.default,
            attributes: ['url', 'filename'],
            order: [['id', 'DESC']],
          }
        ]
      };

      const result = await _ExercicioPersonal2.default.findAll({
        where: {
          personal_id: req.userID
        },
        ...options
      })

      return res.status(200).json({
        result
      })

    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
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

      const exercicio = await _ExercicioPersonal2.default.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!exercicio) {
        return res.status(400).json({
          errors: ['Exercicio não encontrado'],
        });
      }
      
      const newExercicio = await exercicio.update(req.body);

      return res.status(200).json(newExercicio);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
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

      const exercicio = await _ExercicioPersonal2.default.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!exercicio) {
        return res.status(400).json({
          errors: ['Exercicio não encontrado'],
        });
      }
      
      await exercicio.destroy();

      return res.status(200).json({
        message: ['Excluido com sucesso!']
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _10 => _10.errors, 'optionalAccess', _11 => _11.map, 'call', _12 => _12((err) => err.message)]) || [e.message],
      });
    }
  }

}

exports. default = new ExercicioControllers();
