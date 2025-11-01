import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './database';

import cors from 'cors';
import express from 'express';
import AdminRoutes from './routes/administrador/administradorRoutes';
import AdmintokenRoutes from './routes/administrador/TokenRoutes';
import PersonalRoutes from './routes/personal/personalRouter';
import tokenPersonalRoutes from './routes/personal/personalTokenRoutes';
import PersonalFotoRoutes from './routes/personal/personalFotosRouter';
import PersonalAgendaRoutes from './routes/personal/personalAgendaRoutes';
import AlunosRoutes from './routes/alunos/alunosRoutes';
import tokenAlunosRoutes from './routes/alunos/alunosTokenRoutes';
import AlunoFotosRoutes from './routes/alunos/alunosFotosRoutes';
import AgendaRoutes from './routes/AgendaGeral/agendaRoutes';
import EnderecosRoutes from './routes/enderecos/enredecosRoutes';
import ChatRoutes from './routes/chat/chatRoutes';
import ExerciciosPersonal from './routes/ExerciciosPersonal/ExerciciosPersonal';
import PlanoTreinoRoutes from './routes/PlanoTreino/PlanoTreinoRoutes';
import SessaoTreino from './routes/SessaoTreino/sessaoTreinoRoutes';
import itemExercicioRoutes from './routes/itemExercicio/itemExercicioRoutes';
import videoExercicioRoutes from './routes/ExerciciosPersonal/videoExercicioRoutes';

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
