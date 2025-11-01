"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize');

 class Mensagem extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      remetente_id: _sequelize.DataTypes.INTEGER,
      tipo_remetente: _sequelize.DataTypes.ENUM('aluno', 'personal'),
      conteudo: _sequelize.DataTypes.TEXT,
    }, {
      sequelize,
      tableName: 'mensagens',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Conversa, { foreignKey: 'conversa_id' });
  }
} exports.default = Mensagem;
