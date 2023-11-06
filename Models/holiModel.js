//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const slugify = require('slugify');

//------------------- MODEL SCHEMA HOLI -----------------------
const holiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A holi must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A holi must have less or equal then 40 characters"],
      minlength: [10, "A holi must have more or equal then 10 characters"],
    },
    slug: String, //$ CHAMP SLUG
    duration: {
      type: Number,
      required: [true, "A holi must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A holi must have a droup size"],
    },
    difficulty: {
      type: String,
      required: [true, "A holi must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, 
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A holi must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A holi must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A holi must have a cover image"],
    },
    images: [
      {
        type: String,
      },
    ],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    location: {
      type: { type: String },
      description: String,
      name: String,
      address: String,
    },

    coach: [
      {
        // Définition du type de schéma, toujours un objet
        type: mongoose.Schema.ObjectId,
        ref: "User", // Le plus important, c'est de spécifier la référence. C'est là que la magie opère en coulisse, car ici maintenant, on dit que la référence doit être "utilisateur".
      },
    ],
  },
  {
    //* OBJECT OPTIONS SCHEMA
    toJSON: { virtuals: true }, // Chaque fois que les données sorte en tant que "JSON" =>  Je veux que "virtuals soit true" ce qui signifie que je veux que virtuel fasse partie du document sortant.
    toObject: { virtuals: true }, // pareil que JSON AUDESSUS
  }
);
holiSchema.index({ slug: 1 });

holiSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//-------------- MONGOOSE VIRTUAL POPULATE ----------------------
holiSchema.virtual("reviews", {
  // J'appelle ma fonction "reviews"
  ref: "Review", // cette fonction virtuelle sera liée au modèle 'Review' ce qui permettra de récupérer des données du modèle 'Review'.
  foreignField: "holi",
  localField: "_id",
});

//------------------- MONGOOSE QUERY MIDDLEWARE   ----------------
// MONGOOSE MIDDLEWARE (Est un middleware qui peut agir sur le document en cours de traitement )

holiSchema.pre(/^find/, function (next) {
  this.populate({
    path: "coach",
    select: "-__v -passwordChangedAt", // je ne souhaite pas afficher les champs: "__v" et "passwordChangeAt"
  });
  next();
});

//------------------- CLOSE SCHEMA & ACTIVE MODEL ----------------
const Holi = mongoose.model("Holi", holiSchema);
module.exports = Holi;
