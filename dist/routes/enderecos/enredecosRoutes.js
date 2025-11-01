"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _enderecosControllers = require('../../Controllers/enderecos/enderecosControllers'); var _enderecosControllers2 = _interopRequireDefault(_enderecosControllers);

const routes = _express.Router.call(void 0, );

routes.post('/', _enderecosControllers2.default.store);
routes.put('/:id', _enderecosControllers2.default.update);
routes.delete('/:id', _enderecosControllers2.default.delete);

exports. default = routes;
