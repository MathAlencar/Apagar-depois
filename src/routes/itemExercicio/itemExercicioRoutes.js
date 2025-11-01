import { Router } from 'express';
import itemExercicioControllers from '../../Controllers/itemExercicio/itemExercicioControllers';
import personalLoginRiquered from "../../middlewares/personalLoginRiquered";

const routes = Router();

routes.post('/:id/', personalLoginRiquered, itemExercicioControllers.store); 
routes.put('/update/:id/', personalLoginRiquered, itemExercicioControllers.update); 
routes.delete('/delete/:id/', personalLoginRiquered, itemExercicioControllers.delete); 


export default routes;
