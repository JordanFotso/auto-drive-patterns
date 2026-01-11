# VehiClub View - Frontend

Ce projet est l'interface utilisateur (frontend) de l'application VehiClub. C'est une **Single Page Application (SPA)** développée avec React, TypeScript et Vite, conçue pour être à la fois moderne, réactive et agréable à utiliser.

## Aperçu de l'Interface

Voici un aperçu de l'interface utilisateur cible.

### Page d'Accueil
![Page d'Accueil](../../docs/images/accueil.png)

### Catalogue
![Page du Catalogue](../../docs/images/catalogue.png)

### Détail d'un Véhicule
![Page de Détail d'un Véhicule](../../docs/images/detail_vehicule.png)

## Stack Technologique

- **Framework**: React 18 avec Vite
- **Langage**: TypeScript
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) - Une collection de composants réutilisables.
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context & Hooks

## Structure du Projet

Le code source est organisé dans le dossier `src/` avec la structure suivante :

- **`assets/`**: Contient les images, icônes et autres ressources statiques.
- **`components/`**: Contient les composants React réutilisables (UI, Layout, etc.).
- **`context/`**: Pour la gestion de l'état global (ex: `CartContext`).
- **`data/`**: Contient des données statiques pour le développement initial.
- **`hooks/`**: Contient les hooks React personnalisés.
- **`lib/`**: Fonctions utilitaires (ex: `cn` pour fusionner les classes Tailwind).
- **`pages/`**: Chaque fichier représente une page de l'application.
- **`types/`**: Contient les définitions de types TypeScript.

## Installation et Lancement

### Prérequis

- Node.js et npm
- L'API backend (`VehiClub-API`) doit être en cours d'exécution.

### Étapes

1.  **Installer les dépendances** :
    Naviguez dans le répertoire `VehiClub-View` et exécutez :
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```
    L'application sera alors accessible à l'adresse `http://localhost:3000`.

### Connexion à l'API Backend

Le projet est configuré pour communiquer avec l'API backend qui tourne sur `http://localhost:8080`.

Un proxy a été configuré dans `vite.config.ts`. Toutes les requêtes faites vers `/api` depuis le frontend seront automatiquement redirigées vers le backend, évitant ainsi les problèmes de CORS en environnement de développement.