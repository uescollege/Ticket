const { Controller } = require("#app/controllers/controller.controller");

/**
 * @class DashboardController
 * 
 */
class DashboardController {

  /**
   * @description Panel
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async Panel (req, res) {
    try {
      return res.render('panel/home', {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

}

module.exports = {
  DashboardController
}