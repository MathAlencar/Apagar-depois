/**
 * Arquivo de inicialização do banco de dados Sequelize
 * Objetivo: Configurar conexão com banco de dados e inicializar todos os models
 * Como funciona: Cria instância do Sequelize com configurações do database.js, inicializa todos os models registrados, e executa associações entre models se existirem
 */
import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

import Administrador from '../Models/Administrador.js';

const models = [
  Administrador,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
