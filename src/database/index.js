import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

import Administrador from '../Models/Administrador.js';

const models = [
  Administrador,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
