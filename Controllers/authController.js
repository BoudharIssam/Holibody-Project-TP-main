//------------------- IMPORT NPM MODULE -----------------------
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

//------------------- IMPORT FILE -----------------------
const User = require("./../Models/userModel");
const catchAsync = require("./../Services/catchAsync");
const AppError = require("./../Services/appError");
const Email = require("./../Services/email");

//-------------------  FACTORING REPEATED CODE -----------------------
const signToken = (id) => {
  // En paramètres (id), qui va être remplacé à chaque fois par l'id de l'utilisateur. ID => TOKEN
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//-------------------  FACTORING REPEATED CODE -----------------------

// Les arguments user et statusCode stockeront les résultats qui leur sont propres à chaque fois qu'ils sont appelés dans une autre fonction .
const createSendToken = (user, statusCode, res) => {
  // 1) Initialisation du token
  const token = signToken(user._id);

  // 2) Déclaration des options du cookie
  const cookieOptions = {
    // Option du cookie => Spécification de la propriété d'expiration pour que le navigateur supprime automatiquement le cookie après expiration.
    // Utilisation de `new Date()` en JavaScript pour spécifier une date.
    // `Date.now()` retourne le nombre de millisecondes écoulées depuis le 1er janvier 1970.
    // En ajoutant `process.env.JWT_COOKIE_EXPIRES_IN`, nous obtenons la date actuelle plus la durée en jours spécifiée.
    // Pour convertir la durée d'un jour en millisecondes, nous multiplions par 24 heures, 60 minutes, 60 secondes et 1000 millisecondes.

    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Empêche le cookie d'être consulté ou modifié par le navigateur, important pour prévenir les attaques de script intersites.
  };

  // 3) Sécurisation du cookie en HTTPS.
  // NE FONCTIONNE QUE SUR METHODE HTTPS
  // secure: true => Option pour n'envoyer le cookie que sur une connexion cryptée HTTPS.
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // 4) Envoi du cookie
  // res.cookie() => Attache le cookie() à RES pour l'envoyer.
  // Spécification du nom du cookie => 'jwt'
  // Données à envoyer dans le cookie => token
  // Enfin, spécification des options => cookieOptions
  res.cookie("jwt", token, cookieOptions);

  // 5) Je cache le mot de passe dans la réponse.
  // password = undefined => Cache le champ et sa valeur pour ne pas l'afficher dans la sortie du navigateur.
  user.password = undefined;

  // 6) Envoi de la réponse
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//------------------- CONTROLLER USER D'AUTHENTIFICATION  -----------------------

const authController = {
  signup: catchAsync(async (req, res, next) => {
    // 1) Je récupère les données de l'utilisateur dans le body pour les enregistrer dans la base de données DB
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    });

    const url = `${req.protocol}://${req.get("host")}/me`;
    console.log(url);
    await new Email(newUser, url).sendWelcome();

    // 2) Code factoriser pour la creation du token JWT et l'envoie de la réponse à l'utilisateur.
    createSendToken(newUser, 200, res);
  }),

  login: catchAsync(async (req, res, next) => {
    console.log('LOGIN AUTHENTICATION CONTROLLER')
    // 1) Je veux lire l'email et le password dans le body
    // const email = req.body.email => "OBJECT DESTRUCTURING" parce que la variable que je declare porte le même nom que la propriété que je cherche dans le body. Je crée donc 2 variables en une grâce à l'objet body qui contient les 2 propriétés.
    const { email, password } = req.body;

    // J'entame ci dessous une verification par négation .
    // 2) Je vérifie SI email et password existent.
    //SI emails ou password est false alors j'envoie un message d'erreur aux clients ma classe AppErro global .
    if (!email || !password) {
      // J'utiliserai RETURN parce qu'après avoir appelé le next middleware, je veux m'assurer que cette fonction de connexion se termine tout de suite pour ne rien envoyer d'autre qui se trouve en dessous.
      return next(new AppError("Please provide email and password!", 400));
    }
    // 3) Je vérifie en BD avec Mongoose SI l'user exists correspondant à l'email && password envoyer.
    // findOne => Je sélectionne un user non pas avec son ID mais avec son email =>  emailBD === emailBODY.
    // model password select: false => User.findOne({ email: email }) du coup ne contiendra pas le password qui va avec cet email. Mais j'ai besoin du password pour vérifier qu'il soit bien correct du coup je vais l'ajouter, mais pour que ça fonctionne il faut que je place avant '+' pour contourner l'option que j'ai declarer dans le Usermodel "password => select: false"
    const user = await User.findOne({ email: email }).select("+password");
    console.log(user);

    // 4) METHODE D'INSTANCE creer dans le model user et réutiliser ici => "correctPassword(password, user.password)"
    // const correct = await user.correctPassword(password, user.password) => Je place ma variable dans le if car si l'utilisateur n'existe pas il n'y a plus de raison d'exécuter ce code car il a lui même besoin des informations du user.
    // Et la raison pour laquelle lors du mon message d'erreur, je ne divulgue pas où se trouve l'erreur exactement, c'est pour éviter de faciliter la tâche a un hacker.
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 5) Si tout est ok, je peux creer et envoyer le token a l'utilisateur.
    createSendToken(user, 200, res);
  }),

  protect: catchAsync(async (req, res, next) => {
    // 1️) Je recupere le token pour vérifier si il existe bien.
    // Pour récupérer mon token je crée d'abord une variable vide que je puisse ensuite réutiliser.
    let token;

    // 2) "SI" dans le header "autorisation" existe ET "Si" dans "autorisation" ca valeur commence par "Bearer" ALORS c'est TRUE
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Ma variable "TOKEN" recupere la valeur stocker dans authorization = Je dois récupérer le token qui est la 2 partie du headers.authorization qui est une string => j'utilise javascript "SPLIT()" qui va diviser la string en 2 grâce à l'espace qui les sépare et en faire un tableau de 2 valeurs. Il ne me reste plus qu'à récupérer ensuite la deuxieme valeur => [1].
      token = req.headers.authorization.split(" ")[1];

      // 3) "OU SI" le token n'est pas trouvé dans le header "autorisation", "ALORS" examine aussi les cookies.
    } else if (req.cookies.jwt) {
      // ALORS le jeton JWT devrait être dans la requete cookie.
      token = req.cookies.jwt;
    }

    // 4) "SI" le token n'est pas trouvé "ALORS" tu renvoies une erreur
    // 401 => code status pour "non authoriser"
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 4) Verification token, JWT vérifie si la signature est valide ou pas.
    // Sur cette étape je vais vérifier si quelqu'un à manipuler les données ou si le Token a expiré.
    // 1- J'utilise la function asynchrone "verify" de JWT et lui passe le "token"et la "clé secrète" afin de créer la signature de test . Le processus de vérification ici est en charge de voir si personne n'a modifié l'id dans le playload du Token. Grâce à ça je peux être sûr à 100 % que l'utilisateur à qui j'ai émis le token est exactement celui dont l'id est a l'interieur du playload du token.
    // 2- Ensuite j'ai remarqué que "verify" est une fonction asynchrone qui ne renvoie pas une promesse et je veux qu'elle me renvoie une promesse. Je vais donc la convertir en promesse en utilisant "promisify" pour ensuite utilisé "await".
    // 3- Ensuite je stock le resultat dans la variable "decoded" => PAYLOAD(data) => ID USER, CREATION DATE, EXPIRE DATE. Car j'aurais besoin de l'utiliser pour vérifier les informations qu'elle possède .
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 5) Vérifier si l'utilisateur existe toujours.
    // Si l'étape 4 à fonctionné, je veux checker si l'ID dans la variable "decoded" existe dans la base de données.
    // Je stocke d'abord la valeur dans une variable et ensuite je la verifie avec un if.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging does no longer exist.", 401)
      );
    }

    // 6) Vérifiez si l'utilisateur a changé de mot de passe après l'émission du Token JWT.
    // Pour pouvoir vérifier cela, il va falloir que je crée une méthode d'instance qui va être disponible sur tous les documents. Parce que les documents sont des instances de "Model".
    // Mais aussi parce que cette vérification va me demander beaucoup de code et donc ce code appartient au model user et pas vraiment au contrôleur .
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      // currentUser = true => .changedPasswordAfter = true => (decoded.iat) = true => execute le code Error
      return next(
        new AppError("User recently change password! Please log in again.", 401)
      );
    }

    // 7) Si tout est correct au dessus je stock toutes les données de l'utilisateur dans la requete user.
    req.user = currentUser;
    // 7) SI tout est OK, je stocke l'utilisateur dans l'objet res.locals pour y accéder ultérieurement.
    res.locals.user = currentUser;
    // 8) Si l'utilisateur passe toutes les vérifications, il passe à la suite en ayant accès à la route protégée
    next();
  }),

  isLoggedIn: async (req, res, next) => {
    // 1) Je vérifie si le cookie JWT existe dans la requête
    if (req.cookies.jwt) {
      try {
        // 2) Je vérifie l'intégrité du token JWT en le décodant avec la clé secrète
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        // 3) Je vérifie si l'utilisateur associé à ce token existe toujours dans la base de données.
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          // SI l'utilisateur n'existe pas, passe à la prochaine middleware.
          return next();
        }

        // 4) Je vérifie si l'utilisateur a changé son mot de passe après l'émission du token JWT.
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          // SI l'utilisateur a changé de mot de passe, passe à la prochaine middleware.
          return next();
        }

        // 5) SI tout est OK, je stocke l'utilisateur dans l'objet res.locals pour y accéder ultérieurement.
        res.locals.user = currentUser;

        // 6) Je continue avec le prochaine middleware.
        return next();
      } catch (err) {
        // En cas d'erreur, je passe également à la prochaine middleware.
        return next();
      }
    }

    // SI le cookie JWT n'existe pas dans la requête, je passe au prochaine middleware.
    next();
  },

  logout: (req, res) => {
    // 1) J'utilise l'objet de réponse (`res`) pour définir un cookie 'jwt'
    // Le cookie est utilisé pour stocker des informations côté client, telles que le statut de connexion
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  },

  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    };
  },

  forgotPassword: catchAsync(async (req, res, next) => {
    // 1) Recuperer l'user basé sur l'email de la requete post avec findOne parce que je ne peux pas connaitre l'ID de l'utilisateur.
    const user = await User.findOne({ email: req.body.email });

    // 2) "SI" l'utilisateur n'existe pas dans la base de données ALORS je renvoie un message d'erreur .
    if (!user) {
      return next(
        new AppError("There is no user with that email adresse", 404)
      );
    }

    // 3) Generer un jeton aléatoire pour reset le password.
    // Je récupère mon "JETON" créer dans le middlaware "createPasswordResetToken()" du fichier model user
    const resetJeton = user.createPasswordResetToken();

    // 4) Maintenant que j'ai récupéré mon jeton crypté du "model user" je le sauvegarde en bas de données
    //⛔ Mais il faut avant tout que je désactive tous les validateurs de mon "userSchema" le temps de ma sauvegarde avec⛔ => monggose {validateBeforeSave: false}✅
    await user.save({ validateBeforeSave: false });
    console.log("⛔", resetJeton, " ⛔");

    // 5) Le renvoyer le resultat sur l'email de l'user.
    // resetURL(lien) => http://127.0.0.1:4000/api/v1/users/resetPassword/[object Promise].
    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetJeton}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        // Et je conclus la requete de l'utilisateur avec un "res.status"
        status: "success",
        message: "Token sent to email! ",
      });
    } catch (err) {
      // En cas d'erreur
      user.passwordResetJeton = undefined; // je vide passwordResetJeton
      user.passwordResetJetonExpires = undefined; // je vide passwordResetJetonExpires
      await user.save({ validateBeforeSave: false }); // Et j'enregistre dans la BD .

      // Après avoir tout réinitialisé j'en vois enfin mon erreur !
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    // 1) Trouver l'utilisateur basé sur le jeton .
    // Le token qui se trouve dans le params de l'URL n'est pas crypté. Il faut donc que je le crypte à nouveau pour le comparer au Token crypte qui lui se trouve dans la DB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token) // J'indique la valeur que je souhaite crypter => qui est le "token" de l'user dans le params de l'URL DE LA ROUTE.
      .digest("hex"); // Et j'indique que je souhaite stocker la valeur en forme hexadécimale .

    // 2) La seule information que je possède sur cet utilisateur, c'est son jeton. Par conséquent, je recherche l'utilisateur en fonction du JETON récupéré.
    // Mongoose findOne(Propriété: valeur) => Trouve le bon document en BD grâce à une propriété avec sa valeur.
    // J'examine également la propriété "passwordResetJetonExpires" en BD pour vérifier si elle est supérieure à l'heure actuelle, ce qui signifie qu'elle n'a pas encore expiré.
    // Je vérifie SI le jeton n'a pas expiré avec $gt: => Requête mongoose "supérieur à" ensuite, MongoDB convertit le reste des informations pour pouvoir les comparer.
    const user = await User.findOne({
      passwordResetJeton: hashedToken,
      passwordResetJetonExpires: { $gt: Date.now() },
    });

    // 3) SI le jeton a expiré, ALORS je ne peux pas réinitialiser le mot de passe, j'envoie donc une erreur.
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    // 4) S'il n'y a pas d'erreur, je récupère et mets à jour le mot de passe de l'utilisateur dans la base de données.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetJeton = undefined;
    user.passwordResetJetonExpires = undefined;
    await user.save(); // mongoose => save() => Qui sauvegarde toutes les mises a jour des informations dans la BD

    // 5) Connecter l'utilisateur en envoyant le token JWT
    createSendToken(user, 200, res);
  }),

  updatePassword: catchAsync(async (req, res, next) => {
    console.log("eeerrroooor");
    // 1) Je dois trouver et recuperer l'utilisateur dans la "collection BD"
    const user = await User.findById(req.user.id).select("+password");

    // 2) Je vérifie si le mot de passe affiché correspond.
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(
        new AppError("Your current password is wrong. Please try again", 401)
      );
    }

    // 3) Si le mot de passe correspond je le mets à jour
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Connecter d'utilisateur avec son nouveau mot de passe et lui envoyer son Token JWT
    createSendToken(user, 200, res);
  }),
};

//------------------- EXPORT FILE -----------------------
module.exports = authController;
