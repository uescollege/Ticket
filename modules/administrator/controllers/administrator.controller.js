const { Controller } = require("#app/controllers/controller.controller");
const { Administrator } = require("../models/administrator.model");
/**
 * @class AdministratorController
 * 
 */
class AdministratorController {

  /**
   * List of all administrators
   * @param {*} req
   * @param {*} res
   * @returns views
   */
  static async Index(req, res) {
    const {queryData} = Controller.matchedData(req);
    try {
      const administrators = await Administrator.All();
      return res.render('administrator/index', {
        administrators,
        queryData
      });
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Create a new administrator
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async CreateAdmin(req, res) {
    const {bodyData} = Controller.matchedData(req);
    const file = req.file;
    try {

      if (bodyData) {
        bodyData.avatar = file ? file.filename : "";
      }
      delete bodyData.password_confirmation

      const administrator = await Administrator.Create(bodyData);
      return Controller.successHandler({
        administrator
      }, res, "Administrator created", 201);
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Delete an administrator
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async DeleteAdmin(req, res) {
    const {paramsData} = Controller.matchedData(req);
    try {
      const administrator = await Administrator.FindById(paramsData._administrator);
      if (!administrator) {
        return Controller.errorHandler({
          message: "Administrator not found"
        }, req, res, 404);
      }

      await Administrator.Delete(paramsData._administrator);

      return Controller.successHandler({
        administrator
      }, res, "Administrator deleted", 200);
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

}

module.exports = {
  AdministratorController
}