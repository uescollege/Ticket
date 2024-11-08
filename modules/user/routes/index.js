const { Router } = require("express");
const router = Router();
const {
  UserController
} = require("../controllers/user.controller");
const {avatarUpload} = require('#app/middlewares/multer.middleware');
const { param, body, query } = require("express-validator");
const { EVResult } = require("#app/middlewares/ev-result.middleware");

router.get("/", UserController.Index);

router.get('/datatable',
  query('draw').isInt().withMessage('Draw must be an integer'),
  query('start').isInt().withMessage('Start must be an integer'),
  query('length').isInt().withMessage('Length must be an integer'),
  query('search'),
  query('order'),
  query('columns'),
  EVResult, UserController.ajaxDatatable);

router.post(
  "/",
  avatarUpload.single("avatar"),
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6, max: 255 }),
  body("password_confirmation").isString().isLength({ min: 6, max: 255 }),
  EVResult,
  UserController.CreateUser
);

router.delete(
  "/:_user",
  param("_user").isInt().withMessage("Id must be an integer"),
  EVResult,
  UserController.DeleteUser
);

router.put(
  "/:_user",
  avatarUpload.single("avatar"),
  param("_user").isInt().withMessage("Id must be an integer"),
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("email").isEmail(),
  EVResult,
  UserController.UpdateUser
);

router.get(
  "/:_user",
  param("_user").isInt().withMessage("Id must be an integer"),
  EVResult,
  UserController.GetUser
);

router.get(
  "/:_user/edit",
  param("_user").isInt().withMessage("Id must be an integer"),
  EVResult,
  UserController.RenderEditUser
);

router.put(
  "/:_user/change-password",
  param("_user").isInt().withMessage("Id must be an integer"),
  body("password").isString().isLength({ min: 6, max: 255 }),
  body("password_confirmation").isString().isLength({ min: 6, max: 255 }),
  EVResult,
  UserController.ChangePassword
);

module.exports = router;
