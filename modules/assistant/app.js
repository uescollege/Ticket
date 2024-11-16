const { Router } = require("express");
const router = Router();

router.use('/dashboard/assistants', require('./routes'));

module.exports = router;
