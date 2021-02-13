const mongoose = require('mongoose');///// Importation du package Mongoose
const uniqueValidator = require('mongoose-unique-validator'); //// Importation du package mongoose-unique-validator

const userSchema = mongoose.Schema({///// Création d'un schéma de données 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);///// Adresse email unique 
module.exports = mongoose.model('User', userSchema);///// Exportation du schéma en tant que modèle mongoose
