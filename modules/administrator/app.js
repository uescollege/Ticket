const { Router } = require("express");
const router = Router();

router.use('/dashboard/administrators', require('./routes'));

module.exports = router;
