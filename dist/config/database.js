"use strict";Object.defineProperty(exports, "__esModule", {value: true});// import 'dotenv/config';

// const config = {
//   dialect: process.env.DATABASE_DIALECT || 'mariadb', // ou 'mysql'
//   host: process.env.DATABASE_HOST,
//   port: Number(process.env.DATABASE_PORT || 3306),
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE,

//   define: { timestamps: true, underscored: true, underscoredAll: true },

//   timezone: '-03:00',     // ✅ evita tz tables no MariaDB
//   logging: false,
// };

// export default config;



require('dotenv/config');

const useSSL = process.env.DB_SSL === 'true';

const config = {
  dialect: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,

  // ✅ timezone é no nível raiz (não dentro de define)
  timezone: '-03:00',
  logging: false,

  define: {
    timestamps: true,
    underscored: false,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },

  dialectOptions: useSSL
    ? {
        ssl: {
          ca: (process.env.DB_SSL_CA || '').replace(/\\n/g, '\n'),
          rejectUnauthorized: true,          // valida CA
          checkServerIdentity: () => undefined, // ignora mismatch hostname/SAN
        },
      }
    : {},
};

exports. default = config;
