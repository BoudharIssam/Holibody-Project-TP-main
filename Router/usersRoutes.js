//------------------- MODULES -----------------------
const express = require("express");

//------------------- HANDLERS -----------------------
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");

//------------------- MIDDLEWARE -----------------------
const router = express.Router();

//------------------- ROUTES AUTHENTIFICATION -----------------------
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get('/logout', authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);


//--------------- MIDDLEWARE PROTEGE TOUTES LES ROUTES CI-DESSOUS -------------------

router.use(authController.protect);

//------------------- PROTECT ROUTES (autoriser uniquement aux utilisateurs connectés) -----------------------

router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

// J'utilise la méthode HTTP "Patch" parce que cette route est là pour changer, manipuler le document de l'utilisateur.
router.patch(
  "/updatePassword",
  authController.updatePassword
);

router.delete('/deletedMe', userController.deleteUser);

//--------------- MIDDLEWARE PROTEGE TOUTES LES ROUTES CI-DESSOUS -------------------
// A PARTIR D'ICI LES ROUTES CI DESSOUS SONT PROTEGER, MAIS AUSSI RESERVER AUX ADMINISTRATEUR

router.use(authController.restrictTo('admin'));
router
  .route("/")
  .get(userController.allUsers)
  .post(userController.createUser)


router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


//------------------- EXPORT FILE -----------------------
module.exports = router;
