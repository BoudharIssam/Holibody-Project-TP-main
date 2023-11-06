import axios from "axios";
import { showAlert } from './alerts';
console.log('LOGIN.JS')
// 1) Je définis une fonction asynchrone appelée "login" qui prend comme arguments "email" et "password".
export const login = async (email, password) => {
  try {
    
    // 2) Je récupère la réponse d'axios après avoir envoyé une requête POST au serveur avec.
    const res = await axios({
      method: "POST", // Méthode de la requête HTTP (POST).
      url: "/api/v1/users/login", // URL de destination de la requête.
      data: {
        email,
        password,
        // Les données à envoyer au serveur, comprenant l'email et le mot de passe.
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/holis');
      }, 100);
    }

    // 3) J'affiche en cas de problème les détails de la réponse du serveur (utile pour le débogage).
  } catch (err) {
    // En cas d'erreur, j'affiche le message reçu de la réponse d'erreur du serveur avec AXIOS(err.response.data).
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  // console.log(email, password)
  try {
    // console.log(login)
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);
    
    
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};