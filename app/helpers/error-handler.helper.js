const logger = require("./logger.helper");

/**
 * Funcion para manejar los errores
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {boolean} view
 * @returns  
 */
function errorHandler(error, req, res, view = true) {
  logger.error("Error: ", error);

  if (view) {
    return res.render('errors/error', {
      name: error.name,
      message: error.message,
      statusCode: res.statusCode,
    });

  } else {
    res.statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    return res.json({
      ok: false,
      msg: error.message,
    });
  }

}

module.exports = errorHandler