//------------------- IMPORT FILE -----------------------
const catchAsync = require("../Services/catchAsync");
const AppError = require("../Services/appError");
const Users = require("./../Models/userModel");
const Holi = require("../Models/holiModel");
const Booking = require("../Models/bookingModel");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking")
    res.locals.alert = `Your booking has been successfully done! Please check your email for confirmation.
     If your booking doesn't show up here immediately, please come back later.`;
  next();
};

const viewController = {
  getWelcome: catchAsync(async (req, res) => {
    res.status(200).render("welcome");
  }),
  getOverview: catchAsync(async (req, res) => {
    // 1) Get holi data from collection
    const holis = await Holi.find();

    // 2️) Render that template using holi data from
    res.status(200).render("overview", {
      title: "All holis",
      holis,
    });
  }),
  getholi: catchAsync(async (req, res, next) => {
    // 1) Je recherche le bon holi en BD avec le champ slug, en incluant les avis associés
    const holi = await Holi.findOne({ slug: req.params.slug }).populate({
      path: "reviews",
      fields: "review rating user",
    });

    // 2) SI le holi n'a pas été trouvé, ALORS je renvoye une erreur 404
    if (!holi) {
      return next(new AppError("Sorry, there is no holi with that name.", 404));
    }

    // 3) J'envoi la reponse de la page holi en tant que réponse HTTP avec des paramètres
    res.status(200).render("holi", {
      title: `${holi.name} Holi`,
      holi,
    });
  }),
  getLoginForm: (req, res) => {
    res
      .status(200)
      .set(
        "Content-Security-Policy",
        "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js 'unsafe-inline' 'unsafe-eval';"
      )
      .render("login", {
        title: "log into your account",
      });
  },
  // Reset Password
  getResetPassForm: (req, res) => {
    if (req.isLoggedIn) return res.redirect("/");
    res.status(200).render("reset_ask", {
      title: "Forget Password",
    });
  },
  getResetPassPatchForm: (req, res) => {
    if (req.isLoggedIn) return res.redirect("/");
    res.status(200).render("reset_patch", {
      title: "Reset Password",
    });
  },
  getSignUpForm: (req, res) => {
    res
      .status(200)
      .set(
        "Content-Security-Policy",
        "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js 'unsafe-inline' 'unsafe-eval';"
      )
      .render("signup", {
        title: `Create New Account`,
      });
  },
  getAccount: (req, res) => {
    res
      .status(200)
      .set(
        "Content-Security-Policy",
        "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js 'unsafe-inline' 'unsafe-eval';"
      )
      .render("account", {
        title: "Your account",
      });
  },
  updateUserData: catchAsync(async (req, res, next) => {
    // console.log("UPDATE", req.body);
    const updatedUser = await Users.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(updatedUser);
    res.status(200).render("account", {
      title: "Your account",
      user: updatedUser,
    });
  }),
  getMyHolis: catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find holis with the returned IDs
    const holiIDs = bookings.map((el) => el.holi);
    const holis = await Holi.find({ _id: { $in: holiIDs } });

    res.status(200).render("overview", {
      title: "My holis",
      holis,
    });
  }),
  delete: catchAsync(async (req, res) => {
    res.status(200).render("overview");
  }),
};

module.exports = viewController;
