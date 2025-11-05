import { Router } from 'express';
import administradorControllers from '../../Controllers/admin/administradorControllers.js';
import loginRiquered from '../../middlewares/adminLoginRiquered.js';

const router = Router();

router.post('/', administradorControllers.store); // irá cadastrar um novo administrador.
router.get('/', administradorControllers.index); // irá exibir todos os administradores do sistema.
router.get('/:id', loginRiquered, administradorControllers.show); // Irá retornar de acordo com o parâmetro passado um administrador.
router.put('/:id?', loginRiquered, administradorControllers.update);

export default router;
