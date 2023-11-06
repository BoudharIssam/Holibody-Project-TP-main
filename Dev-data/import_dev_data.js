//------------------- MODULES -----------------------
const fs = require('fs');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Holi = require("../Models/holiModel");
const User = require('../Models/userModel');
const Review = require('../Models/reviewModel');

//------------------- CONNECT DATABASE -----------------------
mongoose
  // .connect(process.env.DATABASE_LOCAL)
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("✅ DB connection successful ✅ GOOD JOB !");
  })
  .catch((error) => console.error("⛔ Error Mongoose Connect DB ⛔", error));

//------------------- IMPORT FILE TO DATABASE -----------------------

// READ JSON FILE

const holis = JSON.parse(fs.readFileSync(`${__dirname}/holis.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Holi.create(holis); 
    await User.create(users, {validateBeforeSave: false}); 
    await Review.create(reviews); 
    console.log('DATA SUCCESSFULLY LOADED IN DB FROM DE JSON FILE!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); 
};

//------------------- DELETE ALL DATA FROM DATABASE -----------------------

const deleteData = async () => {
  try {
    await Holi.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('All documents is delete from the DB');
  } catch (err) {
    console.log(err);
  }
  process.exit(); 
};

//------------------- OPTION IMPORT OR DELETE -----------------------
console.log(process.argv);

//* process.argv 

//* process.argv[0] => node === 'C:\\Program Files\\nodejs\\node.exe'

//* process.argv[1] => dev-data/data/import_dev_data.js === 'C:\\Users\\DELL\\OneDrive\\Bureau\\TITRE PRO 2023\\Holibody-Project-TP\\dev-data\\data\\import_dev_data.js' 

//* process.argv[3] === --import ou --delete

if (process.argv[2] === '--import') {
  // SI DANS LE TERMINAL => node dev-data/import_dev_data.js --import
  importData();
} else if (process.argv[2] === '--delete') {
  // SI DANS LE TERMINAL => node dev-data/import_dev_data.js --delete
  deleteData();
}
