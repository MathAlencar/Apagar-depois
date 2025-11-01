"use strict";'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itemExercicio', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sessao_treino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SessaoTreino',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ao ser apagado o aluno, ele irá apagar todas as fotos enviadas.
        onUpdate: 'CASCADE', // Caso o ID da tabela alunos for alterado, ele irá atualizar a relação com o novo ID do usuário, sendo assim essa validação.
      },
      exercicio_personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ExercicioPersonal',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ao ser apagado o aluno, ele irá apagar todas as fotos enviadas.
        onUpdate: 'CASCADE', // Caso o ID da tabela alunos for alterado, ele irá atualizar a relação com o novo ID do usuário, sendo assim essa validação.
      },
      ordem: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      series: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      repeticoes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tempo_descanso_segundos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      observacoes: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('itemExercicio');
  }
};
