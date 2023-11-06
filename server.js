//------------------- MODULES -----------------------
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//----------- UNCAUGHT EXCEPTION ERROR ----------------

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ⛔ Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
})

//------------------- HANDLERS FOLDERS -----------------------
const app = require("./app");
console.log(app.get("env"));

//------------------- CONNECT DATABASE -----------------------
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("✅ DB connection successful ✅ GOOD JOB !");
  });

//----------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in the ${process.env.NODE_ENV} mode`)
});

//----------- UNHANDLER REJECTION ERROR ----------------

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION! ⛔ Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

