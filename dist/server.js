"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Appjs = require('./App.js'); var _Appjs2 = _interopRequireDefault(_Appjs); // Ele já está sendo exportado e executado ao mesmo tempo.

const port = 3018;

_Appjs2.default.listen(port, () => {
  console.log(`O App está rodando nsa porta ${port}...`);
});
