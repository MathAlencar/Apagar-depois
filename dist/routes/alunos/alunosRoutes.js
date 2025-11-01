"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _alunosControllers = require('../../Controllers/alunos/alunosControllers'); var _alunosControllers2 = _interopRequireDefault(_alunosControllers);
var _alunoLoginRiquered = require('../../middlewares/alunoLoginRiquered'); var _alunoLoginRiquered2 = _interopRequireDefault(_alunoLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/', _alunosControllers2.default.store);
routes.get('/', _alunosControllers2.default.index);
routes.get('/:id', _alunosControllers2.default.show);
routes.put('/:id?', _alunoLoginRiquered2.default, _alunosControllers2.default.update);

exports. default = routes;
