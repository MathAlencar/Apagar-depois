"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personal', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profissao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      formacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      experiencia: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      areaAtuacao: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'areaAtuacao',
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modeloAtendimento: {
        type: Sequelize.ENUM('presencial', 'online'),
        defaultValue: 'presencial',
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('personal');
  },
};
