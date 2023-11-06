//------------------- MODULES -----------------------
const express = require("express");

//------------------- HANDLERS -----------------------
const holiController = require("../Controllers/holiController");
const authController = require("../Controllers/authController");
const reviewRouter = require("../Router/reviewRoutes");

//------------------- MIDDLEWARE -----------------------
const router = express.Router();

//------------------- MERGEPARAMS (MOUNTING A ROUTER) ROUTES IMBRIQUEES -----------------------

// Si mon URL /HOLIS/ tombe sur quelque chose comme ça /:holiId/reviews, Alors execute reviewRouter .
router.use("/:holiId/reviews", reviewRouter);

router
  .route("/")
  .get(holiController.allHolis)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-coach"),
    holiController.createHoli
  );
  
router
  .route("/:id")
  .get(holiController.oneHoli)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-coach"),
    holiController.uploadHoliImages,
    holiController.rezizeHoliImages,
    holiController.updateHoli
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-coach"),
    holiController.deleteHoli
  );

//------------------- EXPORT FILE -----------------------
module.exports = router;
