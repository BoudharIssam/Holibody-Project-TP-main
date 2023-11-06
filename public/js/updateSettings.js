import { showAlert } from './alerts';
import axios from "axios";

// 1) Fonction pour mettre à jour les paramètres de l'utilisateur (mot de passe ou autres).
export const updateSettings = async (data, type) => {
  // 2) Gestion d'une opération asynchrone, donc j'utilise "async".
  try {
    // 3) Je détermine l'URL en fonction du type de mise à jour (mot de passe ou updateMe).
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    // 4) J'effectue une requête PATCH à l'URL spécifiée avec les données fournies.
    const res = await axios({
      method: 'PATCH', // Méthode HTTP PATCH pour la mise à jour.
      url, // URL déterminée précédemment.
      data, // Les données à envoyer pour la mise à jour.
    });

    // 5) SI la réponse indique que la mise à jour a réussi, ALORS j'affiche une alerte de succès.
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }

  } catch (err) {
    // 7) En cas d'erreur, affiche une alerte d'erreur avec le message d'erreur de la réponse.
    showAlert('error', err.response.data.message);
  }
};
