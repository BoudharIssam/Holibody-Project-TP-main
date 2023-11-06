// Ce code définit une fonction `resizeImage` qui redimensionne une image et permet de l'afficher dans un élément HTML cible.
// La fonction 'resizeImage' prend une image, des dimensions cibles et un élément cible en option.
export const resizeImage = (
  image,                  // L'image source à redimensionner.
  targetWidth,            // Largeur cible de l'image redimensionnée.
  targetHeight,           // Hauteur cible de l'image redimensionnée.
  targetElement = undefined  // Élément HTML (optionnel) où afficher l'image redimensionnée.
) => {
  let data;  // Stockage des données de l'image redimensionnée.

  // Création d'une instance de FileReader pour lire le contenu de l'image.
  const filerdr = new FileReader();

  // Lorsque le contenu de l'image est lu, cette fonction est appelée.
  filerdr.onload = (evt) => {
    const img = new Image();  // Création d'une instance d'image.

    // Lorsque l'image est chargée, cette fonction est appelée.
    img.onload = () => {
      // Création d'un élément canvas pour redimensionner l'image.
      const canvas = document.createElement("canvas");

      // Obtention du contexte 2D du canvas.
      const ctx = canvas.getContext("2d");

      // Configuration des dimensions du canvas.
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      let startWidth;
      let startHeight;
      let width;
      let height;

      // Calcul des dimensions de l'image redimensionnée en fonction de ses proportions.
      if (img.height > img.width) {
        startWidth = 0;
        startHeight = (img.height - img.width) / 2;
        width = img.width;
        height = img.width * (targetHeight / targetWidth);
      } else {
        startWidth = (img.width - img.height) / 2;
        startHeight = 0;
        width = img.height * (targetWidth / targetHeight);
        height = img.height;
      }

      // Redimensionnement de l'image en utilisant le contexte 2D du canvas.
      ctx.drawImage(
        img,
        startWidth,  // Point de départ de la découpe en largeur
        startHeight, // Point de départ de la découpe en hauteur
        width,       // Largeur découpée
        height,      // Hauteur découpée
        0,           // Point de départ du canvas en largeur
        0,           // Point de départ du canvas en hauteur
        targetWidth, // Largeur du résultat
        targetHeight  // Hauteur du résultat
      );

      // Conversion de l'image redimensionnée en une URL base64.
      data = canvas.toDataURL("image/jpeg");

      // Si un élément cible est fourni, affichez l'image redimensionnée.
      if (targetElement) targetElement.src = data;
    };

    // Chargement de l'image à partir des données lues par FileReader.
    img.src = evt.target.result;
  };

  // Lecture de l'image source en tant qu'URL base64.
  filerdr.readAsDataURL(image);

  // Renvoie l'URL base64 de l'image redimensionnée.
  return data;
};





