<h1 align="center">
  <br>
  <a href="#"><img src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/bd0b56b8-e673-43d4-897b-9f48a8647c28" alt="Holibody" width="300"></a>
  <br>
  Holibody
  <br>
</h1>

<h4 align="center">An awesome Holi booking site built on top of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

# Table of Contents
<img align="right" alt="GIF" height="250px" src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" /> 
- <a href="#key-features">Key Features</a><br>
- <a href="#demonstration">Demonstration</a><br>
- <a href="#how-to-use">How To Use</a><br>
- <a href="#api-usage">API Usage</a><br>
- <a href="#deployment">Deployment</a><br>
- <a href="#build-with">Build With</a><br>
- <a href="#to-do">To-do</a><br>
- <a href="#installation">Installation</a><br>
- <a href="#known-bugs">Known Bugs</a><br>
- <a href="#future-updates">Future Updates</a><br>


## Key Features 📝
* Authentication and Authorization
  - Sign up, Log in, Logout, Update, and reset password.
    
* User profile
  - Update username, photo, email, password, and other information
  - A user can be either a regular user or an admin or a lead coach or a coach.
  - When a user signs up, that user by default regular user.
    
* Holi
  - Manage booking, check Holi map, check users' reviews and rating
  - Holis can be created by an admin user or a lead-coach.
  - Holis can be seen by every user.
  - Holis can be updated by an admin user or a lead coach.
  - Holis can be deleted by an admin user or a lead-coach.
    
* Bookings
  - Only regular users can book Holis (make a payment).
  - Regular users can not book the same Holi twice.
  - Regular users can see all the Holis they have booked.
  - An admin user or a lead coach can see every booking on the app.
  - An admin user or a lead coach can delete any booking.
  - An admin user or a lead coach can create a booking (manually, without payment).
  - An admin user or a lead coach can not create a booking for the same user twice.
  - An admin user or a lead coach can edit any booking.
    
* Reviews
  - Only regular users can write reviews for Holis that they have booked.
  - All users can see the reviews of each Holi.
  - Regular users can edit and delete their own reviews.
  - Regular users can not review the same Holi twice.
  - An admin can delete any review.

## Demonstration 🖥️

#### Welcome Page :
<img width="556" alt="Welcome-Page 2023-10-28 141854" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/eabd6f26-4d9c-42d3-856a-53c231153c5c">

#### Home Page :
<img width="544" alt="Home-Page 2023-10-28 142007" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/13e8541e-583e-43c0-9575-0ae7b4802d28">

#### Holi Details :
<img width="528" alt="Holi-Details 2023-10-28 142331" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/1b75ec23-1981-4ade-8107-a3acb4c5b162">

#### Payment Process :
<img width="654" alt="Payment-Process 2023-10-28 143918" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/30ec9e12-a3ed-4055-a515-9ae30496f6c4">

#### Login :
<img width="543" alt="Login 2023-10-28 142042" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/1b9e049f-6cf7-43bc-a84d-90c3f1a628a6">

#### Signup :
<img width="559" alt="Capture d'écran 2023-10-28 142139" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/06d95e4c-766d-45c4-b258-90be1d8cbd92">

#### User Profile :
<img width="509" alt="User-profil 2023-10-28 142519" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/bdf5d7c5-1582-477e-a3c5-b140982c26db">

#### Admin Profile :
<img width="507" alt="Admin-Profil 2023-10-28 143323" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/07839d3e-1669-4239-b779-4df6ce4d153b">

#### Home Tablet :
<img width="509" alt="Home-Tablet 2023-10-28 143127" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/bac0a9dc-5ec5-4366-a458-607abe37c2f8">

#### Home Mobile :
<img width="259" height="420" alt="Home-Mobile 2023-10-28 143040" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/30f96b2d-6985-4bcb-bcc1-26e942276f46">

#### Holi Mobile :
<img width="258" height="450" alt="Holi-Mobile 2023-10-28 143002" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/fffeef8a-a15f-4921-aef2-0b895154f31c">

#### Menu Mobile :
<img width="262" height="420" alt="Menu-Mobile 2023-10-28 142828" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/fd0ab575-aceb-4837-be77-c92c06231586">

