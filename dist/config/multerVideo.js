"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path');

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

exports. default = {
  // Aqui você criou uma função que irá validar o tipo de aruqivo que você deseja receber, assim evitando envio de arquivos que não sejam da extensão .png ou .jpeg
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/x-matroska', // .mkv
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new _multer2.default.MulterError('Arquivo precisa ser um vídeo válido (.mp4, .mov, .avi, etc.)'));
    }

    return cb(null, true);
  },
  
  storage: _multer2.default.diskStorage({
    destination: (req, file, cb) => {
      cb(null, _path.resolve.call(void 0, __dirname, '..', '..', 'upload', 'videos'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${_path.extname.call(void 0, file.originalname)}`);
    },

  }), // irá salvar dentro de alguma pasta lá no servidor.
  
};
