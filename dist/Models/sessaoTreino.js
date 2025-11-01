"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

 class SessaoTreino extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      plano_treino_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      identificador: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
      },
      titulo: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
      },
      ordem: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'SessaoTreino',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.planoTreino, { foreignKey: 'plano_treino_id' });
    this.hasMany(models.itemExercicio, { foreignKey: 'sessao_treino_id' });
  }
} exports.default = SessaoTreino;
