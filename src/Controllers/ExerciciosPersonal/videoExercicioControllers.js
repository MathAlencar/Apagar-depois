import multer from 'multer';
import multerConfig from '../../config/multerVideo';
import videoExercicio from '../../Models/videoExercicio';
import ExercicioPersonal from '../../Models/ExercicioPersonal';

const upload = multer(multerConfig).single('video');

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

      const exercicioPersonal = await ExercicioPersonal.findByPk(exercicio_personal_id);

      console.log(exercicioPersonal)

      if (!exercicioPersonal) {
        return res.status(400).json({
          errors: ['exercicio personal não encontrado'],
        });
      }

      const video = await videoExercicio.create({ originalname, filename, exercicio_personal_id });

      return res.json(video);
    });
  }
}

export default new videoControllers();
