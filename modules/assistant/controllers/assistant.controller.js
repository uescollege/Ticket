const { Controller } = require("#app/controllers/controller.controller");
const { th } = require("date-fns/locale");
const { Assistant } = require("../models/assistant.model");
/**
 * @class AssistantController
 *
 */
class AssistantController {
  /**
   * List of all assistants
   * @param {*} req
   * @param {*} res
   * @returns views
   */
  static async Index(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const assistants = await Assistant.All();
      return res.render("assistant/index", {
        assistants,
        queryData,
      });
    } catch (error) {
      console.log(error);
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Update an assistant
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async GetAssistant(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const assistant = await Assistant.FindById(paramsData._assistant);
      if (!assistant) {
        return Controller.errorHandler(
          {
            message: "Assistant not found",
          },
          req,
          res,
          404
        );
      }
      return Controller.successHandler(
        {
          assistant,
        },
        res,
        "Assistant found",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Create a new assistant
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async CreateAssistant(req, res) {
    const { bodyData } = Controller.matchedData(req);
    try {
      
      const assistantExists = await Assistant.FindByEmail(bodyData.email);
      if (assistantExists) {
        res.status(409);
        throw new Error("Assistant already exists");
      }
      
      const assistant = await Assistant.Create(bodyData);
      return Controller.successHandler(
        {
          assistant,
        },
        res,
        "Assistant created",
        201
      );
    } catch (error) {
      Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Update an assistant
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async UpdateAssistant(req, res) {
    const { paramsData, bodyData } = Controller.matchedData(req);
    try {
      const assistant = await Assistant.FindById(paramsData._assistant);
      if (!assistant) {
        throw new Error("Assistant not found");
      }

      const assistantExists = await Assistant.FindByEmail(bodyData.edit_email);
      if (assistantExists && assistantExists.id !== assistant.id) {
        res.status(409);
        throw new Error("Assistant already exists");
      }

      const data = {
        name: bodyData.edit_name,
        email: bodyData.edit_email,
      }

      const updated = await Assistant.Update(paramsData._assistant, data);
      if (!updated) {
        throw new Error("Assistant not updated");
      }

      return Controller.successHandler(
        {
          assistant: {
            ...assistant,
            ...bodyData,
          },
        },
        res,
        "Assistant updated",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res, false);
    }
  }

  /**
   * Delete an assistant
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async DeleteAssistant(req, res) {
    const { paramsData } = Controller.matchedData(req);
    try {
      const assistant = await Assistant.FindById(paramsData._assistant);
      if (!assistant) {
        return Controller.errorHandler(
          {
            message: "Assistant not found",
          },
          req,
          res,
          404
        );
      }

      await Assistant.Delete(paramsData._assistant);

      return Controller.successHandler(
        {
          assistant,
        },
        res,
        "Assistant deleted",
        200
      );
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }

  /**
   * Datatable for assistants
   * @param {*} req
   * @param {*} res
   * @returns response
   */
  static async ajaxDatatable(req, res) {
    const { queryData } = Controller.matchedData(req);
    try {
      const assistants = await Assistant.DataTable(queryData);
      return res.json(assistants);
    } catch (error) {
      Controller.errorHandler(error, req, res);
    }
  }
}

module.exports = {
  AssistantController,
};
