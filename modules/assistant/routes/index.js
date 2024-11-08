const { Router } = require("express");
const router = Router();
const {
  AssistantController
} = require("../controllers/assistant.controller");
const {avatarUpload} = require('#app/middlewares/multer.middleware');
const { param, body, query } = require("express-validator");
const { EVResult } = require("#app/middlewares/ev-result.middleware");

router.get("/", AssistantController.Index);

router.get('/datatable',
  query('draw').isInt().withMessage('Draw must be an integer'),
  query('start').isInt().withMessage('Start must be an integer'),
  query('length').isInt().withMessage('Length must be an integer'),
  query('search'),
  query('order'),
  query('columns'),
  EVResult, AssistantController.ajaxDatatable);

router.post(
  "/",
  avatarUpload.single("avatar"),
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("email").isEmail(),
  EVResult,
  AssistantController.CreateAssistant
);

router.delete(
  "/:_assistant",
  param("_assistant").isInt().withMessage("Id must be an integer"),
  EVResult,
  AssistantController.DeleteAssistant
);

router.put(
  "/:_assistant",
  avatarUpload.single("avatar"),
  param("_assistant").isInt().withMessage("Id must be an integer"),
  body("edit_name").isString().isLength({ min: 3, max: 255 }),
  body("edit_email").isEmail(),
  EVResult,
  AssistantController.UpdateAssistant
);

router.get(
  "/:_assistant",
  param("_assistant").isInt().withMessage("Id must be an integer"),
  EVResult,
  AssistantController.GetAssistant
);


module.exports = router;
