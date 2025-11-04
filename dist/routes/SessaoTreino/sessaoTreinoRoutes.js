"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _sessaoTreinoControllers = require('../../Controllers/sessaoTreino/sessaoTreinoControllers'); var _sessaoTreinoControllers2 = _interopRequireDefault(_sessaoTreinoControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/:id/', _personalLoginRiquered2.default, _sessaoTreinoControllers2.default.store); // Cadastrar plano de treino.
routes.put('/update/:id/', _personalLoginRiquered2.default, _sessaoTreinoControllers2.default.update); // Cadastrar plano de treino.
routes.delete('/delete/:id/', _personalLoginRiquered2.default, _sessaoTreinoControllers2.default.delete); // Cadastrar plano de treino.

exports. default = routes;
