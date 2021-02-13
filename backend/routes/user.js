const express = require('express');///// Importation de l'application express
const router = express.Router();//// création du routeur 

const userCtrl = require('../controllers/user');//// Importation de la logique métier des routes 

router.post('/signup', userCtrl.signup);//// Segment final de la route 
router.post('/login', userCtrl.login);//// Segment final de la route 

module.exports = router;