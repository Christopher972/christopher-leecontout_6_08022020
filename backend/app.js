const express = require('express'); /// Importation du framework express
const bodyParser = require('body-parser');/// Importation du package body-parser
const mongoose = require('mongoose'); //// Importation du package Mongoose
const mongoSanitize = require('express-mongo-sanitize'); /// Importation du package sanitize
const helmet = require('helmet');// Importation du package Helmet 

const path = require('path'); ///// Importation de path pour donner accès au chemin du système de fichiers 

const sauceRoutes = require('./routes/sauce'); //// Importation du Router Sauce 
const userRoutes = require('./routes/user'); ///// Importation du Router user 

require('dotenv').config();//// Importation fichier de configuation 

/// Pour connecter l'API à la base de données///

mongoose.connect(process.env.DB_URI_DEV,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); /// accéder à l'API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');////Ajout des headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// Pour envoyer des requêtes avec les méthodes mentionnées 
    next();
});

app.use(bodyParser.json()); /// Transformation du corps de la requête en objet json 

app.use(mongoSanitize()); /// Protection contre les attaques d'injections NoSQL
app.use(helmet()); /// Sécurisation des en-têtes HTTP
app.use('/images', express.static(path.join(__dirname, 'images')));///  Gestionnaire de routage 

app.use('/api/sauces', sauceRoutes);/// enregistrement du routeur pour toutes le demandes effectuées vers /api/sauces
app.use('/api/auth', userRoutes );/// enregistrement du routeur pour toutes les demandes efectuées vers /api/users 

module.exports = app;