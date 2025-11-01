'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExercicioPersonal', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grupo_muscular: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ExercicioPersonal');
  }
};
