"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multer3 = require('../../config/multer'); var _multer4 = _interopRequireDefault(_multer3);
var _FotoAlunos = require('../../Models/FotoAlunos'); var _FotoAlunos2 = _interopRequireDefault(_FotoAlunos);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);

const upload = _multer2.default.call(void 0, _multer4.default).single('foto');

class FotoControllers {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar foto' });
      }

      const { originalname, filename } = req.file;
      const { aluno_id } = req.body;

      const aluno = await _Alunos2.default.findByPk(aluno_id);

      if (!aluno) {
        return res.status(400).json({
          errors: ['aluno não encontrado'],
        });
      }

      const foto = await _FotoAlunos2.default.create({ originalname, filename, aluno_id });

      return res.json(foto);
    });
  }
}

exports. default = new FotoControllers();
