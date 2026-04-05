`Couche 3 — Backend & données`

# Authentification web

> Comprendre l'authentification dans une app Next.js : Supabase Auth, OAuth Google, magic link, sessions et protection des routes.

**Prérequis :** `C3-01` `C3-02` `C4-01` `T-GCLOUD01`

**Ce que tu vas apprendre :**
- La différence entre authentification et autorisation
- Comment Supabase Auth gère les sessions avec des cookies
- Comment protéger des routes dans Next.js

---

## 🟦 Carte d'identité

**Définition simple :**
> L'authentification, c'est le videur à l'entrée de la boîte de nuit. 
> Il vérifie ta carte d'identité (qui tu es). L'autorisation, c'est 
> le bracelet VIP (ce que tu as le droit de faire une fois dedans). 
> Sur le web, l'authentification vérifie ton email/mot de passe, 
> et l'autorisation décide si tu peux accéder au dashboard admin 
> ou juste au contenu public.

**Rôle technique :**
> L'authentification (auth) gère l'identité des utilisateurs : 
> inscription, connexion, déconnexion, et sessions. Supabase Auth 
> fournit plusieurs méthodes de connexion (OAuth, magic link, 
> email/password) et gère les sessions via des cookies JWT.

**Schéma** :
📸 à ajouter dans docs/

**Authentification vs Autorisation :**
| Concept | Question | Exemple |
|---------|----------|---------|
| Authentification | Qui es-tu ? | Connexion Google, magic link |
| Autorisation | Qu'as-tu le droit de faire ? | Admin vs utilisateur, RLS |

**Les méthodes de connexion :**
| Méthode | Comment ça marche | UX |
|---------|------------------|-----|
| OAuth Google | Clic → Google consent → session | Rapide, 2 clics |
| Magic Link | Email → lien cliquable → session | Simple, pas de mot de passe |
| Email / Password | Inscription classique | Familier, mais mot de passe à gérer |

---

## 🟩 Sous le capot

**Mécanisme — Le flow complet d'une connexion :**
> 1. L'utilisateur clique "Continuer avec Google" ou entre son email
> 2. Supabase Auth vérifie l'identité (via Google ou magic link)
> 3. Supabase crée un JWT (JSON Web Token) contenant l'identité
> 4. Le JWT est stocké dans un cookie httpOnly côté navigateur
> 5. À chaque requête, le cookie est envoyé automatiquement
> 6. Le serveur Next.js vérifie le JWT pour savoir qui est connecté
> 7. Si le JWT expire, l'utilisateur est redirigé vers /connexion

**Architecture auth dans Next.js + Supabase :**
```
src/
├── lib/
│   ├── supabase-client.ts   ← Client Components (navigateur)
│   └── supabase-server.ts   ← Server Components (serveur)
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts     ← Callback OAuth (échange code → session)
│   └── connexion/
│       └── page.tsx         ← Page de connexion
└── components/
    └── auth/
        └── AuthButton.tsx   ← Boutons Google + Magic Link
```

**Pourquoi deux clients Supabase ?**
| Client | Fichier | Contexte | Cookies |
|--------|---------|----------|---------|
| Browser | `supabase-client.ts` | Client Components | Lit les cookies du navigateur |
| Server | `supabase-server.ts` | Server Components, API routes | Lit les cookies de la requête HTTP |

**Protéger une route (middleware) :**
```ts
// middleware.ts — à la racine du projet
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rediriger vers /connexion si non connecté
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/compte/:path*'],
}
```

**Récupérer l'utilisateur côté serveur :**
```tsx
// Dans un Server Component
import { createClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/connexion')
  
  return <h1>Bonjour {user.email}</h1>
}
```

**Outils d'observation :**
```bash
# Voir les utilisateurs dans Supabase
# Dashboard → Authentication → Users

# Voir les cookies de session dans Chrome
# F12 → Application → Cookies → localhost

# Vérifier la session active
# Console navigateur :
# const { data } = await supabase.auth.getSession()
# console.log(data)
```

**Schéma technique** :
```mermaid
sequenceDiagram
  User->>Page connexion: Clic Google / Email
  Page connexion->>Supabase Auth: signInWithOAuth / signInWithOtp
  Supabase Auth->>Google/Email: Vérification
  Google/Email->>Supabase Auth: Code / Confirmation
  Supabase Auth->>Navigateur: Cookie JWT (session)
  Navigateur->>Next.js: Requête + cookie
  Next.js->>Supabase: Vérifie JWT
  Supabase->>Next.js: User data
  Next.js->>User: Page protégée
```

