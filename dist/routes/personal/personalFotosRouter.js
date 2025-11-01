"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _personalFotosControllers = require('../../Controllers/personal/personalFotosControllers'); var _personalFotosControllers2 = _interopRequireDefault(_personalFotosControllers);

const route = _express.Router.call(void 0, );

route.post('/', _personalFotosControllers2.default.store); // será uma rota protegida pelo token personal

exports. default = route;
