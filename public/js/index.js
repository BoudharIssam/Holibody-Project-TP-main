//----------- MODULE FILE ----------------
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { SendTokenEmail, resetPassword } from './resetPassword';
import { resizeImage } from "./resizeImage";
import { signup } from './signup';
import { bookHoli } from './stripe';

console.log('INDEX JS')
//----------- DOM ELEMENTS ----------------
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-holi');
const ResetButton = document.querySelector('#Reset');
const resetForm = document.querySelector('.form--reset');
const UpdatePassForm = document.querySelector('.form--updatePass');
const signupForm = document.querySelector('.form--signup');
// Sélection de l'élément d'input file pour le téléchargement de la photo de profil.
const uploadInput = document.getElementById("photo");

//----------- DELEGATION ----------------

// SI l'élément userDataForm existe
if (userDataForm) {
  // J'écoute l'événement de soumission du formulaire
  userDataForm.addEventListener("submit", (e) => {
    // J'empêche l'envoi du formulaire par défaut (rechargement de la page)
    e.preventDefault();

    // Je crée un nouvel objet FormData pour stocker les données du formulaire
    const form = new FormData();

    // J'ajoute le nom de l'utilisateur au FormData à partir de l'élément 'name' du formulaire
    form.append("name", document.getElementById("name").value);

    // J'ajoute l'e-mail de l'utilisateur au FormData à partir de l'élément 'email' du formulaire
    form.append("email", document.getElementById("email").value);

    // J'ajoute la photo de l'utilisateur au FormData à partir de l'élément 'photo' du formulaire
    form.append("photo", document.getElementById("photo").files[0]);

    // J'appelle la fonction 'updateSettings' en lui passant le FormData et le type 'data'
    updateSettings(form, "data");
  });
}

// Vérification de l'existence du formulaire userDataForm.
if (userDataForm) {
  // Écouteur d'événement sur le changement de l'input file.
  uploadInput.addEventListener("change", async (e) => {
    // Récupération de la première image sélectionnée.
    const inputPic = uploadInput.files[0];

    // Vérification si une image a été sélectionnée.
    if (inputPic) {
      // Sélection de l'élément HTML de la photo de profil.
      const userPhotoElement = document.querySelector(".form__user-photo");

      // Appel de la fonction 'resizeImage' pour redimensionner l'image à 500x500 pixels
      // et afficher le résultat dans l'élément de la photo de profil.
      resizeImage(inputPic, 500, 500, userPhotoElement);
    }
  });
}

// Gestion du formulaire de mise à jour du mot de passe
if (userPasswordForm) {
  // 6) Écouteur d'événements pour la soumission du formulaire (mot de passe)
  userPasswordForm.addEventListener("submit", async (e) => {
    // 7) J'empêche le rechargement de la page après la soumission du formulaire.
    e.preventDefault();

    // 8) Je modifie le texte du bouton pour indiquer la mise à jour.
    document.querySelector(".btn--save-password").textContent = "Updating...";

    // 9) Je récupère le mot de passe actuel.
    const passwordCurrent = document.getElementById("password-current").value;

    // 10) Je récupère le nouveau mot de passe.
    const password = document.getElementById("password").value;

    // 11) Je récupère la confirmation du mot de passe.
    const passwordConfirm = document.getElementById("password-confirm").value;

    // 12) J'appelle la fonction de mise à jour des paramètres avec les nouvelles données de  mot de passe.
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    // 13) Je rétablit le texte d'origine du bouton.
    document.querySelector(".btn--save-password").textContent = "Save password";

    // 14) Je réinitialise les champs du formulaire.
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email, password);
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { holiId } = e.target.dataset;
    bookHoli(holiId);
  });
}

if (resetForm) {
  resetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    SendTokenEmail(email);
    ResetButton.textContent = 'Processing...';
  });
}

if (UpdatePassForm) {
  UpdatePassForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    resetPassword(password, passwordConfirm);
    ResetButton.textContent = 'Processing...';
  });
}




