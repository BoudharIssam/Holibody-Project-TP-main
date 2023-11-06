//------------------- MODULES -----------------------
const express = require("express");

//------------------- HANDLERS -----------------------
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

//* ROUTE MODULAIRE
//? Je définis une option au router parce que par défaut chaque router n'a accès qu'aux paramètres du fichier present .
//? Mais l'option {mergeParams: true} me permet d'avoir accès au params d'une autre route qui ce trouve dans un autre fichier(holiRouter) . Lorsque je définis mergeParams sur true, les paramètres de route définis dans les routes parentes seront également disponibles dans les routes enfant. Cela signifie que si j'ai des paramètres de route définis dans la route parente, ils seront automatiquement inclus et accessibles dans les routes définies à l'intérieur de ce routeur.
const router = express.Router({ mergeParams: true });

//------------------- PROTECT FONCTION USER ONLINE ONLY -----------------------
router.use(authController.protect);

//------------------- PROTECT ROUTES -----------------------
router
  .route("/")
  .get(reviewController.allReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setHoliUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.oneReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

//------------------- EXPORT FILE -----------------------
module.exports = router;
