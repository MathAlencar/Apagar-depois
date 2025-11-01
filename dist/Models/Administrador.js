"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

 class Administrador extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
      },
      email: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: {
          isEmail: {
            msg: 'Campo e-mail inválido',
          },
        },
      },
      password_hash: {
        type: _sequelize2.default.INTEGER,
        defaultValue: '',
      },
      password: {
        type: _sequelize2.default.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Campo senha deve ter entre 6 a 50 caracteres',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'administrador',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await _bcrypt2.default.hash(usuario.password, 8);
      }
    });

    return this;
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = Administrador;
