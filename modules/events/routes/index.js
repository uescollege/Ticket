const { Router } = require('express');
const router = Router();
const { EventsController } = require('../controllers/events.controller');

router.get('/', EventsController.eventsView);

module.exports = router;
