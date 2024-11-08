const { Router } = require("express");
const router = Router();

router.use('/dashboard/users', require('./routes'));

module.exports = router;
