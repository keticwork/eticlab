# CDN (Content Delivery Network) — Couche 1

## Dépendances
- C1-01 — Ports (le CDN communique via HTTP/HTTPS sur les ports 80/443)
- C1-02 — HTTP (le CDN intercepte et sert les requêtes HTTP)

## 🟦 Carte d'identité

**Définition simple :**
> Imagine que tu vends des pizzas depuis une seule cuisine à Paris. 
> Un client à Marseille attend 3 heures. Solution : tu ouvres des 
> cuisines-relais dans chaque grande ville, avec les pizzas déjà 
> prêtes. Le CDN, c'est pareil : au lieu de servir ton site depuis 
> un seul serveur, tu en places des copies partout dans le monde. 
> Le visiteur reçoit le site depuis le serveur le plus proche de lui.

**Rôle technique :**
> Un CDN est un réseau de serveurs répartis géographiquement 
> (appelés "edge servers" ou "points of presence" / PoP) qui 
> mettent en cache le contenu statique de ton site (images, CSS, 
> JS, polices). Quand un visiteur fait une requête, le CDN la 
> redirige vers le serveur le plus proche, réduisant la latence.

**Ce que le CDN sert (contenu statique) :**
| Type | Exemples | Cacheable ? |
|------|----------|-------------|
| Images | .jpg, .png, .webp, .svg | Oui |
| Styles | .css | Oui |
| Scripts | .js (bundles) | Oui |
| Polices | .woff2, .ttf | Oui |
| HTML | pages statiques | Oui (avec précaution) |
| API | réponses dynamiques | Non (sauf configuration) |

**Schéma mental :**
```
Sans CDN :
  Visiteur (Marseille) → Serveur (Paris) → 150ms

Avec CDN :
  Visiteur (Marseille) → Edge server (Marseille) → 10ms
                         ↑ copie cachée du site
                         ↑ mise à jour depuis le serveur d'origine
```

---

## 🟩 Sous le capot

**Mécanisme — Comment un CDN fonctionne :**
> 1. Tu déploies ton site sur un serveur d'origine (ex: Vercel)
> 2. Le CDN copie ton contenu statique sur ses edge servers
> 3. Quand un visiteur charge ton site, le DNS le redirige 
>    vers l'edge server le plus proche
> 4. L'edge server vérifie s'il a une copie en cache :
>    - Oui → il sert directement (cache HIT) — ultra rapide
>    - Non → il demande au serveur d'origine, stocke la copie, 
>      puis sert le visiteur (cache MISS) — première fois plus lent
> 5. Le cache a une durée de vie (TTL — Time To Live). 
>    Après expiration, l'edge server re-vérifie auprès de l'origine

**Les headers HTTP liés au cache :**
```
Cache-Control: public, max-age=31536000
  → "Ce fichier peut être caché 1 an par tout le monde"

Cache-Control: no-cache
  → "Tu peux cacher, mais vérifie toujours avant de servir"

Cache-Control: no-store
  → "Ne cache jamais ce contenu" (données sensibles)

ETag: "abc123"
  → Empreinte du fichier — si elle change, le cache est invalidé
```

**Observer le CDN en action :**
```bash
# Voir les headers de cache d'un site
curl -I https://ton-site.vercel.app

# Chercher ces headers dans la réponse :
# x-vercel-cache: HIT   → servi depuis le cache Vercel
# x-vercel-cache: MISS  → servi depuis l'origine
# cache-control: ...     → politique de cache

# Mesurer la latence avec et sans CDN
curl -o /dev/null -s -w "Temps total: %{time_total}s\n" https://ton-site.vercel.app

# Voir les DNS et d'où vient la réponse
dig ton-site.vercel.app
nslookup ton-site.vercel.app
```

**Pourquoi Vercel est déjà un CDN :**
> Quand tu déploies sur Vercel, ton site est automatiquement 
> distribué sur le Edge Network de Vercel (~300 PoP dans le monde). 
> Tu n'as rien à configurer — c'est inclus. C'est l'un des 
> avantages d'utiliser Vercel plutôt qu'un serveur classique.

---

## 🟥 Laboratoire de test

**POC 1 — Voir le cache en action sur un vrai site :**
```bash
# Première requête (potentiellement MISS)
curl -s -I https://vercel.com | grep -i cache

# Deuxième requête (devrait être HIT)
curl -s -I https://vercel.com | grep -i cache

# Comparer les temps de réponse
curl -o /dev/null -s -w "%{time_total}\n" https://vercel.com
curl -o /dev/null -s -w "%{time_total}\n" https://vercel.com
```

