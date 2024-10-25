const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const config = require("#app/config/index");
const existsModule = require("#app/helpers/exists-module.helper");
const { exit } = require('process');

if (!existsModule('administrator')){
  console.log('No existe el modulo admin o User');
  exit(1);
}


function isApiAuth(req, res, next) {
  // bearer
  if (!req.session.token) {
    res.status(401);
    return res.json({
      ok: false,
      message: "No autorizado"
    });
  }
  next();
}

/**
 *  Middleware para verificar si el usuario esta autenticado
 * Es para las rutas de administrador
 * Se utiliza passport
 */
async function isAdminAuth(req, res, next) {
  try {
    if (!req.user || !req.user.is_admin) {
      return res.redirect("/admin/signin");
    }
    
    // variables para las vistas
    req.session.admin = req.user;
    res.locals.admin = req.user;
    
    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * si existe la sesion y es admin se redirecciona al dashboard
 */
function isAdminAuthRedirect(req, res, next) {
  console.log("USER", req.user);
  if (req.user && req.user.is_admin) {
    return res.redirect("/dashboard");
  }
  return next();
}

function isUserAuthRedirect(req, res, next) {
  if (req.user) {
    return res.redirect("/profile");
  }
  return next();

}

function findJWTToken(req, res, next) {
    
  //- si viene la autenticacion en el header se verifica
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    req.session.token = token;
    const decoded = jwt.verify(token, config.SECRET);
    req.session.user = decoded;
    if (typeof decoded._target != 'undefined' && decoded._target != '') {
      req.session.user._target_decoded = CryptoJS.AES.decrypt(
        decoded._target,
        config.SECRET
      ).toString(CryptoJS.enc.Utf8);
    }
    if (decoded.iat > decoded.exp) {
      delete req.session.user;
      delete req.session.token;
    } else {
      res.locals.user = req.session.user;
      res.locals.is_auth = true;
    }
  }

  return next(); 
}


module.exports = {
  isApiAuth,
  findJWTToken,
  isAdminAuth,
  isAdminAuthRedirect,
  isUserAuthRedirect
}