"use strict";Object.defineProperty(exports, "__esModule", {value: true});// require('dotenv').config();

// module.exports = {
//   dialect: 'mariadb',
//   host: process.env.DATABASE_HOST,
//   port: process.env.DATABASE_PORT,
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE,
//   define: {
//     timestamps: true,
//     underscored: false,
//     underscoredAll: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
//   dialectOptions: {
//     timezone: 'America/Sao_Paulo',
//   },
//   timezone: 'America/Sao_Paulo',
// };

// ESM – nada de require/module.exports aqui
require('dotenv/config');

const config = {
  dialect: process.env.DATABASE_DIALECT || 'mysql', // ou 'mariadb'
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: { timestamps: true, underscored: true, underscoredAll: true },
  dialectOptions: { timezone: 'America/Sao_Paulo' },
  timezone: '-03:00',
  logging: false, // opcional
};

exports. default = config;
