# Florencia Admin Dashboard

> Dashboard d'administration premium pour la maison Florencia - Gestion complète des services de beauté, boutique e-commerce et réservations.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.3.1-00DC82?style=flat&logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Nuxt UI](https://img.shields.io/badge/Nuxt_UI-Latest-00DC82?style=flat)

---

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [API Backend](#api-backend)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)

---

## 🎨 À propos

Florencia Dashboard est une application web d'administration moderne et élégante développée avec **Nuxt.js 4** et **Nuxt UI**. Elle permet la gestion complète d'une maison de beauté haut de gamme :

- 🛍️ **E-Commerce** : Gestion des articles, commandes et codes promotionnels
- 💆‍♀️ **Services & Réservations** : Planification des prestations et rendez-vous clients
- 👥 **Personnel & Utilisateurs** : Gestion des collaborateurs et administrateurs
- 📅 **Calendrier** : Organisation des périodes de disponibilité

Le design s'inspire des codes esthétiques du luxe avec une palette **"Café"** (tons chauds et terreux), des typographies raffinées (**EB Garamond** et **Raleway**) et des animations fluides.

---

## ✨ Fonctionnalités

### Authentification
- ✅ Connexion sécurisée avec JWT (Laravel Sanctum)
- ✅ Stockage du token dans `localStorage`
- ✅ Protection des routes avec middleware

### E-Commerce
- ✅ **Articles** : Liste, ajout, modification (intégration API complète)
- ✅ **Codes Promo** : Génération automatique de codes de réduction avec validité
- 🔄 **Commandes** : Suivi des ventes (UI prête, backend en cours)

### Réservations
- ✅ **Services** : Gestion des prestations (soins, massages, etc.)
- ✅ **Calendrier** : Planification des périodes de disponibilité avec activation
- 🔄 **Réservations** : Suivi des rendez-vous clients (UI prête)

### Gestion Utilisateurs
- ✅ **Personnel** : Liste des collaborateurs avec coordonnées
- ✅ **Administrateurs** : Gestion des super-admins et admins
- ✅ Affichage dynamique des rôles et permissions

### Design & UX
- ✅ Interface premium avec animations subtiles
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Thème clair/sombre automatique
- ✅ Notifications toast pour les retours utilisateur
- ✅ Modals élégantes pour les formulaires

---

## 🛠️ Technologies

### Frontend
- **[Nuxt.js 4.3.1](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript réactif
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Nuxt UI](https://ui.nuxt.com/)** - Bibliothèque de composants UI
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitaire

### Backend
- **[Laravel 11](https://laravel.com/)** - Framework PHP
- **[Laravel Sanctum](https://laravel.com/docs/sanctum)** - Authentification API
- **[MySQL](https://www.mysql.com/)** - Base de données relationnelle

### Outils
- **ESLint** - Linting JavaScript/TypeScript
- **Git** - Gestion de versions

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir :

- **Node.js** version 18.x ou supérieure
- **npm** ou **pnpm** ou **yarn**
- **PHP** version 8.2 ou supérieure
- **Composer** (pour le backend Laravel)
- **MySQL** version 8.x ou supérieure

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/neostart-tech/florencia-dashboard.git
cd florencia-dashboard
```

### 2. Installer les dépendances

```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configuration (voir section suivante)

---

## ⚙️ Configuration

### Variables d'environnement

Le projet utilise `nuxt.config.ts` pour la configuration. L'URL de l'API est définie dans `runtimeConfig.public.apiBase`.

**Par défaut** : `http://127.0.0.1:8000/api`

Pour modifier l'URL de l'API, éditez le fichier `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api'
    }
  }
})
```

Ou créez un fichier `.env` à la racine :

```env
NUXT_PUBLIC_API_BASE=https://api.votredomaine.com/api
```

### Backend Laravel

Le dashboard communique avec une API Laravel. Assurez-vous que le backend est configuré et lancé :

1. Clonez le dépôt backend (si séparé)
2. Installez les dépendances : `composer install`
3. Configurez le fichier `.env` (base de données, etc.)
4. Générez la clé : `php artisan key:generate`
5. Lancez les migrations : `php artisan migrate`
6. Démarrez le serveur : `php artisan serve`

L'API devrait être accessible sur `http://127.0.0.1:8000`

---

## 🗂️ Structure du projet

```
florencia-dashboard/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Styles globaux (palette Café, fonts)
│   ├── layouts/
│   │   ├── auth.vue              # Layout page de connexion
│   │   └── default.vue           # Layout principal (sidebar, header)
│   ├── pages/
│   │   ├── index.vue             # Tableau de bord
│   │   ├── login.vue             # Page de connexion
│   │   ├── users/
│   │   │   └── index.vue         # Gestion utilisateurs/admins
│   │   ├── staff/
│   │   │   └── index.vue         # Liste du personnel
│   │   ├── shop/
│   │   │   ├── articles.vue      # Gestion des articles
│   │   │   ├── orders.vue        # Commandes
│   │   │   └── promos.vue        # Codes promo
│   │   └── reservations/
│   │       ├── index.vue         # Liste des réservations
│   │       ├── services.vue      # Gestion des services
│   │       └── calendar.vue      # Calendrier de disponibilité
│   ├── app.config.ts             # Configuration couleurs (Nuxt UI)
│   └── app.vue                   # Point d'entrée de l'app
├── nuxt.config.ts                # Configuration Nuxt
├── package.json
└── README.md
```

---

## 🎯 Utilisation

### Développement

Lancez le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### Connexion

Utilisez les identifiants super-admin par défaut :

- **Email** : `admin@florencia.com`
- **Mot de passe** : `Mot@de@passe`

> ⚠️ Changez ces identifiants en production !

### Navigation

- **Tableau de bord** : `/` - Vue d'ensemble (statistiques, graphiques)
- **Utilisateurs** : `/users` - Gestion des administrateurs
- **Personnel** : `/staff` - Liste des collaborateurs
- **Articles** : `/shop/articles` - Catalogue produits
- **Codes Promo** : `/shop/promos` - Générer et gérer les réductions
- **Commandes** : `/shop/orders` - Suivi des ventes
- **Services** : `/reservations/services` - Prestations disponibles
- **Réservations** : `/reservations` - Rendez-vous clients
- **Calendrier** : `/reservations/calendar` - Périodes de disponibilité

---

## 🔌 API Backend

### Endpoints utilisés

#### Authentification
- `POST /admin/login` - Connexion admin (retourne `token` et `user`)

#### Personnel
- `GET /personnels` - Liste des collaborateurs (Auth requise)

#### Articles (E-Commerce)
- `GET /articles` - Liste des produits
- `POST /articles` - Créer un article (Auth)
- `PUT /articles/{id}` - Modifier (Auth)
- `DELETE /articles/{id}` - Supprimer (Auth)

#### Services (Réservations)
- `GET /services` - Liste des prestations
- `POST /services` - Créer un service (Auth)
- `PUT /services/{id}` - Modifier (Auth)
- `DELETE /services/{id}` - Supprimer (Auth)

#### Codes Promo
- `GET /codepromos` - Liste des codes (Auth)
- `POST /codepromos` - Générer un code (Auth)
- `DELETE /codepromos/{id}` - Supprimer (Auth)

#### Calendrier
- `GET /calendriers` - Périodes planifiées
- `POST /calendriers` - Créer une période (Auth)
- `PUT /calendriers/{id}` - Modifier (Auth)
- `DELETE /calendriers/{id}` - Supprimer (Auth)

#### Utilisateurs/Admins
- `GET /admins` - Liste des administrateurs (Auth)
- `POST /admins` - Créer un admin (Auth)
- `PUT /admins/{id}` - Modifier (Auth)
- `DELETE /admins/{id}` - Supprimer (Auth)

### Authentification des requêtes

Toutes les requêtes protégées (POST, PUT, DELETE, et certaines GET) nécessitent le header :

```
Authorization: Bearer {TOKEN}
```

Le token est récupéré lors de la connexion et stocké dans `localStorage.getItem('florencia_admin_token')`.

---

## 🌍 Déploiement

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans `.output/`

### Prévisualisation locale

```bash
npm run preview
```

### Déploiement recommandé

- **Vercel** (recommandé pour Nuxt)
- **Netlify**
- **DigitalOcean App Platform**
- **AWS Amplify**
- Tout serveur Node.js (avec PM2)

#### Exemple de déploiement sur Vercel :

1. Connectez votre dépôt GitHub à Vercel
2. Configurez la variable d'environnement `NUXT_PUBLIC_API_BASE` avec l'URL de votre API de production
3. Déployez automatiquement à chaque push sur `main`

---

## 👨‍💻 Développé par

**Neostart Tech**

- GitHub : [@neostart-tech](https://github.com/neostart-tech)

---

## 📄 Licence

Ce projet est privé et propriétaire. Tous droits réservés © 2026 Florencia / Neostart Tech.

---

## 🙏 Remerciements

- Design inspiré par les codes esthétiques du luxe et du raffinement
- Palette de couleurs "Café" pour une identité visuelle chaleureuse
- Typographies premium : EB Garamond & Raleway

---

## 📞 Support

Pour toute question ou assistance :

- Email : support@neostart-tech.com
- Issues : [GitHub Issues](https://github.com/neostart-tech/florencia-dashboard/issues)

---

**Fait avec ❤️ et ☕ par l'équipe Neostart Tech**
