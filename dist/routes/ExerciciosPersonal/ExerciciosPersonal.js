"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _ExercicioPersonal = require('../../Controllers/ExerciciosPersonal/ExercicioPersonal'); var _ExercicioPersonal2 = _interopRequireDefault(_ExercicioPersonal);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/', _personalLoginRiquered2.default, _ExercicioPersonal2.default.store);
routes.get('/', _personalLoginRiquered2.default, _ExercicioPersonal2.default.index);
routes.put('/:id', _personalLoginRiquered2.default, _ExercicioPersonal2.default.update);
routes.delete('/:id', _personalLoginRiquered2.default, _ExercicioPersonal2.default.delete);


// routes.delete('/:id', ExerciciosPersonal.delete);
// routes.put('/:id', ExerciciosPersonal.update);

exports. default = routes;
