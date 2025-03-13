# Cyna API

## Description
Cyna API est un backend développé en **TypeScript** avec **Express.js** et **Mongoose**. Il gère les fonctionnalités essentielles de l'application, notamment l'authentification, la gestion des rôles et la persistance des données via MongoDB.
Voir l'ADR pour plus d'informations: https://docs.google.com/document/d/1vzXj49D16qlNJqLY1TJ94E1CEXRugvGdqk6-i8iOxJQ/edit?usp=sharing

## Fonctionnalités
- **Authentification JWT** (Middleware sécurisé)
- **Gestion des utilisateurs** (Création, mise à jour, suppression)
- **Gestion des rôles** (Permissions d'accès spécifiques)
- **Gestion des erreurs centralisée**
- **Logging des requêtes**
- **Configuration modulaire**

## Installation

### Prérequis
- **Node.js** (>= 16)
- **MongoDB** (Local ou Cloud)
- **Git**

### Clonage du projet
```bash
git clone https://github.com/ton-repo/Cyna-API.git
cd Cyna-API
```

### Installation des dépendances
```bash
npm install
```

## Configuration
Créer un fichier `.env` à la racine du projet et ajouter :
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cyna_db
JWT_SECRET=super_secret_key
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

## Structure du projet
```
/src
│── config/          # Configuration de la base de données
│── middlewares/     # Middlewares pour l'authentification, logs et erreurs
│── models/          # Modèles Mongoose
│── routes/          # Définition des routes de l'API
│── utils/           # Fonctions utilitaires
│── app.ts           # Configuration principale de l'application
│── server.ts        # Point d'entrée du serveur
```

## Routes principales
| Méthode | Endpoint         | Description                        |
|---------|-----------------|------------------------------------|
| POST    | /users/login     | Connexion de l'utilisateur        |
| POST    | /users/register  | Inscription d'un utilisateur      |
| GET     | /users          | Liste des utilisateurs            |
| GET     | /users/:id      | Récupérer un utilisateur          |
| PUT     | /users/:id      | Mettre à jour un utilisateur      |
| DELETE  | /users/:id      | Supprimer un utilisateur         |

## Contribuer
Les contributions sont les bienvenues !
1. **Fork** le projet
2. **Créer une branche** (`feature/ma-nouvelle-feature`)
3. **Commit** (`git commit -m 'Ajout d'une nouvelle feature'`)
4. **Push** (`git push origin feature/ma-nouvelle-feature`)
5. **Faire une Pull Request**

## Licence
Ce projet est sous licence MIT.

