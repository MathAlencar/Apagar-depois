import jwt from 'jsonwebtoken';
import Administrador from '../Models/Administrador.js';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      errors: ['login riquered'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET_ADMIN);
    const { id, email } = dados;

    const user = Administrador.findOne({
      where: {
        id,
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        errors: ['Login riquered'],
      });
    }

    req.userId = id;
    req.userEmail = email;

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
