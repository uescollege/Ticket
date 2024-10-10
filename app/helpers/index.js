const logger = require("./logger.helper");
const slugify = require("./slugify.helper");
const SendEmail = require("./email.helper");
const existsModule = require("./exists-module.helper");
const errorHandler = require("./error-handler.helper");
const successHandler = require("./success-handler.helper");
module.exports = {
    logger,
    slugify,
    SendEmail,
    existsModule,
    errorHandler,
    successHandler
}