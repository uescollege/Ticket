require('dotenv').config();
require('module-alias/register');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const {systemMiddleware} = require('#app/middlewares/system.middleware');
const compression = require('compression');
const passport = require('passport');

const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 300, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

const sessionOptions = {
  secret: process.env.SECRET || 'secret',
  resave: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },  // 8 hours
  saveUninitialized: true,
};

require('#app/database/knex');

const app = express();

app.use(limiter);
app.use(cors());
app.use(
helmet.crossOriginResourcePolicy({ 
  policy: 'same-site' 
})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET || "123456789iamasecret987654321look"));

app.set('trust proxy', 1);
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'development') {
  // helpers for i18n
  require('#app/helpers/i18n.helper')();
}

// Configuracion de i18n-express: https://www.npmjs.com/package/i18n-express
const i18n = require("i18n-express");

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en", "es"],
  textsVarName: 'i18n',
  cookieLangName: 'ulang',
  defaultLang: 'es'
}));

/**
 * Carga de Modulos
 */

const modules = fs.readdirSync(path.join(__dirname, './modules'));

// /**
//  * Load routes and views
//  */
const views = [path.join(__dirname, './app/views')];
const moduleRoutes = [require('#app/routes')];
for (let i = 0; i < modules.length; i++) {
  const layer = path.join(__dirname, './modules', modules[i]);
  const layerPath = path.join(layer, 'app.js');
  views.push(path.join(layer, 'views'));
  moduleRoutes.push(require(layerPath));
}

/**
 * Fin de carga de modulos
 */

/**
 * Set views
 */
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, './app/views');
app.locals.basedir = path.join(__dirname, './');

app.set('views', views);

app.use(morgan('dev'));

app.use(systemMiddleware);

app.get('/robots.txt', async (req, res) => {
  return res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemaps.xml', async function (req, res) {
  try {
  
    res.header('Content-Type', 'application/xml');

    return res.render("sitemap", {
    });
  } catch (error) {
    return res.json({error});
  }
});


app.use(compression({ level: 9 }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', require('#app/routes'));
app.use('/',  ...moduleRoutes);

app.get('/*', (req, res) => {
  return res.status(404).render('errors/404');
});

require('#app/helpers/cronjobs.helper');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
