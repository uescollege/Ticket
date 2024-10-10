const { Router } = require("express");
const router = Router();

router.use('/panel', require('./routes'));

module.exports = router;
