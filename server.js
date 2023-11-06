//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//----------- UNCAUGHT EXCEPTION ERROR ----------------

// uncaught exception => Sont toutes les erreurs(bugs) qui se produisent dans mon code synchrone mais qui ne sont gérées nulle part. On les appelle des exceptions non interceptées .
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ⛔ Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
})

console.log('SERVER')

//------------------- HANDLERS FOLDERS -----------------------
const app = require("./app");
console.log(app.get("env"));

//------------------- CONNECT DATABASE -----------------------
mongoose
  // .connect(process.env.DATABASE_LOCAL)
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("✅ DB connection successful ✅ GOOD JOB !");
  });

//----------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port http://127.0.0.1:${PORT}`);
  // console.log(`Listening on port ${PORT} in the ${process.env.NODE_ENV} mode`)
});

//----------- UNHANDLER REJECTION ERROR ----------------

// A chaque fois qu'il y a un rejet non géré quelque part dans mon application, "process"(object) émettra un objet appelé "unhandledRejection" et je peux donc souscrire à cet événement.
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION! ⛔ Shutting down...");

  // Si j'ai un problème avec la connexion à la base de données par exemple, alors mon application ne fonctionnera plus. Je prépare donc une fermeture programmée.

  // server.close => donne au serveur le temps de terminer toutes les requetes encore en attente ou en cours de traitement, et seulement après cela, le serveur eteint tout.
  server.close(() => {
    // process.exit => ferme mon application et ❗annuelera toutes les requetes en cours d'exécution❗
    // code: 1 = exception non capturée
    process.exit(1);
  });
});

