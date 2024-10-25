const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Administrator } = require("../models/administrators.model");
const { User } = require("../models/users.model");

const bcrypt = require("bcrypt");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (user.is_admin) {
    //- admin
    Administrator.FindOne(user.id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  } else {
    //- user
    User.FindOne(user.id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  }
});

/**
 * Estrategia local para iniciar sesion como administrador
 */
passport.use(
  "admin",
  new LocalStrategy(function (username, password, done) {
    Administrator.findByEmail(username)
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!result) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, user);
        });
      })
      .catch((err) => {
        return done(err);
      });
  })
);

/**
 * Estrategia local para iniciar sesión como user
 */
passport.use(
  "user",
  new LocalStrategy(function (username, password, done) {
    User.findByEmail(username).then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        if (!result) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return done(null, user);
      });
    });
  })
);

module.exports = passport;
