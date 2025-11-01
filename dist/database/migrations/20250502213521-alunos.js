"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alunos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      dateNascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      genero: {
        type: Sequelize.ENUM('Masculino', 'Feminino', 'Outro'),
        defaultValue: 'Outro',
        allowNull: false,
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      altura: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      peso: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      condicaoMedica: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      historicoLesao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nivelAtividade: {
        type: Sequelize.ENUM('Sedentário', 'Moderado', 'Ativo'),
        allowNull: false,
      },
      objetivo: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('alunos');
  },
};
