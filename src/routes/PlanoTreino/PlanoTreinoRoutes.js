import { Router } from 'express';
import planoTreinoControllers from '../../Controllers/planoTreino/planoTreinoControllers';
import personalLoginRiquered from '../../middlewares/personalLoginRiquered';
import alunoLoginRiquered from '../../middlewares/alunoLoginRiquered';

const routes = Router();

routes.post('/:id/', personalLoginRiquered ,planoTreinoControllers.store); // Cadastrar plano de treino.

routes.get('/personal/aluno/planos/:id/', personalLoginRiquered , planoTreinoControllers.index); // Rota que o personal terá acesso, para consultar todos os dados de planos de um aluno, porém mais de um treino.
routes.get('/personal/aluno/plano/:id', personalLoginRiquered , planoTreinoControllers.indexOne); // Rota que o personal terá acesso, para consultar todos os dados de um plano de um aluno, porém somente um plano.

routes.get('/aluno/planos/:id/', alunoLoginRiquered , planoTreinoControllers.index); // Rota que irá retornar todos os treinos de um aluno, rota dedicada a alunos.
routes.get('/aluno/plano/:id/', alunoLoginRiquered , planoTreinoControllers.indexOne); // Rota que irá retornar todos os treinos de um aluno, rota dedicada a alunos

routes.put('/:id', personalLoginRiquered, planoTreinoControllers.update);
routes.delete('/:id', personalLoginRiquered, planoTreinoControllers.delete);

export default routes;