---

## 🟥 Laboratoire de test

**POC 1 — Connexion magic link :**
> 1. Lance `npm run dev`
> 2. Va sur /connexion
> 3. Entre ton email
> 4. Vérifie ta boîte mail → clique le lien
> 5. Tu es redirigé vers / avec ta session active

**POC 2 — Connexion Google :**
> 1. Configure le provider Google dans Supabase (voir T-GCLOUD01)
> 2. Clique "Continuer avec Google" sur /connexion
> 3. Autorise l'app sur le consent screen Google
> 4. Vérifie la session dans Supabase Dashboard → Users

**POC 3 — Vérifier la session dans DevTools :**
> 1. F12 → Application → Cookies
> 2. Cherche les cookies `sb-*` (Supabase session)
> 3. F12 → Console : tape `document.cookie`
> 4. Les cookies httpOnly ne sont PAS visibles ici (c'est normal)

**Test de panne :**
> Supprime les cookies Supabase dans DevTools :
> → La navbar passe en mode "non connecté"
> → Les pages protégées redirigent vers /connexion
> → Reconnecte-toi pour restaurer la session

**Commande clé à retenir :**
```bash
# Vérifier les utilisateurs dans Supabase
# Dashboard → Authentication → Users
```

---

## 💀 Zone de hack

**Vulnérabilité classique — session hijacking :**
> Si un attaquant vole le cookie de session (via XSS ou réseau 
> non chiffré), il peut se faire passer pour l'utilisateur. 
> C'est pourquoi les cookies doivent être httpOnly (pas lisibles 
> par JavaScript) et secure (envoyés uniquement en HTTPS).

**Autre risque — pas de vérification côté serveur :**
> Ne jamais faire confiance au client pour l'auth. Toujours 
> vérifier la session côté serveur avec `getUser()`, pas 
> `getSession()` (qui lit le JWT local sans vérifier auprès 
> de Supabase).

**Contre-mesure :**
> - Utiliser `getUser()` (vérifie auprès de Supabase) et non 
>   `getSession()` (lit le JWT local, peut être expiré/falsifié)
> - Les cookies Supabase sont déjà httpOnly et secure par défaut
> - Toujours HTTPS en production (Vercel le fait automatiquement)
> - Middleware pour protéger les routes sensibles côté serveur

---

## 🔄 Alternatives

| Outil | Gratuit | Open Source | Freemium | Premium | Limites |
|-------|---------|-------------|----------|---------|---------|
| Supabase Auth | ✅ | ✅ | ✅ | — | 50K MAU gratuits |
| Clerk | ✅ | — | ✅ | ✅ | 10K MAU gratuits, UI pré-faite |
| NextAuth.js (Auth.js) | ✅ | ✅ | — | — | Config manuelle, pas de dashboard |
| Auth0 | ✅ | — | ✅ | ✅ | 7500 users gratuits |
| Firebase Auth | ✅ | — | ✅ | — | Vendor lock-in Google |
| Lucia Auth | ✅ | ✅ | — | — | Arrêté, pas recommandé |

> **Recommandation EticLab :** Supabase Auth — déjà dans la stack, 
> OAuth + magic link intégrés, 50K utilisateurs actifs gratuits par mois. 
> Pas besoin de service tiers. Si tu veux du UI pré-construit (formulaires, 
> composants), Clerk est une bonne alternative mais payant au-delà de 10K users.

---

## ✅ Checklist de validation

- [ ] Est-ce que je sais la différence entre authentification et autorisation ?
- [ ] Est-ce que je sais pourquoi utiliser `getUser()` et pas `getSession()` ?
- [ ] Est-ce que je sais protéger une route avec un middleware Next.js ?
- [ ] Est-ce que je sais où sont stockés les cookies de session ?

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Supabase Auth | Authentification complète | Gratuit (plan free) | Aucun |
| Chrome DevTools (Application) | Voir les cookies | Gratuit | Aucun |
| Supabase Dashboard (Users) | Gérer les utilisateurs | Gratuit | Aucun |
| jwt.io | Décoder un JWT | Gratuit | Ne jamais coller un vrai token |

---

## 📚 Aller plus loin

- [Supabase — Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js — Middleware documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Liens avec d'autres modules
- → T-GCLOUD01 : configuration OAuth Google dans GCP
- → C4-01-supabase : Supabase Auth est un service de Supabase
- → C3-02-routing : protection des routes via middleware
- → T-SEC01-securite : cookies, JWT, session hijacking
- → C5-01-vercel : HTTPS automatique pour les cookies secure
