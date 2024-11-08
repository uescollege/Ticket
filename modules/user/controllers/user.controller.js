const { Controller } = require("#app/controllers/controller.controller");
const { User } = require("../models/user.model");
const fs = require("path");
const bcrypt = require("bcrypt");


/**
 * @class UserController
 *
 */
class UserController {
  /**
   * List of all users
   * @param {*} req
   * @param {*} res
   * @returns views
   */
  static async Index(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const users = await User.All();
      return res.render("user/index", {
        users,
        queryData,
      });
    } catch (error) {
      console.log(error);
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Update an user
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async GetUser(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const user = await User.FindById(paramsData._user);
      if (!user) {
        return Controller.errorHandler(
          {
            message: "User not found",
          },
          req,
          res,
          404
        );
      }
      return Controller.successHandler(
        {
          user,
        },
        res,
        "User found",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  static async RenderEditUser(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const user = await User.FindById(paramsData._user);
      if (!user) {
        return Controller.errorHandler(
          {
            message: "User not found",
          },
          req,
          res,
          404
        );
      }
      return res.render("user/edit", {
        user,
      });
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Create a new user
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async CreateUser(req, res) {
    const { bodyData } = Controller.matchedData(req);
    const file = req.file;
    try {
      if (bodyData) {
        bodyData.avatar = file ? file.filename : "";
      }

      if (bodyData.password !== bodyData.password_confirmation) {
        throw new Error("Password confirmation does not match");
      }
      delete bodyData.password_confirmation;
      const userExists = await User.FindByEmail(bodyData.email);
      if (userExists) {
        res.status(409);
        throw new Error("User already exists");
      }
      
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
      if(file && fs.existsSync(file.path))
      {
        fs.unlinkSync(file.path);
      }
      Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Update an user
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async UpdateUser(req, res) {
    const { paramsData, bodyData } = Controller.matchedData(req);
    const file = req.file;
    try {
      const user = await User.FindById(paramsData._user);
      if (!user) {
        throw new Error("User not found");
      }

      const userExists = await User.FindByEmail(bodyData.email);
      if (userExists && userExists.id !== user.id) {
        res.status(409);
        throw new Error("User already exists");
      }

      const data = {
        name: bodyData.name,
        email: bodyData.email,
      }
      console.log(file);
      if (file) {
        data.avatar = file.filename;
      }

      const updated = await User.Update(paramsData._user, data);
      if (!updated) {
        throw new Error("User not updated");
      }

      return Controller.successHandler(
        {
          user: {
            ...user,
            ...bodyData,
          },
        },
        res,
        "User updated",
        200
      );
    } catch (error) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Delete an user
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async DeleteUser(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const user = await User.FindById(paramsData._user);
      if (!user) {
        return Controller.errorHandler(
          {
            message: "User not found",
          },
          req,
          res,
          404
        );
      }

      await User.Delete(paramsData._user);

      return Controller.successHandler(
        {
          user,
        },
        res,
        "User deleted",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Datatable for users
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async ajaxDatatable(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const users = await User.DataTable(queryData);
      return res.json(users);
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  static async ChangePassword(req, res) {
    const { paramsData, bodyData } = Controller.matchedData(req);

    try {
      const user = await User.FindById(paramsData._user);
      if (!user) {
        return Controller.errorHandler(
          {
            message: "User not found",
          },
          req,
          res,
          404
        );
      }

      if (bodyData.password !== bodyData.password_confirmation) {
        throw new Error("Password confirmation does not match");
      }

      const hashedPassword = await bcrypt.hash(bodyData.password, 10);
      const updated = await User.Update(paramsData._user, { password: hashedPassword });

      if (!updated) {
        throw new Error("Password not updated");
      }

      return Controller.successHandler(
        {
          user: {
            ...user,
            password: hashedPassword,
          },
        },
        res,
        "Password updated",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res, false);
    }
  }
}

module.exports = {
  UserController,
};
