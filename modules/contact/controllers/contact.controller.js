const { Controller } = require("#app/controllers/controller.controller");
const { th } = require("date-fns/locale");
const { Contact } = require("../models/contact.model");
/**
 * @class ContactController
 *
 */
class ContactController {
  /**
   * List of all contacts
   * @param {*} req
   * @param {*} res
   * @returns views
   */
  static async Index(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const contacts = await Contact.All();
      return res.render("contact/index", {
        contacts,
        queryData,
      });
    } catch (error) {
      console.log(error);
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Update an contact
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async GetContact(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const contact = await Contact.FindById(paramsData._contact);
      if (!contact) {
        return Controller.errorHandler(
          {
            message: "Contact not found",
          },
          req,
          res,
          404
        );
      }
      return Controller.successHandler(
        {
          contact,
        },
        res,
        "Contact found",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Create a new contact
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async CreateContact(req, res) {
    const { bodyData } = Controller.matchedData(req);
    try {
      
      const contact = await Contact.Create(bodyData);
      return Controller.successHandler(
        {
          contact,
        },
        res,
        "Contact created",
        201
      );
    } catch (error) {
      Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Datatable for contacts
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async ajaxDatatable(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const contacts = await Contact.DataTable(queryData);
      return res.json(contacts);
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  static async Contact (req, res) {
    try {
      return res.render('contact/web', {});
    } catch (error) {
      return Controller.errorHandler(error, req, res);
    }
  }

}

module.exports = {
  ContactController,
};
