const { Controller } = require("#app/controllers/controller.controller");

/**
 * @class HomeController
 * 
 */
class HomeController {

  /**
   * @description Home
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async Home (req, res) {
    try {
      return res.render('home', {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

}

module.exports = {
  HomeController
}