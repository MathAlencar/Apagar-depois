"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _personalAgendaControllers = require('../../Controllers/personal/personalAgendaControllers'); var _personalAgendaControllers2 = _interopRequireDefault(_personalAgendaControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const router = _express.Router.call(void 0, );

router.post('/', _personalLoginRiquered2.default, _personalAgendaControllers2.default.store);
router.delete('/:id', _personalLoginRiquered2.default, _personalAgendaControllers2.default.delete);

exports. default = router;
