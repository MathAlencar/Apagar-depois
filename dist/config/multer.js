"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path');

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

exports. default = {
  // Aqui você criou uma função que irá validar o tipo de aruqivo que você deseja receber, assim evitando envio de arquivos que não sejam da extensão .png ou .jpeg
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new _multer2.default.MulterError('Arquivo precisa ser PNG ou JPG'));
    }

    return cb(null, true);
  },
  storage: _multer2.default.diskStorage({ // definindo onde que será salvo o arquivo
    destination: (req, file, cb) => {
      cb(null, _path.resolve.call(void 0, __dirname, '..', '..', 'upload', 'images')); // Aqui você está definindo o caminho pelo qual irá ser salvo a foto.
    },
    filename: (req, file, cb) => {
      // Aqui você está definindo o nome da foto que será salva no seu servidor, onde para exivar problemas de repetição.
      // você irá capturar o milisegundos, enquanto que ao lado vocÊ irá pegar a extensão do arquivo enviado.
      cb(null, `${Date.now()}_${aleatorio()}${_path.extname.call(void 0, file.originalname)}`);
    },
  }), // irá salvar dentro de alguma pasta lá no servidor.
  
};
