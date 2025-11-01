"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _personalControllers = require('../../Controllers/personal/personalControllers'); var _personalControllers2 = _interopRequireDefault(_personalControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const router = _express.Router.call(void 0, );

router.post('/', _personalControllers2.default.store);
router.get('/', _personalControllers2.default.index);
router.get('/:id', _personalControllers2.default.show);
router.put('/:id?', _personalLoginRiquered2.default, _personalControllers2.default.update);

exports. default = router;
