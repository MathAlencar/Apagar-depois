import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './src/database';

import cors from 'cors';
import express from 'express';
import AdminRoutes from './src/routes/administrador/administradorRoutes';
import AdmintokenRoutes from './src/routes/administrador/TokenRoutes';
import PersonalRoutes from './src/routes/personal/personalRouter';
import tokenPersonalRoutes from './src/routes/personal/personalTokenRoutes';
import PersonalFotoRoutes from './src/routes/personal/personalFotosRouter';
import PersonalAgendaRoutes from './src/routes/personal/personalAgendaRoutes';
import AlunosRoutes from './src/routes/alunos/alunosRoutes';
import tokenAlunosRoutes from './src/routes/alunos/alunosTokenRoutes';
import AlunoFotosRoutes from './src/routes/alunos/alunosFotosRoutes';
import AgendaRoutes from './src/routes/AgendaGeral/agendaRoutes';
import EnderecosRoutes from './src/routes/enderecos/enredecosRoutes';
import ChatRoutes from './src/routes/chat/chatRoutes';
import ExerciciosPersonal from './src/routes/ExerciciosPersonal/ExerciciosPersonal';
import PlanoTreinoRoutes from './src/routes/PlanoTreino/PlanoTreinoRoutes';
import SessaoTreino from './src/routes/SessaoTreino/sessaoTreinoRoutes';
import itemExercicioRoutes from './src/routes/itemExercicio/itemExercicioRoutes';
import videoExercicioRoutes from './src/routes/ExerciciosPersonal/videoExercicioRoutes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, 'upload')));
  }

  routes() {
    this.app.use('/admin/', AdminRoutes);
    this.app.use('/enderecos/', EnderecosRoutes);
    this.app.use('/token/', AdmintokenRoutes);
    this.app.use('/alunos/token/', tokenAlunosRoutes);
    this.app.use('/alunos/', AlunosRoutes);
    this.app.use('/alunos/foto/', AlunoFotosRoutes);
    this.app.use('/personal/agenda/', PersonalAgendaRoutes);
    this.app.use('/personal/token/', tokenPersonalRoutes);
    this.app.use('/personal/foto/', PersonalFotoRoutes);
    this.app.use('/personal/', PersonalRoutes);
    this.app.use('/agenda/', AgendaRoutes);
    this.app.use('/chat/', ChatRoutes);
    this.app.use('/exercicios/', ExerciciosPersonal);
    this.app.use('/exercicios/video/', videoExercicioRoutes)
    this.app.use('/plano/', PlanoTreinoRoutes);
    this.app.use('/sessao/treino/', SessaoTreino);
    this.app.use('/item/exercicio/', itemExercicioRoutes);
  }
}

export default new App().app;
