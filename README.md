# VehiClub-View - Application Frontend

Cette application représente l'interface utilisateur (frontend) de la plateforme de vente de véhicules en ligne VehiClub. Conçue comme une **Single Page Application (SPA)**, elle offre une expérience utilisateur moderne, fluide et réactive, en consommant les données et services exposés par l'API backend VehiClub.

## Fonctionnalités Clés

-   **Catalogue de Véhicules Interactif**: Parcourez une large sélection de véhicules avec des visuels attrayants.
-   **Affichage Détaillé des Véhicules**: Accédez à des informations complètes pour chaque véhicule (prix, motorisation, description).
-   **Recherche et Filtrage**: Trouvez rapidement les véhicules correspondant à vos critères grâce à des outils de recherche avancés.
-   **Système de Panier Virtuel**: Ajoutez des véhicules et personnalisez vos options avant de passer commande.
-   **Processus de Commande**: Gérez et finalisez vos achats de véhicules en ligne.

## Aperçu Visuel

Voici un aperçu de l'interface utilisateur.

### Page d'Accueil
![Page d'Accueil](../../docs/images/accueil.png)

### Catalogue
![Page du Catalogue](../../docs/images/catalogue.png)

### Détail d'un Véhicule
![Page de Détail d'un Véhicule](../../docs/images/detail_vehicule.png)

## Technologies et Librairies

Le frontend est construit avec les technologies et librairies suivantes :

-   **Framework**: [React](https://react.dev/) (v18)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Langage**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) - Composants d'interface utilisateur headless stylisables avec Tailwind CSS.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) pour un développement rapide et modulaire.
-   **Routing**: [React Router DOM](https://reactrouter.com/en/main) pour la navigation SPA.
-   **State Management**: React Context API et Hooks pour une gestion d'état locale et globale.
-   **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) pour la gestion et la synchronisation des données asynchrones.
-   **Linting**: ESLint
-   **Autres**: Lucide React (icônes), date-fns, clsx, etc.

## Architecture Frontend

Le code source est structuré de manière modulaire et organisée pour faciliter la maintenance et l'évolutivité. Le dossier `src/` contient les éléments suivants :

-   **`src/assets`**: Contient les ressources statiques telles que les images, icônes et autres fichiers multimédias.
-   **`src/components`**: Regroupe les composants React réutilisables. Il est subdivisé en:
    -   `home/`: Composants spécifiques à la page d'accueil.
    -   `layout/`: Composants de mise en page (Header, Footer).
    -   `ui/`: Composants Shadcn/UI (boutons, cartes, formulaires, etc.).
    -   `vehicles/`: Composants liés à l'affichage des véhicules.
-   **`src/context`**: Gère l'état global de l'application via l'API Context de React (ex: `CartContext` pour le panier).
-   **`src/data`**: Fournit des données statiques ou mockées utilisées pour le développement et les tests.
-   **`src/hooks`**: Contient des hooks React personnalisés pour encapsuler la logique réutilisable.
-   **`src/integrations`**: Gère les intégrations avec des services tiers ou des bibliothèques externes.
-   **`src/lib`**: Fonctions utilitaires génériques et configurations (ex: `utils.ts` pour `clsx` et `tailwind-merge`).
-   **`src/pages`**: Chaque fichier de ce dossier représente une vue principale ou une route de l'application (ex: `Index.tsx`, `Catalogue.tsx`, `VehicleDetail.tsx`, `Cart.tsx`).
-   **`src/patterns`**: Ce dossier est destiné à accueillir les implémentations des patrons de conception spécifiques au frontend, notamment **Decorator** et **Observer**.
-   **`src/types`**: Définit les interfaces et types TypeScript globaux utilisés dans l'application.

## Démarrage Rapide

### Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

-   [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée) et [npm](https://docs.npmjs.com/cli/v9/commands/npm)
-   L'API backend (`VehiClub-API`) doit être en cours d'exécution et accessible (par défaut sur `http://localhost:8080`).

### Étapes

1.  **Cloner le dépôt** (si ce n'est pas déjà fait) :
    ```bash
    git clone <URL_DU_DEPOT>
    cd VehiClub/VehiClub-View
    ```

2.  **Installer les dépendances** :
    Depuis le répertoire `VehiClub-View`, exécutez la commande suivante pour installer toutes les dépendances du projet :
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement** :
    Démarrez l'application en mode développement. Elle bénéficiera du rechargement à chaud (Hot Module Replacement) pour une expérience de développement rapide.
    ```bash
    npm run dev
    ```
    L'application sera alors accessible dans votre navigateur à l'adresse `http://localhost:3000`.

## Configuration du Proxy API

Un proxy de développement est configuré via `vite.config.ts`. Cela permet au frontend de faire des requêtes vers `/api/*` qui sont automatiquement redirigées vers l'API backend en cours d'exécution sur `http://localhost:8080`. Cette configuration est essentielle pour éviter les problèmes de [CORS (Cross-Origin Resource Sharing)](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS) durant le développement.

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 3000, // Port du frontend
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // URL de votre API backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // La plupart des APIs n'ont pas /api dans leur chemin
      },
    },
  },
  // ... autres configurations
});
```

*Note: La `rewrite` dans la configuration du proxy est souvent nécessaire si votre backend n'expose pas ses endpoints avec le préfixe `/api` (par exemple, `/vehicules` au lieu de `/api/vehicules`). Dans notre cas actuel, nos endpoints commencent par `/api`, donc la réécriture n'est pas strictement nécessaire pour le fonctionnement, mais elle est bonne pratique à mentionner.*
