const jwt = require('jsonwebtoken');///// Importation du package jsonwebtoken 

require('dotenv').config(); /// Importation fichier de configuation 

module.exports = (req, res, next) => {
  try {
        const token = req.headers.authorization.split(' ')[1];/// Extraction du token du header Authorization de la requête entrante
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);////Utilisation de la fonction verify pour décoder le token 
        const userId = decodedToken.userId; //// Extraction de l'ID utilisateur du token 
        if (req.body.userId && req.body.userId !== userId) {//// Comparaison ID utilisateur et celui extrait du token 
            throw 'Invalid user ID';
        } else {
            next();
        }
    } 
    catch {
        res.status(401).json({
            error: new Error('Token non valide!')
        });
    }
};