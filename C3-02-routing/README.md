# Routing (navigation) — Couche 3

## Dépendances
- C3-01 — Next.js & React (le routing est une feature de Next.js)
- C1-02 — HTTP (chaque URL = une requête HTTP)
- C1-01 — Ports (le serveur écoute sur un port)

## 🟦 Carte d'identité

**Définition simple :**
> Imagine un immeuble avec un plan d'étage à l'entrée. 
> Le routing, c'est ce plan : quand tu demandes "appartement 3B", 
> le plan te dit d'aller au 3e étage, porte B. 
> Dans un site web, quand tu tapes `/about`, le routing sait 
> quel fichier afficher. L'URL c'est l'adresse, le routing 
> c'est le facteur qui sait où livrer.

**Rôle technique :**
> Le routing est le mécanisme qui associe une URL à un contenu. 
> Dans Next.js (App Router), le routing est basé sur le système 
> de fichiers : la structure de tes dossiers dans `app/` définit 
> directement les URLs de ton site. Pas de fichier de configuration, 
> pas de routes à déclarer — créer un fichier = créer une page.

**Les deux types de routing :**
| Type | Comment ça marche | Exemple |
|------|-------------------|---------|
| Statique | Un fichier = une URL fixe | `app/about/page.tsx` → `/about` |
| Dynamique | Un fichier = un pattern d'URL | `app/blog/[slug]/page.tsx` → `/blog/mon-article` |

---

## 🟩 Sous le capot

**Mécanisme — Le routing par fichiers de Next.js :**
> Next.js scanne le dossier `app/` au démarrage. Chaque dossier 
> contenant un fichier `page.tsx` devient une route accessible.

**Règles de nommage :**
```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/mon-article
│                            /blog/autre-article
│                            /blog/nimporte-quoi
├── modules/
│   └── [couche]/
│       └── [id]/
│           └── page.tsx  → /modules/C1/01
│                            /modules/C3/02
└── api/
    └── hello/
        └── route.ts      → /api/hello (endpoint API)
```

**Fichiers spéciaux de Next.js :**
| Fichier | Rôle |
|---------|------|
| `page.tsx` | Le contenu de la page (obligatoire pour créer une route) |
| `layout.tsx` | Mise en page partagée (header, sidebar, footer) |
| `loading.tsx` | Écran de chargement pendant que la page se charge |
| `error.tsx` | Page d'erreur si quelque chose plante |
| `not-found.tsx` | Page 404 personnalisée |

**Comment fonctionne la navigation :**
```
Navigation classique (HTML) :
  <a href="/about">About</a>
  → Le navigateur recharge TOUTE la page (lent)

Navigation Next.js :
  <Link href="/about">About</Link>
  → Seul le contenu change, le layout reste (rapide)
  → Prefetch automatique (charge la page avant le clic)
```

**Les paramètres dynamiques :**
```tsx
// Fichier : app/blog/[slug]/page.tsx
// URL : /blog/mon-premier-article

export default function BlogPost({ params }: { 
  params: { slug: string } 
}) {
  return <h1>Article : {params.slug}</h1>;
  // Affiche : "Article : mon-premier-article"
}
```

**Les groupes de routes (organisation sans URL) :**
```
app/
├── (marketing)/        ← parenthèses = pas dans l'URL
│   ├── about/page.tsx  → /about (pas /marketing/about)
│   └── pricing/page.tsx → /pricing
├── (app)/
│   ├── dashboard/page.tsx → /dashboard
│   └── settings/page.tsx  → /settings
```
> Les parenthèses permettent d'organiser ton code sans 
> affecter les URLs. Utile pour séparer marketing/app.

---

## 🟥 Laboratoire de test

**POC 1 — Routing statique :**
> Dans un projet Next.js, crée ces fichiers :
```
app/labo/page.tsx         → /labo
app/labo/routing/page.tsx → /labo/routing
```

> Contenu de `app/labo/page.tsx` :
```tsx
import Link from 'next/link';

export default function LaboPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Labo EticLab</h1>
      <nav>
        <Link href="/labo/routing">→ Module Routing</Link>
      </nav>
    </div>
  );
}
```

