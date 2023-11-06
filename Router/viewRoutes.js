//------------------- MODULES -----------------------
const express = require("express");

//------------------- HANDLERS -----------------------
const viewController = require("../Controllers/viewController");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");

//------------------- MIDDLEWARE -----------------------
const router = express.Router();

//------------------- ROUTES -----------------------
router.get("/", viewController.getWelcome);

router.get(
  "/holis",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get("/holi/:slug", authController.isLoggedIn, viewController.getholi);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get(
  '/resetPass',
  authController.isLoggedIn,
  viewController.getResetPassForm
);
router.get("/signup", authController.isLoggedIn, viewController.getSignUpForm);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-holy-book", authController.protect, viewController.getMyHolis);

router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateUserData
);

router.post('/deleteMe', authController.protect, userController.deleteUser);

//------------------- EXPORT FILE -----------------------
module.exports = router;
