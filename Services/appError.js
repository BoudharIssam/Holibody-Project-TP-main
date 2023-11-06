// Je définis la classe "AppError" en relation d'héritage avec la classe intégrée "Error".
class AppError extends Error {
  //THis is for operational errors
  constructor(message, statusCode) {
    // Appelez le constructeur parent en passant le message à la classe "Error".
    super(message);

    //----- Ci dessous les propriétés du message ------------

    // Je définis le statusCode sur la valeur fournie.
    this.statusCode = statusCode;

    // Je détermine le statut (échec ou erreur) en fonction du statusCode.
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Je définis la propriété "opérationnel" sur true pour indiquer que c'est une erreur opérationnelle.
    // Donc toutes les erreurs créées par ma moi seront des erreur opérationnelles .
    this.isOperational = true;
    
    // Capturez la trace de la pile, en excluant l'appel à cette classe dans la pile.
    Error.captureStackTrace(this, this.constructor);
  }
}
// J'exporte la classe "AppError" pour l'utiliser ailleurs dans mon application.
module.exports = AppError;

