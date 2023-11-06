//------------------- MODULES -----------------------
const { rateLimit } = require("express-rate-limit");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require('cookie-parser');
const cors = require('cors');

console.log('APP')
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
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
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
// app.options('/api/v1/tours/:id', cors());

// Sécurité HEADERS
// Set security HTTP headers
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'http://127.0.0.1:8000/*'],
//       scriptSrc: [
//         "'self'",
//         'https://*.stripe.com',
//         'https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js',
//       ],
//       workerSrc: ['blob:'],
//       objectSrc: ["'none'"],
//       styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//       fontSrc: ["'self'", 'https:', 'data:'],
//       imgSrc: ["'self'", 'data:'],
//       connectSrc: [
//         "'self'",
//         'wss://natours-pw5m.onrender.com:54819',
//         'https://checkout.stripe.com'
//       ],
//       frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com']
//     }
//   })
// );

// Connexion mode développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// La fonction "limiter" agit comme un middleware.
// rateLimit({}) est une fonction qui prend un objet d'options comme argument.
const limiter = rateLimit({
  // Ici, je définis le nombre de requêtes par API (par utilisateur) que j'acceptons.
  windowMs: 60 * 60 * 1000, // 1 heure en millisecondes
  max: 100, // Limite chaque adresse IP à 100 requêtes par "fenêtre" et par heure.
  message:
    "Trop de requêtes depuis cette adresse IP, veuillez réessayer dans une heure !",
  // Ce message d'erreur (statusCode : 429 Too Many Request) sera affiché une fois la limite dépassée.
});
// J'applique la limitation des requêtes à toutes les routes commençant par l'URL '/api'.
app.use("/api", limiter);

// Body parser, Lire les données du corps dans req.body
app.use(express.json({ limit: "10kb" }));

// express middleware => urlencoded => me permet d'analyse les données provenant d'un formulaire url
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Il analyse les données du cookie
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log('👋👋 Hello from middleware 👋👋');
//   next();
// });

// SÉCURITÉ : PROTECTION CONTRE LES INJECTIONS DE REQUÊTES NO-SQL
// Cela est particulièrement important lors des connexions utilisateur, qui sont directement liées à la base de données.
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
