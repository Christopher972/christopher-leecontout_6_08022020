const express = require('express'); /// Importation de l'application express
const router = express.Router(); //// Création du Routeur

const auth = require('../middleware/auth'); //// Importation du middleware d'authentification 
const multer = require('../middleware/multer-config'); //// Importation du middleware multer

const sauceCtrl = require('../controllers/sauce');////// Importation de la logique métier ddes routes 

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router; //// Exportation du router du fichier 











