// 1) Je définis une fonction appelée "hideAlert" qui ne prend pas d'arguments.
export const hideAlert = () => {
  // 2) Je sélectionne un élément du DOM avec la classe 'alert'.
  const el = document.querySelector('.alert');

  // 3) Je vérifie si un élément a été trouvé.
  if (el) {
    // Je supprime l'élément 'el' de son parent, le retirant ainsi de la page.
    el.parentElement.removeChild(el);
  }
}


export const showAlert = (type, msg) => {
  // 1) J'appelle la fonction "hideAlert" pour supprimer toute alerte précédente.
  hideAlert();

  // 2) Je crée un morceau de code HTML (markup) pour afficher l'alerte avec la classe correspondant à son type.
  const markup = `<div class="alert alert--${type}">${msg}</div>`

  // 3) J'insère le code HTML "markup" en tant que premier élément dans le body de la page.
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)

  // 4) Je programme une fonction pour masquer l'alerte après 5 secondes (5000 millisecondes).
  window.setTimeout(hideAlert, 5000);
}


