import { Router } from "express";
import CadastroControllers from "../Controllers/rpaControllers.js";
import adminLoginRiquered from '../middlewares/adminLoginRiquered.js';

const router = new Router();

// Aplicar autenticação em todas as rotas desta API

// Endpoints para o upload de gráfico e imagem para o Ploomes - Usados para otimizar o processo de upload
router.get('/rpa-otimizado/', adminLoginRiquered, CadastroControllers.storeOtimizado.bind(CadastroControllers));
router.get('/teste/', CadastroControllers.teste.bind(CadastroControllers));

export default router;
