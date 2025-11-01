"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _personalTokenControllers = require('../../Controllers/personal/personalTokenControllers'); var _personalTokenControllers2 = _interopRequireDefault(_personalTokenControllers);

const router = _express.Router.call(void 0, );

router.post('/', _personalTokenControllers2.default.store);

exports. default = router;
