const jwt = require("jsonwebtoken");
const config = require('../config/index');
const { matchedData } = require("express-validator");
const errorHandler  = require("#app/helpers/error-handler.helper");
const successHandler  = require("#app/helpers/success-handler.helper");
class Controller {
  static successHandler = successHandler;
  static errorHandler = errorHandler
  constructor () {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  }

  static resolveToken (token) {
    // bearer
    try {
      return jwt.verify(token, SECRET);
    } catch (error) {
      return false;
    }
  }

  /**
   * retorna los datos de la peticion de express-validator
   * @param {} req 
   * @returns 
   */
  static matchedData(req) {
    const queryData = matchedData(req, {locations: ['query']});
    const bodyData = matchedData(req, {locations: ['body']});
    const paramsData = matchedData(req, {locations: ['params']});
    const headersData = matchedData(req, {locations: ['headers']});
    const cookies = matchedData(req, {locations: ['cookies']});
    return {
      queryData,
      bodyData,
      paramsData,
      headersData,
      cookies
    };
  }

}

module.exports = {
  Controller
}