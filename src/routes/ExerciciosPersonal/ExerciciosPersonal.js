import { Router } from 'express';
import ExerciciosPersonal from '../../Controllers/ExerciciosPersonal/ExercicioPersonal';
import personalLoginRiquered from '../../middlewares/personalLoginRiquered';

const routes = Router();

routes.post('/', personalLoginRiquered, ExerciciosPersonal.store);
routes.get('/', personalLoginRiquered, ExerciciosPersonal.index);
routes.put('/:id', personalLoginRiquered, ExerciciosPersonal.update);
routes.delete('/:id', personalLoginRiquered, ExerciciosPersonal.delete);


// routes.delete('/:id', ExerciciosPersonal.delete);
// routes.put('/:id', ExerciciosPersonal.update);

export default routes;
