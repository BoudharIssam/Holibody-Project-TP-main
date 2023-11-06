//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const Holi = require("./holiModel");

//------------------- MODEL SCHEMA HOLI -----------------------
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty."],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    //REFERENCEMENT PARENT
    // maintenant chaque document Review sait exactement à quelle tour il appartient.
    holi: {
      type: mongoose.Schema.ObjectId,
      ref: "Holi",
      required: [true, "Review must belong to a holi."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    //* OBJECT OPTIONS SCHEMA
    toJSON: { virtuals: true }, // Chaque fois que les données sorte en tant que "JSON" =>  Je veux que "virtuals soit true" ce qui signifie que je veux que virtuel fasse partie du document sortant.
    toObject: { virtuals: true }, // pareil que JSON AUDESSUS
  }
);

// Je veux qu'un utilisateur ne puisse écrire qu'un seul avis dans chaque holi
reviewSchema.index({ holi: 1, user: 1}, {unique: true})

//-------------- MONGOOSE MIDDLEWARE DOCUMENT (Est un middleware qui peut agir sur le document en cours de traitement )

// Je m'assure que les avis soit remplis avec les données des Holis et des utilisateurs à chaque requête.
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user", // "user" fait référence au champ "user" du modèle.
    select: "name photo", // Sélectionnez les champs "name" et "photo".
  });
  next();
});

//------------- METHODE STATIC POUR UTILISER LA FUNCTION AGGREGATE SUR LE MODEL ---------------

reviewSchema.statics.calcAverageRatings = async function (holiId) {
  const stats = await this.aggregate([
    {
      $match: { holi: holiId }, // Je sélectionne l'élément qui "match" avec ma requête "holiId"
    },
    {
      $group: {
        _id: "$holi", // Correspond à l'id du holi actuel .
        nRatings: { $sum: 1 }, // Additionne le nombre d'avis entre eux pour le holi actuel
        avgRating: { $avg: "$rating" }, // Me donne la moyenne global des avis du champ "rating".
      },
    },
  ]);

  // "SI" il y a encore aucun avis à calculer tableau a zero valeur pour faire la moyenne "ALORS" en attendant je mets des valeurs par défaut .
  if (stats.length > 0) {
    // j'enregistre les resultat J'enregistre les résultats dans les champs 'ratingQuantity et 'ratingAverage' qui correspond dans le "holi model" .
    await Holi.findByIdAndUpdate(holiId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Holi.findByIdAndUpdate(holiId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  } 
};


//-------------- MONGOOSE MIDDLEWARE DOCUMENT

// Ensuite, afin d'utiliser cette la function calcAverageRatings, nous utiliserons un middleware pour appeler cette fonction chaque fois qu'il y a une nouvelle REVIEW ou une mise à jour ou supprimée,
reviewSchema.post("save", async function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.holi);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // j'utilise la query findOne pour avoir access au document dans la DB
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne() does NOT work here query has already executed
  await this.r.constructor.calcAverageRatings(this.r.holi);
});

//------------------- CLOSE SCHEMA & ACTIVE MODEL ----------------
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
