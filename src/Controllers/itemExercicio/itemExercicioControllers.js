import itemExercicio from "../../Models/itemExercicio";

class ItemExercicioControllers {

  async store(req, res) {
    try {

      const {ordem, series, repeticoes, tempo_descanso_segundos, observacoes, exercicio_personal_id} = req.body;

      const body = {
        exercicio_personal_id,
        sessao_treino_id: req.params.id,
        ordem,
        series,
        repeticoes,
        tempo_descanso_segundos,
        observacoes
      }

      const newItemExercicio = await itemExercicio.create(body);

      return res.status(200).json(newItemExercicio);
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

      const ItemExercicio = await itemExercicio.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!ItemExercicio) {
        return res.status(400).json({
          errors: ['Sessão não encontrada'],
        });
      }

      const newItemExercicio = await ItemExercicio.update(req.body);

      return res.status(200).json(newItemExercicio);
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

      const ItemExercicio = await itemExercicio.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!ItemExercicio) {
        return res.status(400).json({
          errors: ['item não encontrado'],
        });
      }

      await ItemExercicio.destroy();

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

export default new ItemExercicioControllers();
