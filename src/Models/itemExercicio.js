import Sequelize, { Model } from 'sequelize';

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

export default class itemExercicio extends Model {
  static init(sequelize) {
    super.init({
      sessao_treino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exercicio_personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ordem: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      series: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      repeticoes: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 312],
            msg: 'Campo nome deve ter entre 3 a 312 caracteres',
          },
        },
      },
      tempo_descanso_segundos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      observacoes: {
        type: Sequelize.STRING,
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

}
