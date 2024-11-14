const { Router } = require('express');
const router = Router();
const { DashboardController } = require('../controllers/dashboard.controller');

router.get('/', DashboardController.Panel);

module.exports = router;
