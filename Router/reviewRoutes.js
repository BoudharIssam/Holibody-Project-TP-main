//------------------- MODULES -----------------------
const express = require("express");

//------------------- HANDLERS -----------------------
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

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
