//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//------------------- MODEL SCHEMA HOLI -----------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    match: [
      new RegExp(/^[a-zA-Z\s]+$/),
      '{VALUE} is not valid. Please use only letters'
    ]
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ["user", "coach", "lead-coach", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please check your password"],
    validate: {
      // Je vérifie si "passwordConfirme" est bien strictement égal à "password" .
      // Cette fonction ne fonctionnera que sur "create" and "save" dans les controller.
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetJeton: String, // je creer ce champ pour enregistrer le jeton de réinitialisation afin de comparer avec le jeton fourni par l'utilisateur
  passwordResetJetonExpires: Date, // Par mesure de sécurité je creer ce champ pour que le jeton de réinitialisation enregistrer en DB expire et ne soit pas réutilisable .
});

//------------------- MONGOOSE MIDDLEWARE DOCUMENT  ----------------
// MONGOOSE MIDDLEWARE DOCUMENT (Est un middleware qui peut agir sur le document en cours de traitement )

userSchema.pre("save", async function (next) {
  // Si le mot de passe n'a pas été modifié sort de cette fonction et appel le middleware suivent.
  if (!this.isModified("password")) return next();
  // Sinon tu exécutes le code ci dessous .
  // Je souhaite modifier la "valeur" de la clé "password" qui ce trouve dans "this"(le document actuel). "12" représente le niveau de cryptage
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//------------------- INSTANCE METHOD (disponible ensuite dans tous les documents d'une certaine collection) ----------------
userSchema.methods.correctPassword = async function (
  userLoginPassword,
  userPasswordDB
) {
  return await bcrypt.compare(userLoginPassword, userPasswordDB);
};

//--------------------------------------------------------------

// 1) Je donne comme nom a cette méthode "changedPasswordAfter"
// 2) Et je lui passe en paramètres l'horodatage JWT qui indique quand le jeton a été émis. Et je lui donne comme nom "JWTTimestamp"
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // 3) "SI" la propriété "passwordChangedAt" existe "ALORS" je fais la comparaison.
  if (this.passwordChangedAt) {
    // 4) Je compare l'horodatage passwordChangedAt et l'horodatage du jeton JWT.
    // console.log(this.passwordChangedAt, JWTTimestamp);

    // 5) Il faut que je convertisse le format date de "passwordChangedAt" en millisecondes.
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // 6) Je compare à nouveau
    // console.log(changedTimestamp, JWTTimestamp);

    // 7) S'il l'utilisateur a changé son mot de passe alors l'horodatage du jeton JWT est inferieure a changedTimestamp
    return JWTTimestamp < changedTimestamp;
  }
  // Par défaut je retourne false cela signifiera alors que l'utilisateur n'a pas changé son mot de passe après avoir reçu son token.
  return false;
};

//--------------------------------------------------------------

userSchema.methods.createPasswordResetToken = function () {
  //1️⃣ Je génère mon token en utilisant "crypto" => utilise la fonction "randomBytes(32)" en spécifiant le nombre de caractères "(32)" => Je convertis ensuite ce résultat en string hexadecimale avec "toString('hex')"
  const resetJeton = crypto.randomBytes(32).toString("hex");

  //2️⃣ Une fois le jeton crypté je l'enregistre en DB => Dans le CHAMP "passwordResetJeton"
  this.passwordResetJeton = crypto
    .createHash("sha256")
    .update(resetJeton) // J'indique la variable que je veux crypter => En l'occurrence le jeton .
    .digest("hex"); // Et j'indique que je souhaite stocker la valeur en forme hexadécimale .

  console.log({ resetJeton }, `JETON CRYPTER DB : ${this.passwordResetJeton}`);

  //3️⃣ Une fois le jeton crypté et enregistrer en DB => Je crée un temps d'expiration de "10 minutes"
  this.passwordResetJetonExpires = Date.now() + 10 * 60 * 1000;

  //4️⃣ Je récupère le résultat que je souhaite envoyer à l'utilisateur => "le jeton non crypté" .
  return resetJeton;
};

//------------------- CLOSE SCHEMA & ACTIVE MODEL ----------------

const User = mongoose.model("User", userSchema);

module.exports = User;
