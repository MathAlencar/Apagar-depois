"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _itemExercicioControllers = require('../../Controllers/itemExercicio/itemExercicioControllers'); var _itemExercicioControllers2 = _interopRequireDefault(_itemExercicioControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/:id/', _personalLoginRiquered2.default, _itemExercicioControllers2.default.store);
routes.put('/update/:id/', _personalLoginRiquered2.default, _itemExercicioControllers2.default.update);
routes.delete('/delete/:id/', _personalLoginRiquered2.default, _itemExercicioControllers2.default.delete);


exports. default = routes;
