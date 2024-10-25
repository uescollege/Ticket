const { Router } = require("express");
const router = Router();

const {AuthController} = require('../controllers/auth.controller');
const {EVResult} = require('#app/middlewares/ev-result.middleware');
const {body} = require('express-validator');
const {isAdminAuthRedirect,isUserAuthRedirect} = require('#app/middlewares/auth.middleware');

const passport = require('passport');
require('../vendors/passport');


/******** ADMIN AUTH *********/

router.get('/admin/signin', 
isAdminAuthRedirect,
AuthController.renderAdminSignIn);

router.get('/admin/signup',
isAdminAuthRedirect,
AuthController.renderAdminSignUp);

// name email password password_confirmation
router.post('/admin/signup',
body('name').isString().isLength({min: 3, max: 255}).withMessage('El nombre es requerido'),
body('email').isEmail().withMessage('El email es requerido'),
body('password').isLength({min: 6}).withMessage('La contraseña es requerida'),
body('password_confirmation').isLength({min: 6}).withMessage('La confirmación de la contraseña es requerida'),
EVResult, AuthController.ajaxCreateAdmin);


router.post('/admin/signin', 
body('username').isEmail().withMessage('El email es requerido'),
body('password').isLength({min: 6}).withMessage('La contraseña es requerida'),
EVResult, passport.authenticate('admin', { 
  successRedirect: '/dashboard',
  failureRedirect: '/admin/signin',
}));

/******** User AUTH *********/

router.get('/user/signin',isUserAuthRedirect, AuthController.renderUserSignIn);
router.get('/user/signup',isUserAuthRedirect, AuthController.renderUserSignUp);

router.post('/user/signup',
body('name').isString().isLength({min: 3, max: 255}).withMessage('El nombre es requerido'),
body('email').isEmail().withMessage('El email es requerido'),
body('password').isLength({min: 6}).withMessage('La contraseña es requerida'),
EVResult, AuthController.ajaxCreateUser);


router.post('/user/signin', 
body('username').isString().toLowerCase().trim().withMessage('El email es requerido'),
body('password').isString().isLength({min: 1}).trim().withMessage('La contraseña es requerida'),
EVResult, 
passport.authenticate('user', { 
  successRedirect: '/',
  failureRedirect: '/user/signin',
})
// function (req, res, next) {
//   passport.authenticate('user', function (err, user, info) {
//     if (err) { return res.status(500).json({success: false, msg: info.message}); }
//     if (!user) { 
//       return res.status(500).json({success: false, msg: info.message});
//     }
//     req.logIn(user, function (err) {
//       if (err) { return res.status(500).json({success: false, msg: "Error"}); }
//       return res.json({ok: true, msg: 'Bienvenido!'});
//     });
//   })(req, res, next)
// }
);


router.post('/logout', AuthController.logout);

module.exports = router;