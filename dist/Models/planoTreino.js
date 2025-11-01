"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

 class planoTreino extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      personal_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      aluno_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      data_inicio: {
        defaultValue: null,
        type: _sequelize2.default.DATE,
      },
      data_fim: {
        defaultValue: null,
        type: _sequelize2.default.DATE,
      },
      nome: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
      },
      status: {
        type: _sequelize2.default.ENUM('Ativo', 'Concluido', 'Futuro'),
        allowNull: false,
        defaultValue: 'Ativo',
        validate: {
          isIn: {
            args: [['Ativo', 'Concluido', 'Futuro']],
            msg: 'Status deve ser "ativo", "concluido" ou "futuro".',
          },
        },
      },
      observacoes_gerais: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [20, 5000],
            msg: 'Campo nome descrição ter entre 20 a 5000 caracteres',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'planoTreino',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
    this.hasMany(models.SessaoTreino, { foreignKey: 'plano_treino_id' });
  }
} exports.default = planoTreino;
