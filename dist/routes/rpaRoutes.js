"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _rpaControllersjs = require('../Controllers/rpaControllers.js'); var _rpaControllersjs2 = _interopRequireDefault(_rpaControllersjs);
var _adminLoginRiqueredjs = require('../middlewares/adminLoginRiquered.js'); var _adminLoginRiqueredjs2 = _interopRequireDefault(_adminLoginRiqueredjs);

const router = new (0, _express.Router)();

// Aplicar autenticação em todas as rotas desta API

// Endpoints para o upload de gráfico e imagem para o Ploomes - Usados para otimizar o processo de upload
router.get('/rpa-otimizado/', _adminLoginRiqueredjs2.default, _rpaControllersjs2.default.storeOtimizado.bind(_rpaControllersjs2.default));
router.get('/teste/', _rpaControllersjs2.default.teste.bind(_rpaControllersjs2.default));

// Endpoints para o upload de gráfico e imagem para o Ploomes - TESTES
// router.get('/busca/bacen', adminLoginRiquered, CadastroControllers.searchBacen.bind(CadastroControllers));
// router.get('/upload-to-ploomes', adminLoginRiquered, uploadMulti, CadastroControllers.uploadToPloomes.bind(CadastroControllers));
// router.get('/teste-grafico-upload/:cpf/:dealId', adminLoginRiquered, CadastroControllers.testeGraficoUpload.bind(CadastroControllers));
// router.get('/grafico/:cpf', adminLoginRiquered, CadastroControllers.gerarGraficoEvolucao.bind(CadastroControllers));

exports. default = router;
