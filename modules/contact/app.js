const { Router } = require("express");
const router = Router();

router.use('/dashboard/contacts', require('./routes'));
router.use('/', require('./routes/web.routes'));

module.exports = router;
