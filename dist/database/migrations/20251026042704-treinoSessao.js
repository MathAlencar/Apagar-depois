"use strict";'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SessaoTreino', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      plano_treino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'planoTreino',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ao ser apagado o aluno, ele irá apagar todas as fotos enviadas.
        onUpdate: 'CASCADE', // Caso o ID da tabela alunos for alterado, ele irá atualizar a relação com o novo ID do usuário, sendo assim essa validação.
      },
      identificador: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ordem: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    await queryInterface.dropTable('SessaoTreino');
  }
};
