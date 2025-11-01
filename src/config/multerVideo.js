import multer from 'multer';
import { extname, resolve } from 'path';

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
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
      return cb(new multer.MulterError('Arquivo precisa ser um vídeo válido (.mp4, .mov, .avi, etc.)'));
    }

    return cb(null, true);
  },
  
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'upload', 'videos'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },

  }), // irá salvar dentro de alguma pasta lá no servidor.
  
};
