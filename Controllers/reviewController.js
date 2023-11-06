//------------------- IMPORT FILE -----------------------
const Review = require("../Models/reviewModel");
const factory = require("./handlerFactory");

//------------------- REVIEW CONTROLLER -----------------------
const reviewController = {
  setHoliUserIds: (req, res, next) => {
    // je fais en sorte que l'utilisateur puisse toujours spécifier manuellement le holi et l'id utilisateur.
    // SI il n'y pas de holi specifique dans le body de la requete envoyer par l'utilisateur ALORS je definit le holi = au params(holiID) de l'url
    if (!req.body.holi) req.body.holi = req.params.holiId;

    // 2) (Route imbriquée) SI, il n'y a pas de requête body user donc l'ID du user dans le body, ALORS je le definis comme celui provenant de l'URL
    if (!req.body.user) req.body.user = req.user.id;
    next();
  },
  allReviews: factory.getAll(Review),
  createReview: factory.createOne(Review),
  oneReview: factory.getOne(Review),
  updateReview: factory.updateOne(Review),
  deleteReview: factory.deleteOne(Review),
};

module.exports = reviewController;
