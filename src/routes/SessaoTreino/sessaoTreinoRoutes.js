import { Router } from 'express';
import sessaoTreinoControllers from '../../Controllers/sessaoTreino/sessaoTreinoControllers';
import personalLoginRiquered from "../../middlewares/personalLoginRiquered";


const routes = Router();

routes.post('/:id/', personalLoginRiquered, sessaoTreinoControllers.store); // Cadastrar plano de treino.
routes.put('/update/:id/', personalLoginRiquered, sessaoTreinoControllers.update); // Cadastrar plano de treino.
routes.delete('/delete/:id/', personalLoginRiquered, sessaoTreinoControllers.delete); // Cadastrar plano de treino.

export default routes;
