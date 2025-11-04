import SessaoTreino from "../../Models/sessaoTreino";

class SessaoTreinoControllers {

  async store(req, res) {
    try {

      const {identificador, titulo, ordem} = req.body;

      const body = {
        plano_treino_id: req.params.id,
        identificador,
        titulo,
        ordem
      }

      const newSessaoTreino = await SessaoTreino.create(body);

      return res.status(200).json(newSessaoTreino);
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

      const sessaoTreino = await SessaoTreino.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!sessaoTreino) {
        return res.status(400).json({
          errors: ['Sessão não encontrada'],
        });
      }

      const newSessaoTreino = await sessaoTreino.update(req.body);

      return res.status(200).json(newSessaoTreino);
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

      const sessaoTreino = await SessaoTreino.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!sessaoTreino) {
        return res.status(400).json({
          errors: ['sessão não encontrado'],
        });
      }

      await sessaoTreino.destroy();

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

export default new SessaoTreinoControllers();
