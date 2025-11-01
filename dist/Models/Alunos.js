"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

 class Alunos extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      nome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      email: {
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: {
          isEmail: {
            msg: 'Campo e-mail inválido!',
          },
        },
        type: _sequelize2.default.STRING,
      },
      dateNascimento: {
        type: _sequelize2.default.DATE,
        allowNull: false,
      },
      genero: {
        defaultValue: 'Outro',
        type: _sequelize2.default.ENUM('Masculino', 'Feminino', 'Outro'),
      },
      celular: {
        type: _sequelize2.default.STRING,
        allowNull: false,
      },
      altura: {
        type: _sequelize2.default.DECIMAL,
        allowNull: false,
      },
      peso: {
        type: _sequelize2.default.DECIMAL,
        allowNull: false,
      },
      condicaoMedica: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 560],
            msg: 'Campo Condição médica deve ter entre 3 a 560 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      historicoLesao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 560],
            msg: 'Campo historico de lesão deve ter entre 3 a 560 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      nivelAtividade: {
        type: _sequelize2.default.ENUM('Sedentário', 'Moderado', 'Ativo'),
        allowNull: false,
      },
      objetivo: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo Condição médica deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: _sequelize2.default.STRING,
      },
      password: {
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Informe uma senha entre 6 a 50 caracteres',
          },
        },
        type: _sequelize2.default.VIRTUAL,
      },
    }, {
      sequelize,
      tableName: 'alunos',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await _bcrypt2.default.hash(usuario.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.AlunoFoto, { foreignKey: 'aluno_id' });
    this.hasMany(models.AulaAgenda, { foreignKey: 'aluno_id' });
    this.hasMany(models.planoTreino, { foreignKey: 'aluno_id' });
    this.hasOne(models.Enderecos, { foreignKey: 'aluno_id' });
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = Alunos;
