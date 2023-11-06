//------------------- IMPORT FILE -----------------------
const catchAsync = require("../Services/catchAsync");
const AppError = require("../Services/appError");

console.log('FACTORY CONROLLER')

//------------------- FACTORY HANDLER FONCTION -----------------------
//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ DELETE DOCUMENT ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Je recherche le document correspondant à l'ID spécifié dans l'URL et le supprime de la base de données.
    const doc = await Model.findByIdAndDelete(req.user.id);
    console.log(req.user.id)
    // 2) "SI" le document n'est pas trouvé dans la base de données, "ALORS" je renvoie une erreur 404 (Not Found).
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // 3) J'envoie la réponse de la requête avec un statut "204 No Content" pour indiquer que le document a été supprimé avec succès.
    res.status(204).json({
      status: "success",
      message: "Success deleted document",
    });
  });

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ UPDATE DOCUMENT ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Je recherche le document correspondant à l'ID spécifié dans l'URL, pour mettre à jour les données avec celles fournies dans le corps de la requête.
    // Les options "new" renvoient la version mise à jour du document, et "runValidators" exécute les validateurs définis dans le modèle.
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // 2) "SI" le document n'est pas trouvé dans la base de données, "ALORS" je renvoie une erreur 404 (Not Found).
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // 3) J'envoie la réponse de la requête avec un statut "200 success" et renvoie les données mises à jour du document.
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ CREATE NEW DOCUMENT ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Je crée un nouveau document en utilisant les données fournies dans le corps de la requête (req.body).
    const doc = await Model.create(req.body);

    // 2) J'envoie la réponse de la requête avec le nouveau document créé et le statut "201 Created".
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ GET ONE DOCUMENT ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    console.log("GETONE FACTORY CONTROLLER");
    // 1) Je sélectionne le document avec l'ID spécifié dans la requête.
    let query = Model.findById(req.params.id);

    // 2) "SI" l'options populate (populateOptions) est fournie, "ALORS" j'ajoute le populate à la requête.
    if (populateOptions) query = query.populate(populateOptions);

    // 3) Je récupére le document de la base de données en exécutant la requête.
    const doc = await query;

    // 4) "SI" aucun document n'est trouvé avec l'ID spécifié, "ALORS" je renvoie une erreur 404.
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // 5) J'envoie la réponse de la requête avec le document trouvé.
    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ GET ALL DOCUMENT ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) J'initialise un filtre vide pour les requêtes.
    let filter = {};

    // 2) "SI" un ID holi est présent dans l'URL, "ALORS" je mets à jour le filtre pour rechercher uniquement les avis associés à cet holi ID.
    if (req.params.holiId) filter = { holi: req.params.holiId };
    

    // 3) En fonction du contenu de "filter", je recherche les avis correspondants dans la base de données ou SI "filter" est vide, ALORS je recherche tous les avis.
    const doc = await Model.find(filter);

    // 4) J'envoie la réponse de la requête avec un statut "200 success" et je renvoie les avis trouvés, ainsi que des informations supplémentaires telles que le nombre de résultats et l'heure de la requête.
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: doc.length,
      data: {
        doc,
      },
    });
  });