**POC 2 — Comparer avec et sans CDN :**
```bash
# Ton serveur local (pas de CDN)
curl -o /dev/null -s -w "Local: %{time_total}s\n" http://localhost:3001

# Un site sur Vercel (avec CDN)
curl -o /dev/null -s -w "Vercel: %{time_total}s\n" https://vercel.com
```
> Le site Vercel sera souvent plus rapide, même si le serveur 
> d'origine est plus loin — grâce au cache CDN.

**POC 3 — Inspecter dans Chrome DevTools :**
> 1. Ouvre un site déployé sur Vercel
> 2. F12 → onglet Network
> 3. Recharge la page
> 4. Clique sur une ressource (image, CSS, JS)
> 5. Regarde les Response Headers :
>    - `cache-control` → politique de cache
>    - `x-vercel-cache` → HIT ou MISS
>    - `age` → depuis combien de secondes c'est caché

**Test de panne :**
> Si le CDN tombe (très rare), les requêtes sont redirigées 
> vers le serveur d'origine. Le site fonctionne toujours, 
> mais plus lentement. C'est le "fallback to origin".

---

## 💀 Zone de hack

**Vulnérabilité classique — cache poisoning :**
> Un attaquant peut manipuler les requêtes pour que le CDN 
> cache une version modifiée d'une page. Tous les visiteurs 
> reçoivent ensuite la version empoisonnée depuis le cache.

**Autre risque — servir du contenu obsolète :**
> Si tu mets à jour ton site mais que le cache CDN n'est pas 
> invalidé, les visiteurs voient l'ancienne version pendant 
> toute la durée du TTL. C'est pourquoi les frameworks modernes 
> (Next.js) ajoutent un hash dans les noms de fichiers :
> `main.abc123.js` → nouveau hash = nouveau fichier = pas de cache périmé.

**Vérification :**
```bash
# Vérifier que le cache se renouvelle correctement
# Déploie une modification, puis :
curl -s -I https://ton-site.vercel.app | grep -i "x-vercel-cache"
# Devrait passer de HIT à MISS après un déploiement
```

**Contre-mesure :**
> - Ne jamais cacher les réponses dynamiques sans validation
> - Utiliser des noms de fichiers avec hash (fait automatiquement par Next.js)
> - Sur Vercel : le cache est invalidé automatiquement à chaque déploiement
> - Configurer des TTL courts pour le contenu qui change souvent

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| DevTools Network | Inspecter les headers de cache | Gratuit, intégré | Aucun |
| curl -I | Voir les headers depuis le terminal | Gratuit, intégré | Aucun |
| dig / nslookup | Voir la résolution DNS (quel edge server) | Gratuit, intégré | Aucun |
| WebPageTest | Tester la performance depuis différentes villes | Gratuit | Aucun |
| Lighthouse | Auditer la performance d'un site | Gratuit (Chrome) | Aucun |

## 🔄 Alternatives

| Outil | Type | Modèle | Avantage | Inconvénient |
|-------|------|--------|----------|--------------|
| Vercel Edge Network | CDN intégré à la plateforme | Freemium (inclus dans Vercel) | Zéro config, invalidation auto | Lié à Vercel |
| Cloudflare | CDN + sécurité + DNS | Freemium (plan gratuit généreux) | Gratuit pour la plupart des usages, WAF inclus | Interface complexe |
| AWS CloudFront | CDN Amazon | Premium (pay-per-use) | Très configurable, intégration AWS | Complexe, coûteux à grande échelle |
| Bunny CDN | CDN simple et rapide | Premium (à partir de 1$/mois) | Pas cher, simple, performant | Moins connu |
| jsDelivr | CDN pour librairies open source | Gratuit / open source | Parfait pour servir des packages npm/GitHub | Uniquement pour du contenu public |

> **Recommandation EticLab :** Vercel inclut déjà un CDN — pas besoin 
> d'en configurer un séparément. Si tu héberges toi-même (Raspberry Pi), 
> Cloudflare gratuit est le meilleur choix pour ajouter un CDN devant.

## Liens avec d'autres modules
- → C1-01-ports : le CDN sert sur les ports 80 (HTTP) et 443 (HTTPS)
- → C1-02-http : le CDN intercepte les requêtes HTTP et sert le cache
- → C1-04-ssl : le CDN gère souvent le certificat SSL pour toi
- → C5-01-vercel : Vercel inclut un CDN automatiquement
- → C4-04-nextjs : Next.js optimise les assets pour le cache CDN (hash dans les noms)
