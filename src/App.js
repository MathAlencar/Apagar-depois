import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import adminLoginRequired from './middlewares/adminLoginRiquered.js';

dotenv.config();

// importa sua conexão antes das rotas
import './database/index.js';

import cors from 'cors';
import express from 'express';

// IMPORTS LOCAIS **com .js**
import AdminRoutes from './routes/administrador/administradorRoutes.js';
import AdmintokenRoutes from './routes/administrador/TokenRoutes.js';
import RpaRoutes from './routes/rpaRoutes.js';

const PUBLIC_DIR = path.join(__dirname, '../Front-end/Front-end');

// __dirname em ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    // arquivos estáticos do front-end
    // this.app.use(express.static(path.join(__dirname, './Front-end/Front-end')));

    // 🔧 servir estáticos da pasta correta
    this.app.use(express.static(PUBLIC_DIR));
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });

    this.app.use('/admin', AdminRoutes);
    this.app.use('/token', AdmintokenRoutes);
    this.app.use('/', RpaRoutes);

    this.app.get('/excel/manifest.json', adminLoginRequired, (req, res) => {
      const dir = path.join(__dirname, './Front-end/Documentos Excel');
      fs.readdir(dir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler pasta' });
        const onlyExcel = files.filter(f =>
          /\.(xls|xlsx|xlsm|xlsb|xltx|xltm|xlam|csv)$/i.test(f)
        );
        res.json(onlyExcel);
      });
    });

    this.app.use(
      '/excel/download/',
      adminLoginRequired,
      express.static(path.join(__dirname, './Front-end/Documentos Excel'))
    );
  }
}

export default new App().app;
