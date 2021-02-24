const bcrypt = require('bcrypt');//// Imporation du package bcrypt 
const User = require('../models/User');///// Importation du modèle schéma User
const jwt = require('jsonwebtoken');//// Importation du package jsonwebtoken 

require('dotenv').config();/// Importation fichier de configuation 

//// Création de nouveaux utilisateurs /////

let regexEmail =  /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z{2,8})(\.[a-z]{2,8})?$/;
let regexPassword =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/; // Sécurisation: 8 caractères, une maj, une min , un chiffre

exports.signup = (req, res, next) => {
  if(((req.body.email).match(regexEmail))&&(req.body.password).match(regexPassword)){
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token:jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h'})
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
