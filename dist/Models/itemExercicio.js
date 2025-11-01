"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

 class itemExercicio extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      sessao_treino_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      exercicio_personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      ordem: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      series: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      repeticoes: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 312],
            msg: 'Campo nome deve ter entre 3 a 312 caracteres',
          },
        },
      },
      tempo_descanso_segundos: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      observacoes: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 512],
            msg: 'Campo nome deve ter entre 3 a 512 caracteres',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'itemExercicio',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.SessaoTreino, { foreignKey: 'sessao_treino_id' });
    this.belongsTo(models.ExercicioPersonal, { foreignKey: 'exercicio_personal_id'});
  }

} exports.default = itemExercicio;
