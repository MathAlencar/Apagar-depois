"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _agendaControllers = require('../../Controllers/agendaAula/agendaControllers'); var _agendaControllers2 = _interopRequireDefault(_agendaControllers);

const routes = _express.Router.call(void 0, );

routes.post('/', _agendaControllers2.default.store);
routes.delete('/:id', _agendaControllers2.default.delete);
routes.put('/:id', _agendaControllers2.default.update);

exports. default = routes;
