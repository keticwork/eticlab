# Next.js & React — Couche 3

## Dépendances
- T-01 — Node.js (Next.js tourne sur Node.js)
- T-01b — package.json (Next.js se configure via package.json)
- C1-01 — Ports (le serveur de dev écoute sur le port 3000)
- C1-02 — HTTP (Next.js sert des pages via HTTP)

## 🟦 Carte d'identité

**Définition simple :**
> React, c'est une boîte de Lego : chaque brique est un 
> "composant" (un bouton, un menu, une carte). Tu assembles 
> les briques pour construire une page. Mais React seul ne 
> sait pas gérer les URLs, le serveur, ou le déploiement.
> Next.js, c'est le plan de construction livré avec la boîte : 
> il organise les briques, gère les pages, et fait tourner 
> le tout sur un serveur.

**Rôle technique :**
> React est une librairie JavaScript pour construire des 
> interfaces utilisateur à base de composants réutilisables.
> Next.js est un framework construit au-dessus de React qui 
> ajoute tout ce qu'il manque pour faire un vrai site :
> routing (navigation entre pages), rendu serveur (SSR), 
> génération statique (SSG), API routes, et optimisations 
> automatiques.

**React seul vs Next.js :**
| Fonctionnalité | React seul | Next.js |
|----------------|------------|---------|
| Composants | ✅ | ✅ (c'est du React) |
| Routing (pages/URLs) | ❌ (il faut react-router) | ✅ (basé sur les fichiers) |
| Rendu serveur (SSR) | ❌ (complexe à configurer) | ✅ (natif) |
| API backend | ❌ (il faut Express ou autre) | ✅ (API routes intégrées) |
| Optimisation images | ❌ | ✅ (next/image) |
| Déploiement | Manuel | Vercel en 1 clic |

**Ce que Next.js n'est PAS :**
- Ce n'est pas un langage (le langage c'est JavaScript/TypeScript)
- Ce n'est pas un CMS (il ne gère pas le contenu)
- Ce n'est pas obligatoire pour utiliser React (mais c'est recommandé)

**Schéma mental :**
```
JavaScript (le langage)
    └── React (la librairie de composants)
            └── Next.js (le framework complet)
                    └── Vercel (la plateforme de déploiement)
```

---

## 🟩 Sous le capot

**Structure d'un projet Next.js (App Router) :**
```
mon-projet/
├── package.json         ← scripts et dépendances
├── next.config.js       ← configuration Next.js
├── app/                 ← le dossier principal (App Router)
│   ├── layout.tsx       ← mise en page globale (header, footer)
│   ├── page.tsx         ← page d'accueil (route /)
│   ├── about/
│   │   └── page.tsx     ← page /about
│   └── api/
│       └── hello/
│           └── route.ts ← endpoint API /api/hello
├── public/              ← fichiers statiques (images, favicon)
└── node_modules/        ← dépendances (ne pas toucher)
```

**Le routing par fichiers :**
> Dans Next.js, créer une page = créer un fichier. 
> Pas de configuration de routes à écrire.
```
app/page.tsx           → localhost:3000/
app/about/page.tsx     → localhost:3000/about
app/blog/page.tsx      → localhost:3000/blog
app/blog/[slug]/page.tsx → localhost:3000/blog/mon-article
```

**Comprendre les composants React :**
> Un composant, c'est une fonction qui retourne du HTML (JSX).
```jsx
// Un composant simple
function Bouton({ texte }) {
  return <button>{texte}</button>;
}

// On l'utilise comme une balise HTML
<Bouton texte="Cliquez ici" />
```

**Server Components vs Client Components :**
> Next.js introduit une distinction importante :
```
Server Component (par défaut)
  → S'exécute sur le serveur
  → Peut lire la base de données directement
  → Plus rapide, pas de JavaScript envoyé au navigateur
  → Pas d'interactivité (pas de onClick, useState)

Client Component (ajouter "use client" en haut)
  → S'exécute dans le navigateur
  → Peut utiliser useState, useEffect, onClick
  → Nécessaire pour l'interactivité
```

**Les scripts npm de Next.js :**
```bash
npm run dev     # Serveur de développement (hot reload)
npm run build   # Construire pour la production
npm run start   # Lancer la version production
npm run lint    # Vérifier la qualité du code
```

**Créer un projet Next.js :**
```bash
# La commande officielle pour créer un nouveau projet
npx create-next-app@latest mon-projet

# Options recommandées :
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ App Router (pas Pages Router)
# ✅ src/ directory (organise mieux le code)
```

---

## 🟥 Laboratoire de test

