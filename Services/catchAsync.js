
// fonction middleware appelée "catchAsync"  =>  return fn(resultat et status(200)) ou catch(next => middleware global des erreurs)
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
// En résumé, ce middleware "catchAsync" est utile pour encapsuler des fonctions asynchrones dans des routes Express. Il capture les erreurs générées par ces fonctions et les transmet au middleware global de gestion des erreurs ou renvoie une réponse avec un statut 200 si tout se passe bien. Cela contribue à rendre le code plus propre et à éviter les blocages potentiels de l'application dus à des erreurs non gérées.

