"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _sequelize = require('sequelize');
var _Conversa = require('../../Models/Conversa'); var _Conversa2 = _interopRequireDefault(_Conversa);
var _Mensagem = require('../../Models/Mensagem'); var _Mensagem2 = _interopRequireDefault(_Mensagem);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);
var _FotoAlunos = require('../../Models/FotoAlunos'); var _FotoAlunos2 = _interopRequireDefault(_FotoAlunos);
var _FotoPersonal = require('../../Models/FotoPersonal'); var _FotoPersonal2 = _interopRequireDefault(_FotoPersonal);

class ChatController {
  async store(req, res) {
    try {
      const {
        usuario1_id,
        tipo_usuario1,
        usuario2_id,
        tipo_usuario2,
      } = req.body;

      if (
        !usuario1_id
        || !usuario2_id
        || !tipo_usuario1
        || !tipo_usuario2
      ) {
        return res.status(400).json({
          errors: ['Todos os campos são obrigatórios.'],
        });
      }

      const verificandoChatExist = await _Conversa2.default.findOne({
        where: {
          usuario1_id,
          usuario2_id,
        },
      });

      if (verificandoChatExist) {
        return res.status(401).json({
          errors: ['Já existe uma conversa iniciada entre este aluno e o Personal'],
        });
      }

      if (
        !['aluno', 'personal'].includes(tipo_usuario1)
        || !['aluno', 'personal'].includes(tipo_usuario2)
      ) {
        return res.status(400).json({
          errors: ['Os campos tipo_usuario devem ser "aluno" ou "personal".'],
        });
      }

      const conversa = await _Conversa2.default.create({
        usuario1_id,
        tipo_usuario1,
        usuario2_id,
        tipo_usuario2,
      });

      return res.status(201).json(conversa);
    } catch (e) {
      console.error('Erro ao criar conversa:', e);
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const { usuarioId, personalId } = req.params;

      const findAluno = await _Alunos2.default.findByPk(usuarioId);
      const findPersonal = await _Personal2.default.findByPk(personalId);

      if (!findAluno || !findPersonal){
        return res.status(400).json({
          errors: ['Não existe um personal ou aluno com estes IDs '],
        });
      }

      const conversas = await _Conversa2.default.findAll({
        where: {
          usuario1_id: usuarioId,
          usuario2_id: personalId,
        },
        include: [
          {
            model: _Alunos2.default,
            as: 'aluno_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: _FotoAlunos2.default,
                limit: 1,
                separate: true,
                attributes: ['url', 'filename'],
                order: [['id', 'DESC']],
              },
            ],
          },
          {
            model: _Personal2.default,
            as: 'personal_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: _FotoPersonal2.default,
                attributes: ['url', 'filename'],
                limit: 1,
                separate: true,
                order: [['id', 'DESC']],
              },
            ],
          },
          {
            model: _Mensagem2.default,
            as: 'mensagens',
            attributes: ['id', 'tipo_remetente', 'conteudo', 'created_at'],
            order: [['created_at', 'DESC']],
          },
        ],
        order: [['updated_at', 'DESC']],
      });

      return res.status(200).json(conversas);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async index(req, res){
    try {
      const { usuarioId, typeUser } = req.params;
      const validate = typeUser === '1';

      const user = validate ? await _Alunos2.default.findByPk(usuarioId) : await _Personal2.default.findByPk(usuarioId);

      if (!user){
        return res.status(400).json({
          errors: ['Não existe um personal ou aluno com estes IDs'],
        });
      }

      const optionsAluno = {
        usuario1_id: usuarioId,
      };

      const optionsPersonal = {
        usuario2_id: usuarioId,
      };

      const conversas = await _Conversa2.default.findAll({
        where: validate ? optionsAluno : optionsPersonal,
        include: [

          {
            model: _Alunos2.default,
            as: 'aluno_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: _FotoAlunos2.default,
                attributes: ['url', 'filename'],
                limit: 1, // Irá trazer somente o último registro do banco dessa tabela de acordo com a data.
                order: [['id', 'DESC']],
                separate: true, // Irá trazer somente o último registro do banco dessa tabela de acordo com a data.
              },
            ],
          },
          {
            model: _Personal2.default,
            as: 'personal_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: _FotoPersonal2.default,
                attributes: ['url', 'filename'],
                limit: 1,
                order: [['id', 'DESC']],
                separate: true,
              },
            ],
          },
          {
            model: _Mensagem2.default,
            as: 'mensagens',
            attributes: ['id', 'tipo_remetente', 'conteudo', 'created_at'],
            limit: 1,
            order: [['created_at', 'DESC']],
            separate: true,
          },
        ],
        order: [['updated_at', 'DESC']],
      });

      return res.status(200).json(conversas);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
      });
    }
  }

  // Separar em duas APi's distinstas;

  async listarMensagens(req, res) {
    try {
      const { conversaId } = req.params;

      const mensagens = await _Mensagem2.default.findAll({
        where: { conversa_id: conversaId },
        order: [['created_at', 'ASC']],
      });

      return res.status(200).json(mensagens);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _10 => _10.errors, 'optionalAccess', _11 => _11.map, 'call', _12 => _12((err) => err.message)]) || [e.message],
      });
    }
  }

  async enviarMensagem(req, res) {
    try {
      const {
        conversa_id,
        remetente_id,
        tipo_remetente,
        conteudo,
      } = req.body;

      if (
        !conversa_id
        || !remetente_id
        || !tipo_remetente
        || !conteudo
      ) {
        return res.status(400).json({
          errors: ['Todos os campos são obrigatórios para enviar a mensagem.'],
        });
      }

      const novaMensagem = await _Mensagem2.default.create({
        conversa_id,
        remetente_id,
        tipo_remetente,
        conteudo,
      });

      return res.status(201).json(novaMensagem);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _13 => _13.errors, 'optionalAccess', _14 => _14.map, 'call', _15 => _15((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new ChatController();
