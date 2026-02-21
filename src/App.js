import dotenv from 'dotenv';
import path from 'path';
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

// __dirname em ESM

const PUBLIC_DIR = path.join(__dirname, '../Front-end/Front-end');
const PUBLIC_DIR_UPLOAD = path.join(__dirname, '../Front-end/Documentos Excel/');

/**
 * Classe principal da aplicação Express
 * Objetivo: Configurar e inicializar o servidor Express com middlewares e rotas
 * Como funciona: No construtor inicializa Express, configura middlewares (CORS, JSsON, arquivos estáticos), e registra todas as rotas da aplicação
 */
class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  /**
   * Objetivo: Configurar middlewares do Express (CORS, parsing de JSON/URL, arquivos estáticos)
   * Como funciona: Habilita CORS, configura parsing de URL encoded e JSON, e serve arquivos estáticos do front-end e pasta de documentos Excel
   */
  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    // arquivos estáticos do front-end
    // this.app.use(express.static(path.join(__dirname, './Front-end/Front-end')));

     // Servir o front-end e também os arquivos de Excel
    this.app.use(express.static(PUBLIC_DIR));
    this.app.use('/excel/', express.static(PUBLIC_DIR_UPLOAD));
  }

  /**
   * Objetivo: Registrar todas as rotas da aplicação
   * Como funciona: Define rota raiz para servir index.html, registra rotas de autenticação e RPA, e configura rotas protegidas para listar e baixar arquivos Excel
   */
  routes() {
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });

    // this.app.use('/admin', AdminRoutes);
    this.app.use('/token', AdmintokenRoutes);
    this.app.use('/', RpaRoutes);

    // this.app.get('/excel/manifest.json', adminLoginRequired, (req, res) => {
    //   const dir = path.join(__dirname, './Front-end/Documentos Excel');
    //   fs.readdir(dir, (err, files) => {
    //     if (err) return res.status(500).json({ error: 'Erro ao ler pasta' });
    //     const onlyExcel = files.filter(f =>
    //       /\.(xls|xlsx|xlsm|xlsb|xltx|xltm|xlam|csv)$/i.test(f)
    //     );
    //     res.json(onlyExcel);
    //   });
    // });

    // 🔧 Listar arquivos Excel (rota protegida)
    this.app.get('/excel/manifest.json', adminLoginRequired, (req, res) => {
      fs.readdir(PUBLIC_DIR_UPLOAD, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler pasta' });
        const onlyExcel = files.filter(f =>
          /\.(xls|xlsx|xlsm|xlsb|xltx|xltm|xlam|csv)$/i.test(f)
        );
        res.json(onlyExcel);
      });
    });

    // 🔧 Download de arquivos Excel (rota protegida)
    this.app.use(
      '/excel/download',
      adminLoginRequired,
      express.static(PUBLIC_DIR_UPLOAD)
    );
  }
}

export default new App().app;