#### Account User Mobile :
<img width="258" height="420" alt="Capture d'écran 2023-10-28 142916" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/768a57ba-e6e0-4770-b1d3-5b6e0f2d0245">


## How To Use 🤔

### Book a Holi
* Login to the site
* Search for Holis that you want to book
* Book a Holi
* Proceed to the payment checkout page
* Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 24
  - CVV: 222
  ```
* Finished!



### Manage your booking

* Check the Holi you have booked on the "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

* You can update your own username, profile photo, email, and password.



## API Usage
Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add: 
  ```
  - {{URL}} with your hostname as value (Eg. http://127.0.0.1:8000 or http://www.example.com)
  - {{password}} with your user password as value.
  ```

Check [Holibody API Documentation](https://documenter.getpostman.com/view/27249149/2s9YR6ZZMS) for more info.

<img width="549" alt="Capture d'écran 2023-10-27 183201" src="https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/5d5de957-b326-42df-896f-9198a88f13fb">


## Deployment 🌍
The website is deployed with Render.

## Build With 🏗️

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
* [JSON Web Token](https://jwt.io/) - Security token
* [ParcelJS](https://parceljs.org/) - Blazing fast, zero configuration web application bundler
* [Stripe](https://stripe.com/) - Online payment API and Making payments on the app.
* [Postman](https://www.getpostman.com/) - API testing
* [Mailtrap](https://mailtrap.io/) & [Sendgrid](https://sendgrid.com/) - Email delivery platform
* [Render](https://www.render.com/) - Cloud platform




## To-do 🗒️

* Review and rating
  - Allow users to add a review directly at the website after they have taken a Holi
* Booking
  - Prevent duplicate bookings after a user has booked that exact Holi, implement favorite Holis
* Advanced authentication features
  - Signup, confirm user email, log in with refresh token, two-factor authentication
* And More! There's always room for improvement!

## Setting Up Your Local Environment ⚙️

If you wish to play around with the code base in your local environment, do the following

```
* Clone this repo to your local machine.
* Using the terminal, navigate to the cloned repo.
* Install all the necessary dependencies, as stipulated in the package.json file.
* If you don't already have one, set up accounts with: MONGODB, STRIPE, SENDGRID, and MAILTRAP. Please ensure to have at least basic knowledge of how these services work.
* In your .env file, set environment variables for the following:

    * DATABASE=your Mongodb database URL
    * DATABASE_PASSWORD=your MongoDB password

    * SECRET=your JSON web token secret
    * JWT_EXPIRES_IN=90d
    * JWT_COOKIE_EXPIRES_IN=90

    * EMAIL_USERNAME=your mailtrap username
    * EMAIL_PASSWORD=your mailtrap password
    * EMAIL_HOST=smtp.mailtrap.io
    * EMAIL_PORT=2525
    * EMAIL_FROM=your real-life email address

    * SENDGRID_USERNAME=apikey
    * SENDGRID_PASSWORD=your sendgrid password

    * STRIPE_SECRET_KEY=your stripe secret key
    * STRIPE_WEBHOOK_SECRET=your stripe webhook secret

* Start the server.
* Your app should be running just fine.
```

#### Demo-`.env` file :
![demo-env-file](https://github.com/BoudharIssam/Holibody-Project-TP/assets/117824364/04846ffe-b3e6-4e64-a7ba-db5cf0d40c07)


## Installation 🛠️
You can fork the app or you can git-clone the app into your local machine. Once done, please install all the
dependencies by running
```
$ npm i
Set your env variables
$ npm run watch:js
$ npm run build:js
$ npm run dev (for development)
$ npm run start:prod (for production)
$ npm run debug (for debug)
$ npm start

```

## Contributing 💡
Pull requests are welcome but please open an issue and discuss what you will do before 😊

## Known Bugs 🚨
Feel free to email me at issam.boudhar@gmail.com if you run into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

## Future Updates 🪴

* Enable PWA
* Improve overall UX/UI and fix bugs
* Featured Holis
* Recently Viewed Holis
* And More! There's always room for improvement!

## Deployed Version 🚀
Live demo (Feel free to visit) 👉🏻 : https://Holibody.onrender.com/

## License 📄
This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).
