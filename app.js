//------------------- MODULES -----------------------
const { rateLimit } = require("express-rate-limit");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require('cookie-parser');
const cors = require('cors');

//------------------- HANDLERS -----------------------
const { csp, helmetConfig } = require('./Services/helmet_csp_config');
const AppError = require("./Services/appError");
const globalErrorController = require("./Controllers/errorController");
const holiRouter = require("./Router/holisRoutes");
const userRouter = require("./Router/usersRoutes");
const reviewRouter = require('./Router/reviewRoutes');
const bookingRouter = require('./Router/bookingRoutes');
const viewRouter = require('./Router/viewRoutes');

const app = express(helmetConfig);
csp(app);
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}

//----------- MOTEUR DE TEMPLATE ----------------
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//----------- GLOBAL MIDDLEWARE ----------------

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


const limiter = rateLimit({
  // Ici, je définis le nombre de requêtes par API (par utilisateur) que j'acceptons.
  windowMs: 60 * 60 * 1000, 
  max: 100, 
  message:
    "Trop de requêtes depuis cette adresse IP, veuillez réessayer dans une heure !",
  
});
app.use("/api", limiter);

// Body parser, Lire les données du corps dans req.body
app.use(express.json({ limit: "10kb" }));

// express middleware => urlencoded => me permet d'analyse les données provenant d'un formulaire url
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Il analyse les données du cookie
app.use(cookieParser());

app.use(mongoSanitize());


//----------- ROUTES MIDDLEWARE ----------------
app.use('/', viewRouter);

app.use("/api/v1/holis", holiRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//----------- ROUTES UNDEFINED MIDDLEWARE ERROR (OPERATIONAL ERRORS) ----------------
// Si aucune des routes déclarée dans APP ne fonctionne ALORS j'exécute cette erreur .

app.all("*", (req, res, next) => {
  next(new AppError(`I can't find ${req.originalUrl} on this server`, 404));
});

// CREATION D'UN MIDDLEWARE DE GESTION DES ERREURS
// EXPRESS l'appel uniquement quand il y a une erreur .
app.use(globalErrorController);

module.exports = app;
