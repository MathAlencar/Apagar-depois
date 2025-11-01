import ExercicioPersonal from '../../Models/ExercicioPersonal';
import videoExercicio from '../../Models/videoExercicio';

class ExercicioControllers {

  async store(req, res) {
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const { nome, grupo_muscular, descricao } = req.body;

      const body = {
        personal_id: req.userID,
        nome,
        grupo_muscular,
        descricao
      }

      const newExercicio = await ExercicioPersonal.create(body);

      return res.status(200).json(newExercicio);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async index(req,res){
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const options = {
        order: [['id', 'DESC']],
        include: [
          {
            model: videoExercicio,
            attributes: ['url', 'filename'],
            order: [['id', 'DESC']],
          }
        ]
      };

      const result = await ExercicioPersonal.findAll({
        where: {
          personal_id: req.userID
        },
        ...options
      })

      return res.status(200).json({
        result
      })

    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }

  }

  async update(req, res) {
    try {

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const exercicio = await ExercicioPersonal.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!exercicio) {
        return res.status(400).json({
          errors: ['Exercicio não encontrado'],
        });
      }
      
      const newExercicio = await exercicio.update(req.body);

      return res.status(200).json(newExercicio);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const exercicio = await ExercicioPersonal.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!exercicio) {
        return res.status(400).json({
          errors: ['Exercicio não encontrado'],
        });
      }
      
      await exercicio.destroy();

      return res.status(200).json({
        message: ['Excluido com sucesso!']
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

}

export default new ExercicioControllers();
