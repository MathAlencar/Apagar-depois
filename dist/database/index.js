"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _databasejs = require('../config/database.js'); var _databasejs2 = _interopRequireDefault(_databasejs);

var _Administradorjs = require('../Models/Administrador.js'); var _Administradorjs2 = _interopRequireDefault(_Administradorjs);

const models = [
  _Administradorjs2.default,
];

const connection = new (0, _sequelize.Sequelize)(_databasejs2.default);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