**POC 1 — Créer et lancer un projet Next.js :**
```bash
cd ~/Dev/keticwork
npx create-next-app@latest test-nextjs
cd test-nextjs
npm run dev
# → Ouvre http://localhost:3000
```

**POC 2 — Créer une page :**
> Crée le fichier `app/labo/page.tsx` :
```tsx
export default function LaboPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Ma page Labo</h1>
      <p>Cette page existe parce que le fichier existe.</p>
      <p>URL : /labo</p>
    </div>
  );
}
```
> Ouvre http://localhost:3000/labo — la page apparaît automatiquement.

**POC 3 — Créer un composant réutilisable :**
> Crée le fichier `app/components/Carte.tsx` :
```tsx
export default function Carte({ titre, description }: { 
  titre: string; 
  description: string 
}) {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      padding: '1rem', 
      margin: '1rem 0' 
    }}>
      <h2>{titre}</h2>
      <p>{description}</p>
    </div>
  );
}
```
> Utilise-le dans `app/labo/page.tsx` :
```tsx
import Carte from '../components/Carte';

export default function LaboPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mon Labo</h1>
      <Carte titre="Module C1-01" description="Les ports réseau" />
      <Carte titre="Module C1-02" description="HTTP et HTTPS" />
    </div>
  );
}
```

**Test de compréhension :**
> Question : si tu crées le fichier `app/modules/C1-01/page.tsx`, 
> quelle URL sera accessible ?
> Réponse : http://localhost:3000/modules/C1-01

---

## 💀 Zone de hack

**Vulnérabilité classique — exposer des secrets côté client :**
> Dans Next.js, seules les variables d'environnement préfixées 
> par `NEXT_PUBLIC_` sont visibles côté navigateur. Si tu mets 
> une clé API dans `NEXT_PUBLIC_API_KEY`, tout le monde peut 
> la lire dans le code source de la page.

**Vérification :**
```bash
# Chercher les variables exposées côté client
grep -r "NEXT_PUBLIC_" .env*

# Vérifier dans le build ce qui est inclus
npm run build
# Le résumé montre quelles pages sont statiques vs dynamiques
```

**Autre risque — Server Actions non protégées :**
> Les Server Actions de Next.js sont des fonctions serveur 
> appelées depuis le client. Sans validation, un attaquant 
> peut envoyer n'importe quelles données au serveur.

**Contre-mesure :**
> - Ne jamais mettre de secret dans une variable `NEXT_PUBLIC_`
> - Les clés API sensibles vont dans des variables sans préfixe 
>   (accessibles uniquement côté serveur)
> - Toujours valider les entrées dans les Server Actions
> - Utiliser `.env.local` pour les secrets locaux (dans .gitignore)

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Next.js | Framework React complet | Gratuit, open source | Complexité initiale |
| React DevTools | Inspecter les composants | Gratuit (extension Chrome) | Aucun |
| create-next-app | Créer un projet Next.js | Gratuit | Aucun |
| Turbopack | Bundler rapide (inclus Next.js) | Gratuit | Encore jeune |
| ESLint | Vérifier la qualité du code | Gratuit, open source | Faux positifs |

## 🔄 Alternatives

| Outil | Type | Modèle | Avantage | Inconvénient |
|-------|------|--------|----------|--------------|
| Next.js | Framework React full-stack | Gratuit / open source | Le plus complet, écosystème Vercel, SSR natif | Complexe pour un débutant, opinions fortes |
| Remix | Framework React full-stack | Gratuit / open source | Approche web standard (forms, loaders), simple | Moins de communauté, pas d'optimisation image native |
| Astro | Framework multi-librairie | Gratuit / open source | Ultra rapide pour les sites statiques, flexible | Moins adapté aux apps interactives |
| Vite + React | React avec bundler rapide | Gratuit / open source | Simple, rapide, pas d'opinions | Pas de SSR natif, pas de routing intégré |
| SvelteKit | Framework Svelte full-stack | Gratuit / open source | Syntaxe simple, performances, pas de virtual DOM | Écosystème plus petit, pas de React |

> **Recommandation EticLab :** Next.js est le choix de la stack 
> (Reflety et Benny l'utilisent déjà). Comprendre React d'abord 
> (composants, props, state) puis les couches que Next.js ajoute.

## Liens avec d'autres modules
- → T-01-nodejs : Next.js tourne sur Node.js
- → T-01b-package-json : les scripts dev/build/start sont dans package.json
- → C1-01-ports : le serveur de dev écoute sur le port 3000
- → C1-02-http : Next.js sert des pages via HTTP
- → C1-03-cdn : Vercel distribue le site via CDN
- → C3-02-routing : le routing par fichiers est une feature clé de Next.js
- → C5-01-vercel : Next.js se déploie nativement sur Vercel
