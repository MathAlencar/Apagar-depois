import { Router } from 'express';
import tokenControllers from '../../Controllers/admin/adminTokenControllers.js';

const router = Router();

router.post('/', tokenControllers.store);

export default router;
