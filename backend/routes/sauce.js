const express = require('express'); /// Importation de l'application express
const router = express.Router(); //// Création du Routeur

const auth = require('../middleware/auth'); //// Importation du middleware d'authentification 
const multer = require('../middleware/multer-config'); //// Importation du middleware multer

const sauceCtrl = require('../controllers/sauce');////// Importation de la logique métier ddes routes 

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router; //// Exportation du router du fichier 











