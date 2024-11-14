const { Controller } = require('#app/controllers/controller.controller');

/**
 * @class EventsController
 *
 */
class EventsController {
  /**
   * @description events
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async eventsView (req, res) {
    try {
      return res.render('events/event', {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }
}

module.exports = {
  EventsController
};
