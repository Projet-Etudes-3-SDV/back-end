# Cyna API

**Version:** 1.0.0  

## Description
Cyna API est un backend développé en **TypeScript** avec **Express.js** et **Mongoose**.

Ce projet a été réalisé dans le cadre du projet d'études Bachelor CPI de Sup de Vinci Bordeaux, sur une période de 3 mois.
Il s’inscrit dans un contexte pédagogique concret visant à simuler la création d’une plateforme e-commerce complète pour une entreprise fictive, Cyna, spécialisée dans la vente de solutions de cybersécurité SaaS (SOC, EDR, XDR).

L'objectif principal était de concevoir et développer une API backend robuste permettant de :

- Gérer des utilisateurs et l’authentification (avec validation par OTP)
- Mettre en place un système d’abonnements personnalisables
- Gérer un catalogue de produits SaaS, leur ajout au panier, et la validation via un paiement sécurisé (Stripe)
- Permettre une gestion centralisée côté administrateur (backoffice)
- Ce projet comportait également une forte exigence sur la sécurité, la scalabilité, l’expérience mobile-first, et d’une application mobile.

## Équipe projet
Le développement de l’API a été pris en charge par un groupe de trois étudiants :

Back-End -> Elie Lajoinie

Fullstack -> Arthur Lagneaux

Front-End / Application -> Timéo Avi

## Fonctionnalités
- **Authentification JWT** (Middleware sécurisé)
- **Gestion des utilisateurs** (Création, mise à jour, suppression)
- **Gestion d'abonnements** (Souscription, Annulation, Essai)
- **Gestion de produits** (Création, Suppression, Modification)
- **Gestion des rôles** (Permissions d'accès spécifiques, Vue administrateur)
- **Gestion des erreurs centralisée**
- **Logging des requêtes**
- **Configuration modulaire**
- **Documentation Swagger**
- **Templates d’e-mail** (Validation, Réinitialisation de mot de passe, Factures)

## 🛠️ Stack technique

- **Node.js**
- **TypeScript**
- **Stripe**
- **MongoDB** (via Mongoose)
- **Dotenv**
- **EJS** pour les templates email
  
## Installation

### Prérequis
- **Node.js** (>= 16)
- **MongoDB** (Local ou Cloud)
- **Git**

### Clonage du projet
```bash
git clone https://github.com/Projet-Etudes-3-SDV/back-end
cd Cyna-API
```

### Installation des dépendances
```bash
npm install
```

## Configuration
Créer un fichier `.env` à la racine du projet et ajouter :
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

## Démarrage du serveur

### En mode développement
```bash
npm run dev
```

### En mode production
```bash
npm run build
npm start
```

### Accéder à la documentation
Une fois l'API lancé se rendre sur la page suivante: http://localhost:3000/api-docs

## Structure du projet
```
/src
│── config/          # Configuration de la base de données
│── middlewares/     # Middlewares pour l'authentification, logs et erreurs
│── models/          # Modèles Mongoose
│── routes/          # Définition des routes de l'API et de la documentation Swagger
│── controllers/     # Dossier contenant les controllers
│── services/        # Contient la logique métier de tous les fichiers
│── repositories/    # Contient la logique pour intéragir avec la base de donnée non-relationnelle
│── types/           # Types des requêtes et des réponses
│── utils/           # Fonctions utilitaires
│── logs/            # Stock les erreurs, routes utilisés et les paiements
│── app.ts           # Configuration principale de l'application
│── server.ts        # Point d'entrée du serveur
templates/           # Contient les fichiers htmls envoyé par e-mail
storage/             # Contient les fichiers pdfs des factures

```

## Routes principales

### Utilisateurs
| Méthode | Endpoint          | Description                                |
| ------- | ----------------- | ------------------------------------------ |
| POST    | `/users/register` | Inscription d’un utilisateur               |
| POST    | `/users/login`    | Connexion d’un utilisateur                 |
| POST    | `/validate-login` | Validation de la connexion via un code OTP |

### Produit
| Méthode | Endpoint        | Description                           |
| ------- | --------------- | ------------------------------------- |
| GET     | `/products`     | Récupérer la liste des produits       |
| GET     | `/products/:id` | Détails d’un produit spécifique       |
| POST    | `/products`     | Création d’un nouveau produit (admin) |

### Panier
| Méthode | Endpoint       | Description                    |
| ------- | -------------- | ------------------------------ |
| GET     | `/cart`        | Récupérer le contenu du panier |
| POST    | `/cart/add`    | Ajouter un produit au panier   |
| DELETE  | `/cart/remove` | Supprimer un produit du panier |

### Paiement
| Méthode | Endpoint            | Description                   |
| ------- | ------------------- | ----------------------------- |
| POST    | `/payment/checkout` | Lancer un paiement via Stripe |

### Abonnement
| Méthode | Endpoint             | Description                             |
| ------- | -------------------- | --------------------------------------- |
| POST    | `/subscriptions`     | Créer un abonnement                     |
| GET     | `/subscriptions/me`  | Récupérer l’abonnement de l’utilisateur |
| DELETE  | `/subscriptions/:id` | Annuler un abonnement                   |


## Licence
Ce projet est sous licence MIT.

