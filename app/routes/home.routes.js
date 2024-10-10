const { Router } = require("express");
const router = Router();

const { HomeController } = require("#app/controllers/home.controller");

router.get("/", HomeController.Home);

module.exports = router;
