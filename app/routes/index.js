const { Router } = require("express");
const router = Router();

router.use(require('./home.routes'));

module.exports = router;
