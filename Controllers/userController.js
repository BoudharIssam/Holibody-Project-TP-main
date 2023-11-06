const multer = require("multer");
const sharp = require("sharp");

//------------------- IMPORT FILE -----------------------
const catchAsync = require("../Services/catchAsync");
const AppError = require("../Services/appError");
const Users = require("./../Models/userModel");
const factory = require("./handlerFactory");

// Je configure le stockage avec multer : stockage en mémoire
const multerStorage = multer.memoryStorage();

// Filtrage des fichiers téléchargés
const multerFilter = (req, file, callback) => {
  // Je vérifie si le fichier est une image en vérifiant le type MIME
  if (file.mimetype.startsWith("image")) {
    callback(null, true); // Le fichier est accepté
  } else {
    // SI le fichier n'est pas une image, génère une erreur
    callback(
      new AppError("Not an image! Please upload only images.", 400),
      false
    );
  }
};

// Je configure multer avec le stockage et le filtre définis
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//------------------- FONCTION FILTER BODY -----------------------
// Je crée cette fonction full JavaScript pour filtrer les informations envoyées dans le CORPS de la requête.

// Si un utilisateur décide d'envoyer des informations que je ne souhaite pas conserver, je m'assurerai que mon application ne les utilise pas. Pour cala, je dois parcourir l'objet et pour chaque élément, vérifier s'il correspond à l'un des champs autorisés.
// Si des champs autorisés sont trouvés, je les ajouterai simplement à un nouvel objet.

const filterObj = (obj, ...allowedFields) => {
  // 1) Cette fonction prend un objet en paramètre (obj) et peut prendre d'autres paramètres pour les champs que je souhaite autoriser "allowedFields" cela va créer un tableau contenant tous les arguments transmis.

  // 2) Je crée un objet vide (newObj) qui stockera les champs autorisés à envoyer en base de données.
  const newObj = {};

  // 3) J'utilise Object.keys() pour obtenir un tableau avec les noms des clés de l'objet (obj), puis j'utilise forEach() pour parcourir chaque élément du tableau.
  Object.keys(obj).forEach((el) => {
    // SI le tableau des champs autorisés (allowedFields) inclut l'élément actuel (le nom du champ actuel), je souhaite l'ajouter au nouvel objet (newObj).
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  }); // Donc, si le champ actuel est l'un des champs autorisés, alors newObj avec le nom du champ actuel doit être égal à ce qui se trouve dans l'objet d'origine.

  // 4️) Je clôture cette fonction avec un "return" qui renvoie l'objet (newObj) que je veux utiliser, qui stocke les valeurs des champs autorisés.
  return newObj;
};

//------------------- CONTROLLER USER   -----------------------
const userController = {
  // Middleware pour télécharger la photo de l'utilisateur (une seule photo)
  uploadUserPhoto: upload.single("photo"),

  // Middleware pour redimensionner la photo de l'utilisateur
  resizeUserPhoto: catchAsync(async (req, res, next) => {
    // Je vérifie si un fichier a été téléchargé
    if (!req.file) return next();

    // Je génère un nom de fichier unique en fonction de l'ID de l'utilisateur et de la date
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // Je redimensionne l'image téléchargée en 500x500 pixels, la convertit en format JPEG avec une qualité de 90%
    // Puis je la stocke dans le répertoire public/img/users avec le nom de fichier généré
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next(); // Passe au middleware suivant
  }),
  updateMe: catchAsync(async (req, res, next) => {
    // 1) Créer une erreur si l'utilisateur cherche à modifier les données du mot de passe.
    // SI l'utilisateur tente d'envoyer dans la requête PASSWORD OU PASSWORDCONFIRM, la requête sera refusée, et j'enverrai une erreur.
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    // 2) Je filtre les noms de champs indésirables qui ne sont pas autorisés à être mis à jour.
    // Je crée la variable "filteredBody" qui stocke la fonction "filterObj()" que j'ai créée plus haut.
    // Elle prend comme valeur l'objet contenant toutes les valeurs envoyées par l'utilisateur "req.body" et ne conserve que les CHAMPS que je souhaite conserver.
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;
    console.log(filteredBody);
    // 3) Mettre à jour le document de l'utilisateur.
    const updatedUser = await Users.findByIdAndUpdate(
      req.user.id, // Je transmets l'ID et les données que l'utilisateur souhaite mettre à jour.
      filteredBody, // Je n'utilise pas les données que l'utilisateur envoie dans req.body, car je ne souhaite pas mettre à jour en DB des données sensibles (rôle, token, etc.) que je ne veux pas modifier sur cette route (ex: role: admin) ⛔, ce qui pourrait permettre à n'importe quel utilisateur de devenir administrateur.
      { new: true, runValidators: true }
      // OPTIONS Mongoose => new: true => renvoie le nouvel objet mis à jour au lieu de l'ancien.
      // OPTIONS Mongoose => runValidators: true => valide ou renvoie une erreur en cas de problème de format de la donnée mise à jour dans la DB, par exemple, si l'utilisateur envoie un email non conforme.
    );

    // 4) J'envoie la réponse .
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }),
  getMe: (req, res, next) => {
    console.log('GETME USER CONTROLLER')
    req.params.id = req.user.id;
    next();
  },
  allUsers: factory.getAll(Users),
  getUser: factory.getOne(Users),
  createUser: factory.getOne(Users),
  updateUser: factory.updateOne(Users),
  deleteUser: factory.deleteOne(Users),
};

module.exports = userController;