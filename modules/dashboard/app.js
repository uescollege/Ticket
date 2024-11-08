const { Router } = require("express");
const router = Router();

router.use('/dashboard', require('./routes'));

module.exports = router;
