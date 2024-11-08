const { Controller } = require("#app/controllers/controller.controller");
const { Administrator } = require("../models/administrators.model");
const { User } = require("../models/users.model");
const bcrypt = require("bcrypt");

/**
 * @class AuthController
 *
 */
class AuthController {
  /**
   * Admin sign in
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async renderAdminSignIn(req, res) {
    try {
      return res.render("auth/admin-signin", {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Admin sign up
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async renderAdminSignUp(req, res) {
    try {
      return res.render("auth/admin-signup", {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Create a new admin
   * @param {*} req
   * @param {*} res
   */
  static async ajaxCreateAdmin(req, res) {
    const { bodyData } = Controller.matchedData(req);
    try {
      const exists = await Administrator.findByEmail(bodyData.email);
      if (exists) {
        return Controller.errorHandler(
          {
            message: "Email already exists",
          },
          req,
          res,
          false
        );
      }

      delete bodyData.password_confirmation;

      bodyData.password = await bcrypt.hash(bodyData.password, 10);

      const admin = await Administrator.Create(bodyData);

      return Controller.successHandler(
        {
          admin,
        },
        res,
        "Administrator created",
        201
      );
    } catch (error) {
      return Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * User sign in
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async renderUserSignIn(req, res) {
    try {
      return res.render("auth/user-signin", {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

  /**
   * User sign up
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async renderUserSignUp(req, res) {
    try {
      return res.render("auth/user-signup", {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

  static async ajaxCreateUser(req, res) {
    const { bodyData } = Controller.matchedData(req);
    try {
      const exists = await User.findByEmail(bodyData.email);
      if (exists) {
        return Controller.errorHandler(
          {
            message: "Email already exists",
          },
          req,
          res,
          false
        );
      }

      delete bodyData.password_confirmation;

      bodyData.password = await bcrypt.hash(bodyData.password, 10);

      const user = await User.Create(bodyData);

      return Controller.successHandler(
        {
          user,
        },
        res,
        "User created",
        201
      );
    } catch (error) {
      return Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Logout
   * @param {*} req
   * @param {*} res
   */
  static async logout(req, res) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
}

module.exports = {
  AuthController,
};
