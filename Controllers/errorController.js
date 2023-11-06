//----- IMPORT FILE ------------
const AppError = require("./../Services/appError");

//----- FONCTION ERREUR INVALID ID OR ANY VALUE------------
// Fonction pour gérer les erreurs de type "CastError" (conversion de type échouée)
const handleCastErrorDB = (err) => {
  // Je crée un message d'erreur indiquant le chemin (path) et la valeur (value) invalides
  const message = `Invalid ${err.path}: ${err.value}.`;

  // Je crée et retourne une nouvelle instance d'AppError avec le message et le code d'état 400(Requête incorrecte)
  return new AppError(message, 400);
};

//----- FONCTION ERREUR DUPLICATA DB------------

// Fonction pour gérer les erreurs de doublon de champ dans la base de données.
const handleDuplicateFieldsDB = (err) => {
  // Je récupère la première valeur depuis l'objet keyValue de l'erreur.
  const value = Object.values(err.keyValue)[0];

  // Je crée un message d'erreur indiquant la valeur du doublon.
  const message = `Duplicate field value: ${value}. Please use another value!`;

  // Je crée et retourne une nouvelle instance d'AppError avec le message et le code d'état 400(Requête incorrecte)
  return new AppError(message, 400);
};

//----- FONCTION ERREUR VALIDATION DB------------

// Fonction pour gérer les erreurs de validation de données (par exemple, échec de la validation du schéma Mongoose)
const handleValidationErrorDB = (err) => {
  // Je récupère les messages d'erreur de validation à partir des propriétés errors de l'erreur
  // err.errors => Correspond à l'objet "errors" (Qui contient la valeur que je souhaite ?) à l'intérieur de l'objet parent "error".
  // el === element actuel
  const errors = Object.values(err.errors).map((el) => el.message);

  // Je crée un message d'erreur indiquant les erreurs de validation en concaténant chaque fin de message d'erreur. Car il en a plusieur.
  const message = `Invalid input data. ${errors.join(". ")}`;

  // Je crée et retourne une nouvelle instance d'AppError avec le message et le code d'état 400(Requête incorrecte)
  return new AppError(message, 400);
};

//----- FONCTION ERREUR TOKEN JWT------------

const handleJWTError = () =>
  new AppError("Invalid Token. Please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has Expired! Please log in again", 401);

//----- FONCTION ERREUR DEVELOPMENT ------------

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // Répond avec le code d'état de l'erreur et un objet JSON contenant des informations sur l'erreur
    return res.status(err.statusCode).json({
      // Statut de la réponse (par exemple, "fail" pour les erreurs)
      status: err.status,

      // Détails complets de l'erreur (utile pour le débogage, mais à ne pas divulguer au client)
      error: err,

      // Message d'erreur
      message: err.message,

      // Stack de l'erreur (informations de suivi de la pile, utiles pour le débogage)
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSIDE
  console.error(`⛔ERROR⛔`, err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong !",
    msg: `${err.message}`,
  });
};

//----- FONCTION ERREUR PRODUCTION ------------

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // Je vérifie si l'erreur est considérée comme "opérationnelle"
    if (err.isOperational) {
      // Si c'est le cas, je renvoie une réponse JSON avec le statut, le message d'erreur et le code d'état de l'erreur
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Gérez le cas où error est undefined ou non opérationnel
      // j'enregistre l'erreur dans la console avec un message d'erreur en emoji pour la constater.
      console.error(`⛔ERROR⛔`, err);
      return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
  // B) RENDER WEBSIDE ERROR
  // console.log(err.isOperational);
  // Erreur opérationnel(erreur d'une route qui n'existe pas, Oui essayer d'entrer des données invalides ) reponse au client
  if (err.isOperational) {
    // RENDERED WEBSIDE
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong !",
      msg: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: `Please try again later.`,
  });
};

//----- ⬇️✅✅✅✅✅ EXECUTIONS DES FONCTIONS ERREUR  ✅✅✅✅✅⬇️ ------------

module.exports = (err, req, res, next) => {
  // Si le code d'état de l'erreur n'est pas défini, le définir par défaut à 500 (Erreur interne du serveur)
  err.statusCode = err.statusCode || 500;

  // Si le statut de l'erreur n'est pas défini, le définir par défaut à "error"
  err.status = err.status || "error";

  // Vérifier l'environnement d'exécution (développement ou production)
  if (process.env.NODE_ENV === "development") {
    // En mode développement, utiliser la fonction sendErrorDev pour gérer l'erreur
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // En mode production, fournir au client un message d'erreur minimal

    // Créer une copie JSON de l'erreur pour éviter de divulguer des informations sensibles
    let error = { ...err }; // destructuration de 'err' d'origine en créant une copie de cet objet erreur.
    error.message = err.message;

    // Si l'erreur est de type "CastError" (par exemple, conversion de type échouée), execute cet fonction
    if (error.name === "CastError") error = handleCastErrorDB(error);

    // Si l'erreur porte le code "11000", execute cet fonction
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Si l'erreur est une erreur de validation (par exemple, échec de la validation du schéma Mongoose), execute cet fonction
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    // En mode production, utiliser la fonction sendErrorProd pour gérer l'erreur
    sendErrorProd(error, req, res);
  }
};
