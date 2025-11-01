"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class AulaAgenda extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      date_init: {
        type: _sequelize2.default.DATE,
        allowNull: false,
      },
      date_end: {
        type: {
          type: _sequelize2.default.DATE,
          allowNull: false,
        },
      },
      endereco: {
        type: _sequelize2.default.STRING,
        allowNull: false,
        validade: {
          len: {
            args: [3, 255],
            msg: 'O endereço informado é inválido',
          },
        },
      },
      status: {
        type: _sequelize2.default.ENUM('pendente', 'aceita', 'recusada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendente',
        validate: {
          isIn: {
            args: [['pendente', 'aceita', 'recusada', 'cancelada']],
            msg: 'Status inválido. Use: pendente, aceita, recusada ou cancelada.',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'aulas',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
  }
} exports.default = AulaAgenda;
