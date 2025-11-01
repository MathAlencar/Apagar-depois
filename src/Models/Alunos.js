import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Alunos extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      email: {
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: {
          isEmail: {
            msg: 'Campo e-mail inválido!',
          },
        },
        type: Sequelize.STRING,
      },
      dateNascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      genero: {
        defaultValue: 'Outro',
        type: Sequelize.ENUM('Masculino', 'Feminino', 'Outro'),
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
        defaultValue: '',
        validate: {
          len: {
            args: [3, 560],
            msg: 'Campo Condição médica deve ter entre 3 a 560 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      historicoLesao: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 560],
            msg: 'Campo historico de lesão deve ter entre 3 a 560 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      nivelAtividade: {
        type: Sequelize.ENUM('Sedentário', 'Moderado', 'Ativo'),
        allowNull: false,
      },
      objetivo: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo Condição médica deve ter entre 3 a 255 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: Sequelize.STRING,
      },
      password: {
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Informe uma senha entre 6 a 50 caracteres',
          },
        },
        type: Sequelize.VIRTUAL,
      },
    }, {
      sequelize,
      tableName: 'alunos',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.AlunoFoto, { foreignKey: 'aluno_id' });
    this.hasMany(models.AulaAgenda, { foreignKey: 'aluno_id' });
    this.hasMany(models.planoTreino, { foreignKey: 'aluno_id' });
    this.hasOne(models.Enderecos, { foreignKey: 'aluno_id' });
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
