"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize');

 class Conversa extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      usuario1_id: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      tipo_usuario1: {
        type: _sequelize.DataTypes.ENUM('aluno', 'personal'),
        allowNull: false,
      },
      usuario2_id: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      tipo_usuario2: {
        type: _sequelize.DataTypes.ENUM('aluno', 'personal'),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'conversas',
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.AlunoFoto, { foreignKey: 'aluno_id' });

    this.hasMany(models.PersonalFoto, { foreignKey: 'personal_id' });

    this.belongsTo(models.Alunos, {
      foreignKey: 'usuario1_id',
      as: 'aluno_1',
      constraints: false,
    });

    this.belongsTo(models.Personal, {
      foreignKey: 'usuario2_id',
      as: 'personal_1',
      constraints: false,
    });

    this.hasMany(models.Mensagem, {
      foreignKey: 'conversa_id',
      as: 'mensagens',
    });
  }
} exports.default = Conversa;
