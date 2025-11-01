"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _videoExercicioControllers = require('../../Controllers/ExerciciosPersonal/videoExercicioControllers'); var _videoExercicioControllers2 = _interopRequireDefault(_videoExercicioControllers);

const route = _express.Router.call(void 0, );

route.post('/', _videoExercicioControllers2.default.store); // será uma rota protegida pelo token personal

exports. default = route;
