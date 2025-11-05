"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _administradorControllersjs = require('../../Controllers/admin/administradorControllers.js'); var _administradorControllersjs2 = _interopRequireDefault(_administradorControllersjs);
var _adminLoginRiqueredjs = require('../../middlewares/adminLoginRiquered.js'); var _adminLoginRiqueredjs2 = _interopRequireDefault(_adminLoginRiqueredjs);

const router = _express.Router.call(void 0, );

router.post('/', _administradorControllersjs2.default.store); // irá cadastrar um novo administrador.
router.get('/', _administradorControllersjs2.default.index); // irá exibir todos os administradores do sistema.
router.get('/:id', _adminLoginRiqueredjs2.default, _administradorControllersjs2.default.show); // Irá retornar de acordo com o parâmetro passado um administrador.
router.put('/:id?', _adminLoginRiqueredjs2.default, _administradorControllersjs2.default.update);

exports. default = router;
