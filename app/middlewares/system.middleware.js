const {vendorsPath} = require('../utils/vendors.util');
const {renderFile} = require('pug');
const { join: pathJoin } = require('path');

const existsModule = require("#app/helpers/exists-module.helper");
const { exit } = require('process');

// if (!existsModule('admin')) {
//   console.log('No existe el modulo administrador');
//   exit(1);
// }

async function systemMiddleware (req, res, next) {
  try {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    res.locals.moment = require('moment');
    res.locals.moment.locale('es');
    res.locals.vendorsPath = vendorsPath;
    res.locals.vendors = { css: [], js: []}
    // configuracion de permisos y modulos

    res.locals.app_name = 'Proyecto de IGF115';
    res.locals.app_description = 'Universidad de El Salvador';
    res.locals.web_name = 'IGF115';
    res.locals.meta_type = 'website';
    if (!req.cookies.ulang) {
      res.cookie('ulang', 'es');
    }

    res.locals.lang = req.cookies.ulang || 'es';
    res.locals.meta_url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.locals.host = `${req.protocol}://${req.get('host')}`;
    // res.locals.csrfToken = req.csrfToken();

    //- dynamic include
    res.locals.include = (pathtopug, options = {}) => { // used for imitate includ pug function

      return renderFile(pathJoin(__dirname, '../../', pathtopug), options); //render the pug file
    }

    res.locals.menus = require("../utils/main-menu");

    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  systemMiddleware
};