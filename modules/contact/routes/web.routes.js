const { Router } = require("express");
const router = Router();
const {
  ContactController
} = require("../controllers/contact.controller");

const { param, body, query } = require("express-validator");
const { EVResult } = require("#app/middlewares/ev-result.middleware");

router.get('/contact', ContactController.Contact);

router.post('/contact', 
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("email").isEmail(),
  body("message").isString().isLength({ min: 3, max: 255 }),
  EVResult,
  ContactController.CreateContact);

module.exports = router;
