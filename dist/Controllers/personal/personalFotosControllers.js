"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multer3 = require('../../config/multer'); var _multer4 = _interopRequireDefault(_multer3);
var _FotoPersonal = require('../../Models/FotoPersonal'); var _FotoPersonal2 = _interopRequireDefault(_FotoPersonal);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);

const upload = _multer2.default.call(void 0, _multer4.default).single('foto');

class FotoControllers {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar foto' });
      }

      const { originalname, filename } = req.file;
      const { personal_id } = req.body;

      const personal = await _Personal2.default.findByPk(personal_id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Personal não encontrado'],
        });
      }

      const foto = await _FotoPersonal2.default.create({ originalname, filename, personal_id });

      return res.json(foto);
    });
  }
}

exports. default = new FotoControllers();
