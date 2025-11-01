"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aulas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'personal',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ao ser apagado o aluno, ele irá apagar todas as fotos enviadas.
        onUpdate: 'CASCADE', // Caso o ID da tabela alunos for alterado, ele irá atualizar a relação com o novo ID do usuário, sendo assim essa validação.
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alunos',
          key: 'id',
        },
      },
      date_init: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pendente', 'aceita', 'recusada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendente',
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
    await queryInterface.dropTable('aulas');
  },
};
