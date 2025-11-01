"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _alunosTokensControllers = require('../../Controllers/alunos/alunosTokensControllers'); var _alunosTokensControllers2 = _interopRequireDefault(_alunosTokensControllers);

const router = _express.Router.call(void 0, );

router.post('/', _alunosTokensControllers2.default.store);

exports. default = router;
