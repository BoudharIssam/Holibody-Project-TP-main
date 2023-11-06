const multer = require("multer");
const sharp = require("sharp");

//------------------- IMPORT FILE -----------------------
const catchAsync = require("../Services/catchAsync");
const AppError = require("../Services/appError");
const Holi = require("./../Models/holiModel");
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

//------------------- HOLIS CONTROLLER -----------------------
const holisController = {
  uploadHoliImages: upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ]),
  rezizeHoliImages: catchAsync(async (req, res, next) => {
    // console.log(req.files);
    if (!req.files.imageCover || !req.files.images) return next();

    // 1)cover image
    // const imageCoverFilename = `holi-${req.params.id}-${Date.now()}-cover.jpeg`
    req.body.imageCover = `holi-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/holis/${req.body.imageCover}`);
    // req.body.imageCover = imageCoverFilename

    // 2) Images
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const filename = `holi-${req.params.id}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/holis/${filename}`);

        req.body.images.push(filename);
      })
    );
    // console.log(req.body)
    next();
  }),
  allHolis: factory.getAll(Holi),
  oneHoli: factory.getOne(Holi, { path: "reviews" }),
  createHoli: factory.createOne(Holi),
  updateHoli: factory.updateOne(Holi),
  deleteHoli: factory.deleteOne(Holi),
};
module.exports = holisController;
