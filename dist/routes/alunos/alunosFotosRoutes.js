"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _alunosFotosControllers = require('../../Controllers/alunos/alunosFotosControllers'); var _alunosFotosControllers2 = _interopRequireDefault(_alunosFotosControllers);

const route = _express.Router.call(void 0, );

route.post('/', _alunosFotosControllers2.default.store); // será uma rota protegida pelo token personal

exports. default = route;
