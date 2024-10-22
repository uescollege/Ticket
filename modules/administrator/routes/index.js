const { Router } = require("express");
const router = Router();
const {
  AdministratorController,
} = require("../controllers/administrator.controller");
const {avatarUpload} = require('#app/middlewares/multer.middleware');
const { param, body, query } = require("express-validator");
const { EVResult } = require("#app/middlewares/ev-result.middleware");

router.get("/", AdministratorController.Index);

router.post(
  "/",
  avatarUpload.single("avatar"),
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6, max: 255 }),
  body("password_confirmation").isString().isLength({ min: 6, max: 255 }),
  EVResult,
  AdministratorController.CreateAdmin
);

module.exports = router;