**POC 2 — Routing dynamique :**
> Crée le fichier `app/modules/[id]/page.tsx` :
```tsx
export default function ModulePage({ params }: { 
  params: { id: string } 
}) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Module : {params.id}</h1>
      <p>Cette page est générée dynamiquement.</p>
      <p>L'URL <strong>/modules/{params.id}</strong> 
         correspond au fichier app/modules/[id]/page.tsx</p>
    </div>
  );
}
```
> Teste avec :
> - http://localhost:3000/modules/C1-01
> - http://localhost:3000/modules/C3-02
> - http://localhost:3000/modules/nimporte-quoi
> → Toutes fonctionnent avec le même fichier !

**POC 3 — Layout partagé :**
> Crée `app/labo/layout.tsx` :
```tsx
export default function LaboLayout({ children }: { 
  children: React.ReactNode 
}) {
  return (
    <div>
      <header style={{ 
        background: '#1a1a2e', 
        color: 'white', 
        padding: '1rem' 
      }}>
        🧪 EticLab — Laboratoire
      </header>
      <main>{children}</main>
    </div>
  );
}
```
> Toutes les pages dans `/labo/...` auront ce header automatiquement.

**Test de panne :**
> Renomme `page.tsx` en `index.tsx` dans un dossier :
> → La route disparaît — Next.js ne reconnaît que `page.tsx`.
> C'est strict mais c'est ce qui rend le système fiable.

---

## 💀 Zone de hack

**Vulnérabilité classique — routes non protégées :**
> Par défaut, TOUTES les pages dans `app/` sont publiques. 
> Si tu crées `app/admin/page.tsx`, n'importe qui peut y 
> accéder via `/admin`. Il n'y a pas de protection intégrée.

**Vérification :**
```bash
# Lister toutes les routes de ton projet
find app -name "page.tsx" -o -name "route.ts" | sort
# → Vérifie qu'aucune route sensible n'est exposée
```

**Autre risque — routes API sans validation :**
> Les fichiers `route.ts` dans `app/api/` sont des endpoints 
> publics. Sans validation des entrées, un attaquant peut 
> envoyer n'importe quelles données.

**Contre-mesure :**
> - Protéger les routes sensibles avec un middleware d'auth
> - Valider toutes les entrées dans les API routes
> - Utiliser les groupes de routes `(auth)/` pour organiser 
>   les pages protégées
> - Ne jamais mettre de données sensibles dans les paramètres 
>   d'URL (ils sont visibles dans l'historique du navigateur)

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Next.js App Router | Routing par fichiers | Gratuit, intégré | Conventions strictes |
| next/link (Link) | Navigation sans rechargement | Gratuit, intégré | Aucun |
| next/navigation | useRouter, usePathname, useParams | Gratuit, intégré | Client-side uniquement |
| DevTools Network | Voir les requêtes de navigation | Gratuit | Aucun |

## 🔄 Alternatives

| Outil | Gratuit | Open Source | Freemium | Premium | Limites |
|-------|---------|-------------|----------|---------|---------|
| Next.js App Router | ✅ | ✅ | — | — | Conventions strictes, courbe d'apprentissage |
| Next.js Pages Router | ✅ | ✅ | — | — | Ancien système, moins de features |
| React Router | ✅ | ✅ | — | — | Config manuelle, pas de SSR natif |
| TanStack Router | ✅ | ✅ | — | — | Type-safe, mais écosystème jeune |
| Remix (routes) | ✅ | ✅ | — | — | Basé sur les fichiers aussi, approche web standard |

> **Recommandation EticLab :** App Router de Next.js — c'est le 
> standard actuel et celui utilisé dans Reflety et Benny. Le routing 
> par fichiers est intuitif une fois qu'on comprend les conventions. 
> Pas besoin de librairie externe.

## Liens avec d'autres modules
- → C3-01-nextjs : le routing est une feature centrale de Next.js
- → C3-03-composants : les pages utilisent des composants React
- → C1-02-http : chaque navigation = une requête HTTP (ou navigation client)
- → C5-01-auth : protéger certaines routes avec l'authentification
