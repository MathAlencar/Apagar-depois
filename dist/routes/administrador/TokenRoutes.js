"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _adminTokenControllers = require('../../Controllers/admin/adminTokenControllers'); var _adminTokenControllers2 = _interopRequireDefault(_adminTokenControllers);

const router = _express.Router.call(void 0, );

router.post('/', _adminTokenControllers2.default.store);

exports. default = router;
