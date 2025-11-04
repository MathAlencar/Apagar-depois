import jwt from 'jsonwebtoken';
import Alunos from '../../Models/Alunos';

class TokenControllersPersonal {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errors: ['Credenciais inválidas'],
        });
      }

      const user = await Alunos.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          errors: ['Credenciais inválidas'],
        });
      }

      if (!(await user.passwordIsValida(password))) {
        return res.status(400).json({
          errors: ['Usuário inválido'],
        });
      }

      const { id } = user;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET_USER, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.status(200).json({ token, id });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new TokenControllersPersonal();
