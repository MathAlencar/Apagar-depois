"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _chatControllers = require('../../Controllers/chat/chatControllers'); var _chatControllers2 = _interopRequireDefault(_chatControllers);

const router = new (0, _express.Router)();

router.post('/conversas/', _chatControllers2.default.store);
router.get('/conversa/:usuarioId/:personalId', _chatControllers2.default.show);
router.get('/conversas/:usuarioId/:typeUser', _chatControllers2.default.index);

router.get('/mensagens/:conversaId', _chatControllers2.default.listarMensagens);
router.post('/mensagens', _chatControllers2.default.enviarMensagem);

exports. default = router;
