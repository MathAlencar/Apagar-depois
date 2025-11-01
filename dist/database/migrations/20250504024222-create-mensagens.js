"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mensagens', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      conversa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conversas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      remetente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_remetente: {
        type: Sequelize.ENUM('aluno', 'personal'),
        allowNull: false,
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mensagens');
  },
};
