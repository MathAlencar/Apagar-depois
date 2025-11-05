import { Router } from "express";
import CadastroControllers from "../Controllers/rpaControllers.js";
import adminLoginRiquered from '../middlewares/adminLoginRiquered.js';

const router = new Router();

// Aplicar autenticação em todas as rotas desta API

// Endpoints para o upload de gráfico e imagem para o Ploomes - Usados para otimizar o processo de upload
router.get('/rpa-otimizado/', adminLoginRiquered, CadastroControllers.storeOtimizado.bind(CadastroControllers));
router.get('/teste/', CadastroControllers.teste.bind(CadastroControllers));

// Endpoints para o upload de gráfico e imagem para o Ploomes - TESTES
// router.get('/busca/bacen', adminLoginRiquered, CadastroControllers.searchBacen.bind(CadastroControllers));
// router.get('/upload-to-ploomes', adminLoginRiquered, uploadMulti, CadastroControllers.uploadToPloomes.bind(CadastroControllers));
// router.get('/teste-grafico-upload/:cpf/:dealId', adminLoginRiquered, CadastroControllers.testeGraficoUpload.bind(CadastroControllers));
// router.get('/grafico/:cpf', adminLoginRiquered, CadastroControllers.gerarGraficoEvolucao.bind(CadastroControllers));

export default router;
