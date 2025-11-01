import Sequelize, { Model } from 'sequelize';

export default class PersonalAgenda extends Model {
  static init(sequelize) {
    super.init({
      personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 55],
            msg: ['Valor informado está fora do limite estabelecido'],
          },
        },
      },
      date_init: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
      date_end: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
    }, {
      sequelize,
      tableName: 'agenda_personal',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
  }
}
