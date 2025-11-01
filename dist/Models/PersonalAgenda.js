"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class PersonalAgenda extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      title: {
        type: _sequelize2.default.STRING,
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
        type: _sequelize2.default.DATE,
      },
      date_end: {
        defaultValue: null,
        type: _sequelize2.default.DATE,
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
} exports.default = PersonalAgenda;
