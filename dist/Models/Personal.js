"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

 class Personal extends _sequelize.Model {
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
      descricao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo descricao deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      formacao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo formacao deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      experiencia: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo experiencia deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      cidade: {
        defaultValue: '',
        validate: {
          len: {
            args: [2, 255],
            msg: 'Campo cidade deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      profissao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo profissao deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      areaAtuacao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo Area de atuação deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      modeloAtendimento: {
        type: _sequelize2.default.ENUM('presencial', 'online'),
        defaultValue: 'presencial', // opcional: defina o valor padrão que desejar
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
      tableName: 'personal',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await _bcrypt2.default.hash(usuario.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.PersonalFoto, { foreignKey: 'personal_id' });
    this.hasOne(models.Enderecos, { foreignKey: 'personal_id' });
    this.hasMany(models.PersonalAgenda, { foreignKey: 'personal_id' });
    this.hasMany(models.AulaAgenda, { foreignKey: 'personal_id' });
    this.hasMany(models.ExercicioPersonal, { foreignKey: 'personal_id' });
    this.hasMany(models.planoTreino, { foreignKey: 'personal_id' });
  }

  // Relações com outras tabelas;
  // Relação com a tabela de alunos -> muitos para muitos
  // Relação com a tabela de foto -> um personal para muitas fotos;
  // Relação com a tabela de espercialização -> muitos para muitos;
  // Relação com a tabela de calendário_inativo -> um personal para muitas linhas de inatividade (caso linha adicionada estiver em uma data inválida, não autorizar);

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = Personal;
