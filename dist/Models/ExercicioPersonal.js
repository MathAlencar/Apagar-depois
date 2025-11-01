"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

 class ExercicioPersonal extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
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
      grupo_muscular: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo grupo muscular deve ter entre 20 a 5000 caracteres',
          },
        },
      },
      descricao: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [20, 5000],
            msg: 'Campo nome descrição ter entre 20 a 5000 caracteres',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'ExercicioPersonal',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.hasMany(models.videoExercicio, { foreignKey: 'exercicio_personal_id' });
    this.belongsToMany(models.SessaoTreino, {
      through: models.itemExercicio,
      foreignKey: 'exercicio_personal_id',
      otherKey: 'sessao_treino_id',
      as: 'sessoes',
    });
  }
  
} exports.default = ExercicioPersonal;
