const { Router } = require("express");
const router = Router();
const {
  ContactController
} = require("../controllers/contact.controller");
const { param, body, query } = require("express-validator");
const { EVResult } = require("#app/middlewares/ev-result.middleware");

router.get("/", ContactController.Index);

router.get('/datatable',
  query('draw').isInt().withMessage('Draw must be an integer'),
  query('start').isInt().withMessage('Start must be an integer'),
  query('length').isInt().withMessage('Length must be an integer'),
  query('search'),
  query('order'),
  query('columns'),
  EVResult, ContactController.ajaxDatatable);


router.get(
  "/:_contact",
  param("_contact").isInt().withMessage("Id must be an integer"),
  EVResult,
  ContactController.GetContact
);


module.exports = router;
