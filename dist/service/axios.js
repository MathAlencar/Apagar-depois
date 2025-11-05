"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

 const apiPloomes = _axios2.default.create({
    baseURL: 'https://api2.ploomes.com',
}); exports.apiPloomes = apiPloomes;

 const apiBacen = _axios2.default.create({
    baseURL: 'https://api.multiplo.moneyp.com.br/api',
}); exports.apiBacen = apiBacen;
