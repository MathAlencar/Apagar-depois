"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario1_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_usuario1: {
        type: Sequelize.ENUM('aluno', 'personal'),
        allowNull: false,
      },
      usuario2_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_usuario2: {
        type: Sequelize.ENUM('aluno', 'personal'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('conversas');
  },
};
