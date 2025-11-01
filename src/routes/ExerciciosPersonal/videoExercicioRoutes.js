import { Router } from 'express';
import videoExercicioControllers from '../../Controllers/ExerciciosPersonal/videoExercicioControllers';

const route = Router();

route.post('/', videoExercicioControllers.store); // será uma rota protegida pelo token personal

export default route;
