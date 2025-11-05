"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _url = require('url');
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _adminLoginRiqueredjs = require('./middlewares/adminLoginRiquered.js'); var _adminLoginRiqueredjs2 = _interopRequireDefault(_adminLoginRiqueredjs);

_dotenv2.default.config();

// importa sua conexão antes das rotas
require('./database/index.js');

var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _express = require('express'); var _express2 = _interopRequireDefault(_express);

// IMPORTS LOCAIS **com .js**
var _administradorRoutesjs = require('./routes/administrador/administradorRoutes.js'); var _administradorRoutesjs2 = _interopRequireDefault(_administradorRoutesjs);
var _TokenRoutesjs = require('./routes/administrador/TokenRoutes.js'); var _TokenRoutesjs2 = _interopRequireDefault(_TokenRoutesjs);
var _rpaRoutesjs = require('./routes/rpaRoutes.js'); var _rpaRoutesjs2 = _interopRequireDefault(_rpaRoutesjs);

// __dirname em ESM
const __filename = _url.fileURLToPath.call(void 0, import.meta.url);
const __dirname = _path2.default.dirname(__filename);

class App {
  constructor() {
    this.app = _express2.default.call(void 0, );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(_cors2.default.call(void 0, ));
    this.app.use(_express2.default.urlencoded({ extended: true }));
    this.app.use(_express2.default.json());

    // arquivos estáticos do front-end
    this.app.use(_express2.default.static(_path2.default.join(__dirname, './Front-end/Front-end')));
  }

  routes() {
    this.app.use('/admin', _administradorRoutesjs2.default);
    this.app.use('/token', _TokenRoutesjs2.default);
    this.app.use('/', _rpaRoutesjs2.default);

    this.app.get('/excel/manifest.json', _adminLoginRiqueredjs2.default, (req, res) => {
      const dir = _path2.default.join(__dirname, './Front-end/Documentos Excel');
      _fs2.default.readdir(dir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler pasta' });
        const onlyExcel = files.filter(f =>
          /\.(xls|xlsx|xlsm|xlsb|xltx|xltm|xlam|csv)$/i.test(f)
        );
        res.json(onlyExcel);
      });
    });

    this.app.use(
      '/excel/download/',
      _adminLoginRiqueredjs2.default,
      _express2.default.static(_path2.default.join(__dirname, './Front-end/Documentos Excel'))
    );
  }
}

exports. default = new App().app;
