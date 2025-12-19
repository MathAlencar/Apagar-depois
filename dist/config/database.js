"use strict";Object.defineProperty(exports, "__esModule", {value: true});require('dotenv/config');

const config = {
  dialect: process.env.DATABASE_DIALECT || 'mariadb', // ou 'mysql'
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,

  define: { timestamps: true, underscored: true, underscoredAll: true },

  timezone: '-03:00',     // ✅ evita tz tables no MariaDB
  logging: false,
};

exports. default = config;
