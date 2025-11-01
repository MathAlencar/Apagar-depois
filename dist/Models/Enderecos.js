"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Enderecos extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: true,
      },
      personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: true,
      },
      rua: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Rua informada inválida'],
          },
        },
      },
      numero: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Rua informada inválida'],
          },
        },
      },
      complemento: {
        type: _sequelize2.default.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [2, 255],
            msg: ['Complemento informada inválida'],
          },
        },
      },
      bairro: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Bairro informada inválida'],
          },
        },
      },
      cidade: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Cidade informada inválida'],
          },
        },
      },
      estado: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Estado informada inválida'],
          },
        },
      },
      cep: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [9, 9],
            msg: ['Cep informado inválida'],
          },
        },
      },
    }, {
      sequelize,
      tableName: 'enderecos',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
  }
} exports.default = Enderecos;
