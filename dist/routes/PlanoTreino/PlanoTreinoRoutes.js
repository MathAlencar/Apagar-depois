"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _planoTreinoControllers = require('../../Controllers/planoTreino/planoTreinoControllers'); var _planoTreinoControllers2 = _interopRequireDefault(_planoTreinoControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);
var _alunoLoginRiquered = require('../../middlewares/alunoLoginRiquered'); var _alunoLoginRiquered2 = _interopRequireDefault(_alunoLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/:id/', _personalLoginRiquered2.default , _planoTreinoControllers2.default.store); // Cadastrar plano de treino.

routes.get('/personal/aluno/planos/:id/', _personalLoginRiquered2.default , _planoTreinoControllers2.default.index); // Rota que o personal terá acesso, para consultar todos os dados de planos de um aluno, porém mais de um treino.
routes.get('/personal/aluno/plano/:id', _personalLoginRiquered2.default , _planoTreinoControllers2.default.indexOne); // Rota que o personal terá acesso, para consultar todos os dados de um plano de um aluno, porém somente um plano.

routes.get('/aluno/planos/:id/', _alunoLoginRiquered2.default , _planoTreinoControllers2.default.index); // Rota que irá retornar todos os treinos de um aluno, rota dedicada a alunos.
routes.get('/aluno/plano/:id/', _alunoLoginRiquered2.default , _planoTreinoControllers2.default.indexOne); // Rota que irá retornar todos os treinos de um aluno, rota dedicada a alunos

routes.put('/:id', _personalLoginRiquered2.default, _planoTreinoControllers2.default.update);
routes.delete('/:id', _personalLoginRiquered2.default, _planoTreinoControllers2.default.delete);

exports. default = routes;
