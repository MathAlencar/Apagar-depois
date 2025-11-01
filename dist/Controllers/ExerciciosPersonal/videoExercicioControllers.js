"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerVideo = require('../../config/multerVideo'); var _multerVideo2 = _interopRequireDefault(_multerVideo);
var _videoExercicio = require('../../Models/videoExercicio'); var _videoExercicio2 = _interopRequireDefault(_videoExercicio);
var _ExercicioPersonal = require('../../Models/ExercicioPersonal'); var _ExercicioPersonal2 = _interopRequireDefault(_ExercicioPersonal);

const upload = _multer2.default.call(void 0, _multerVideo2.default).single('video');

class videoControllers {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        console.log(err)
        return res.status(400).json({ error: 'Erro ao carregar video' });
      }

      const { originalname, filename } = req.file;
      const { exercicio_personal_id } = req.body;

      console.log(exercicio_personal_id)

      const exercicioPersonal = await _ExercicioPersonal2.default.findByPk(exercicio_personal_id);

      console.log(exercicioPersonal)

      if (!exercicioPersonal) {
        return res.status(400).json({
          errors: ['exercicio personal não encontrado'],
        });
      }

      const video = await _videoExercicio2.default.create({ originalname, filename, exercicio_personal_id });

      return res.json(video);
    });
  }
}

exports. default = new videoControllers();
