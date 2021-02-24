const Sauce = require('../models/Sauce');///// Importation du modèle schéma Sauce 
const fs = require('fs');///// Importation du package file-system


exports.createSauce = (req, res, next) => {////// Exportation de la route post 
    const sauceObject = JSON.parse(req.body.sauce); //// Récupération des informations de l'objet Sauce
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//// Pour générer l'Url de l'image
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée!'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {//// Exportation de la route put 
    const sauceObject = req.file ?//// création de l'objet sauce et utilisation d'un opérateur ternaire
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//// Traitement de la nouvelle image 
    } : { ...req.body }; //// traitement uniquement de l'objet
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//// mise à jour de l'objet dans la base de données
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => { ///// Exportation de la route delete
    Sauce.findOne({ _id: req.params.id }) /// Trouver l'objet dans la base de donnée
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; //// Extraction du nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {//// Suppression du fichier
                Sauce.deleteOne({ _id: req.params.id })//// Suppression de l'objet dans la base de donnée
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {//// Exportation de la route get, ciblage de paramètre de requête
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        res.status(200).json(sauce);
    })
    .catch((error) => {
        res.status(404).json({
            error: error
        });
    });
};

exports.likeSauce = (req, res, next) => {///// Exportation da la route like/dislike 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch(req.body.like){
                case -1:
                    sauce.dislikes = sauce.dislikes++;
                    sauce.usersDisliked.push(req.body.userId);
                    sauceObject = {
                        "dislikes": sauce.usersDisliked.length,
                        "usersDisliked": sauce.usersDisliked
                    }
                    break;
                case 0:
                    if(sauce.usersDisliked.find(user => user === req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
                        sauce.dislikes = sauce.dislikes--;
                        sauceObject = {
                            "dislikes": sauce.usersDisliked.length,
                            "usersDisliked": sauce.usersDisliked
                        }
                    }else{
                        sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
                        sauce.likes = sauce.likes--;
                        sauceObject = {
                            "likes": sauce.usersLiked.length,
                            "usersLiked": sauce.usersLiked

                        }  
                    }
                    break;
                case +1:
                    sauce.likes = sauce.likes++;
                    sauce.usersLiked.push(req.body.userId);
                    sauceObject = {
                        "likes": sauce.usersLiked.length,
                        "usersLiked": sauce.usersLiked
                    }
                    break;
                default:
                    return res.status(500).json({ error });
            }
            console.log(sauceObject);
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce aimée !' }))
                .catch(error => res.status(400).json({ error }));
        })
    .catch(() => res.status(400).json({ error: 'Sauce non trouvée !' }));
}

exports.getAllSauces = (req, res, next) => { //// Exportation de la route get globale 
    Sauce.find().then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};
