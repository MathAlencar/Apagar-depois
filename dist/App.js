"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path');

_dotenv2.default.config();

require('./database');

var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _administradorRoutes = require('./routes/administrador/administradorRoutes'); var _administradorRoutes2 = _interopRequireDefault(_administradorRoutes);
var _TokenRoutes = require('./routes/administrador/TokenRoutes'); var _TokenRoutes2 = _interopRequireDefault(_TokenRoutes);
var _personalRouter = require('./routes/personal/personalRouter'); var _personalRouter2 = _interopRequireDefault(_personalRouter);
var _personalTokenRoutes = require('./routes/personal/personalTokenRoutes'); var _personalTokenRoutes2 = _interopRequireDefault(_personalTokenRoutes);
var _personalFotosRouter = require('./routes/personal/personalFotosRouter'); var _personalFotosRouter2 = _interopRequireDefault(_personalFotosRouter);
var _personalAgendaRoutes = require('./routes/personal/personalAgendaRoutes'); var _personalAgendaRoutes2 = _interopRequireDefault(_personalAgendaRoutes);
var _alunosRoutes = require('./routes/alunos/alunosRoutes'); var _alunosRoutes2 = _interopRequireDefault(_alunosRoutes);
var _alunosTokenRoutes = require('./routes/alunos/alunosTokenRoutes'); var _alunosTokenRoutes2 = _interopRequireDefault(_alunosTokenRoutes);
var _alunosFotosRoutes = require('./routes/alunos/alunosFotosRoutes'); var _alunosFotosRoutes2 = _interopRequireDefault(_alunosFotosRoutes);
var _agendaRoutes = require('./routes/AgendaGeral/agendaRoutes'); var _agendaRoutes2 = _interopRequireDefault(_agendaRoutes);
var _enredecosRoutes = require('./routes/enderecos/enredecosRoutes'); var _enredecosRoutes2 = _interopRequireDefault(_enredecosRoutes);
var _chatRoutes = require('./routes/chat/chatRoutes'); var _chatRoutes2 = _interopRequireDefault(_chatRoutes);
var _ExerciciosPersonal = require('./routes/ExerciciosPersonal/ExerciciosPersonal'); var _ExerciciosPersonal2 = _interopRequireDefault(_ExerciciosPersonal);
var _PlanoTreinoRoutes = require('./routes/PlanoTreino/PlanoTreinoRoutes'); var _PlanoTreinoRoutes2 = _interopRequireDefault(_PlanoTreinoRoutes);
var _sessaoTreinoRoutes = require('./routes/SessaoTreino/sessaoTreinoRoutes'); var _sessaoTreinoRoutes2 = _interopRequireDefault(_sessaoTreinoRoutes);
var _itemExercicioRoutes = require('./routes/itemExercicio/itemExercicioRoutes'); var _itemExercicioRoutes2 = _interopRequireDefault(_itemExercicioRoutes);
var _videoExercicioRoutes = require('./routes/ExerciciosPersonal/videoExercicioRoutes'); var _videoExercicioRoutes2 = _interopRequireDefault(_videoExercicioRoutes);

class App {
  constructor() {
    this.app = _express2.default.call(void 0, );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(_cors2.default.call(void 0, ));
    this.app.use(_express2.default.urlencoded({ extended: true }));
    this.app.use(_express2.default.json());
    this.app.use(_express2.default.static(_path.resolve.call(void 0, __dirname, 'upload')));
  }

  routes() {
    this.app.use('/admin/', _administradorRoutes2.default);
    this.app.use('/enderecos/', _enredecosRoutes2.default);
    this.app.use('/token/', _TokenRoutes2.default);
    this.app.use('/alunos/token/', _alunosTokenRoutes2.default);
    this.app.use('/alunos/', _alunosRoutes2.default);
    this.app.use('/alunos/foto/', _alunosFotosRoutes2.default);
    this.app.use('/personal/agenda/', _personalAgendaRoutes2.default);
    this.app.use('/personal/token/', _personalTokenRoutes2.default);
    this.app.use('/personal/foto/', _personalFotosRouter2.default);
    this.app.use('/personal/', _personalRouter2.default);
    this.app.use('/agenda/', _agendaRoutes2.default);
    this.app.use('/chat/', _chatRoutes2.default);
    this.app.use('/exercicios/', _ExerciciosPersonal2.default);
    this.app.use('/exercicios/video/', _videoExercicioRoutes2.default)
    this.app.use('/plano/', _PlanoTreinoRoutes2.default);
    this.app.use('/sessao/treino/', _sessaoTreinoRoutes2.default);
    this.app.use('/item/exercicio/', _itemExercicioRoutes2.default);
  }
}

exports. default = new App().app;
