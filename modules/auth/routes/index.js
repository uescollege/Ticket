const { Router } = require("express");
const router = Router();

router.use(require("./auth.routes"));

module.exports = router;
