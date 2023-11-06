//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const slugify = require('slugify');
// Le module slugify est une bibliothèque qui permet de convertir une chaîne de caractères en une version simplifiée et adaptée à une URL. Par exemple, il peut convertir une chaîne comme "Hello World" en "hello-world", ce qui est plus adapté pour une utilisation dans une URL.
// EX: let title = "Hello World"; let slug = slugify(title); console.log(slug); // Affiche : "hello-world"
// Dans cet exemple, le module slugify est utilisé pour convertir la chaîne "Hello World" en un slug "hello-world" à l'aide de la fonction slugify().
// const User = require('./userModel')

console.log('HOLI MODEL')
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
      set: (val) => Math.round(val * 10) / 10, //? set => callback fonction va être exécuté chaque fois qu'il y a une nouvelle valeur pour "ratingAverage".
      // val => valeur actuel
      // Math.round => val(4.6666) = 5 ⛔ le probleme de Math.round c'est qu'il arrondit le nombre en ENTIER alors que je ne veux pas l'arrondir autanT mais plutot 4.6666 a 4,7 ✅,
      // Je dois alors le multiplier "val" par 10 et ensuite le Math.round fait sont travail et arrondit, et ensuite encore diviser son resultat. EX: (4.66666 * 10 = 46,6666) =>  Math.round = 47 => 47/10 => "4,7" ✅✅✅
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
      // Ce champ sera un sous-document qui sert à stocker juste la "référence" (les identifiants des utilisateurs) dans un tableau.
      // mongoose.Schema.ObjectId => cela signifie que j'attends à ce qu'un type de chacun des éléments du tableau coach soit un "ID" MongoDB.
      {
        // Définition du type de schéma, toujours un objet
        type: mongoose.Schema.ObjectId,
        ref: "User", // Le plus important, c'est de spécifier la référence. C'est là que la magie opère en coulisse, car ici maintenant, on dit que la référence doit être "utilisateur".
      },
    ],
  },
  {
    //* OBJECT OPTIONS SCHEMA
    //Cela ne fait que s'assurer que lorsque j'ai une propriété virtuelle, il s'agit essentiellement d'un champ qui n'est pas stocké dans la base de données mais calculé à l'aide d'une autre valeur. Je veux donc que cela apparaisse également chaque fois qu'il y a une sortie.
    // Je definis ici que je souhaite utiliser les "propriétés virtuelles" dans mon schéma
    toJSON: { virtuals: true }, // Chaque fois que les données sorte en tant que "JSON" =>  Je veux que "virtuals soit true" ce qui signifie que je veux que virtuel fasse partie du document sortant.
    toObject: { virtuals: true }, // pareil que JSON AUDESSUS
  }
);
holiSchema.index({ slug: 1 });

//* MONGOOSE MIDDLEWARE DOCUMENT (Est un middleware qui peut agir sur le document en cours de traitement )
//£ this => point vers le document actuel
//£ PRE MIDDLEWARE FUNCTION
//? .pre() => PRE MIDDLEWARE ou PRE HOOK => sera exécuter avant qu'un évenement actuel ne soit enregistré dans la base de données. évenement => 'save'
//? .pre() s'exécute donc avant et seulement sur les commande mongoose .save() et .create() utiliser dans les controllers
holiSchema.pre('save', function (next) {
  // cet function sera appelé avant qu'un document ne soit enregistré dans la base de données
  //?🔍🔍🔍🔍 console.log(this) // NE PAS OUBLIER QUE THIS EST LE "DOCUMENT TRAITER" PAR LA REQUETE POST CREATE TOUR
  // Dans un middleware save le mot-clé "this" va pointer vers le document en cours de traitement. C'est la raison pour laquelle on l'appelle un "middleware document". Parce que dans cette la fonction ou l'on ce trouve on a accès aux documents qui est en cours de traitement, c'est à dire le document qui est entrain d'être save(enregistré).
  this.slug = slugify(this.name, { lower: true });
  //? je definit une nouvelle propriete sur "this" avec ".slug" en utilisant slugify() pour creer un CHAMP "SLUG" avec la valeur de this.name et une option lowercase pour convertir la valeur en minuscule.
  //£ Il ne faut pas oublier à la fin de rajouter le champ "slug" dans le schéma holiSchema.
  //Si j'oublie le next() je reste bloqué à l'intérieur du middleware et rien ne se passera .
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

// J'utilise un middleware de requête pour exécuter automatiquement ce code à chaque fois qu'une requête est effectuée. Cela m'évite d'avoir à répéter ce code dans plusieurs contrôleurs.
// `/^find/` j'utilise une expression régulière pour cibler toutes les requêtes qui commencent par "find".
// L'utilisation de `this` fait référence à la requête actuellement en cours.
// Ensuite, j'utilise `populate` pour remplir le champ 'coach' avec les données des coachs. L'option `select` est utilisée pour exclure les champs '__v' et 'passwordChangeAt' des résultats, car je ne souhaite pas les afficher.

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
