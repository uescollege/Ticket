const { Router } = require('express');
const router = Router();

router.use('/events', require('./routes'));

module.exports = router;
