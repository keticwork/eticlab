`Couche 1 — Transport & protocoles`

# CDN (Content Delivery Network)

> Comprendre comment un réseau de serveurs distribués accélère la livraison de ton site web.

**Prérequis :** `C1-01` `C1-02`

**Ce que tu vas apprendre :**
- Ce qu'est un CDN et pourquoi ça accélère un site
- La différence entre cache HIT et cache MISS
- Comment observer le cache avec curl et DevTools

---

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

**Schéma** :
📸 à ajouter dans docs/

**Ce que le CDN sert (contenu statique) :**
| Type | Exemples | Cacheable ? |
|------|----------|-------------|
| Images | .jpg, .png, .webp, .svg | Oui |
| Styles | .css | Oui |
| Scripts | .js (bundles) | Oui |
| Polices | .woff2, .ttf | Oui |
| HTML | pages statiques | Oui (avec précaution) |
| API | réponses dynamiques | Non (sauf configuration) |

---

## 🟩 Sous le capot

**Mécanisme :**
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

**Outils d'observation :**
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

**Schéma technique** :
```mermaid
graph LR
  A[Visiteur Marseille] --> B[Edge Marseille]
  B -->|cache HIT| A
  B -->|cache MISS| C[Serveur origine Paris]
  C --> B
```

**Pourquoi Vercel est déjà un CDN :**
> Quand tu déploies sur Vercel, ton site est automatiquement 
> distribué sur le Edge Network de Vercel (~300 PoP dans le monde). 
> Tu n'as rien à configurer — c'est inclus.

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

**Commande clé à retenir :**
```bash
curl -s -I https://ton-site.vercel.app | grep -i cache
```

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

**Contre-mesure :**
> - Ne jamais cacher les réponses dynamiques sans validation
> - Utiliser des noms de fichiers avec hash (fait automatiquement par Next.js)
> - Sur Vercel : le cache est invalidé automatiquement à chaque déploiement
> - Configurer des TTL courts pour le contenu qui change souvent

---

## 🔄 Alternatives

| Outil | Gratuit | Open Source | Freemium | Premium | Limites |
|-------|---------|-------------|----------|---------|---------|
| Vercel Edge Network | — | — | ✅ | — | Lié à Vercel |
| Cloudflare | ✅ | — | ✅ | ✅ | Interface complexe |
| jsDelivr | ✅ | ✅ | — | — | Contenu public uniquement |
| Bunny CDN | — | — | — | ✅ (1$/mois) | Moins connu |
| AWS CloudFront | — | — | — | ✅ | Complexe, coûteux |

> **Recommandation EticLab :** Vercel inclut déjà un CDN — pas besoin 
> d'en configurer un séparément. Si tu héberges toi-même (Raspberry Pi), 
> Cloudflare gratuit est le meilleur choix.

---

## ✅ Checklist de validation

- [ ] Est-ce que je sais expliquer ce qu'est un CDN à quelqu'un ?
- [ ] Est-ce que je sais la différence entre cache HIT et MISS ?
- [ ] Est-ce que je sais vérifier les headers de cache avec curl ?
- [ ] Est-ce que je sais pourquoi Vercel est déjà un CDN ?

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| DevTools Network | Inspecter les headers de cache | Gratuit, intégré | Aucun |
| curl -I | Voir les headers depuis le terminal | Gratuit, intégré | Aucun |
| dig / nslookup | Voir la résolution DNS (quel edge server) | Gratuit, intégré | Aucun |
| WebPageTest | Tester la performance depuis différentes villes | Gratuit | Aucun |
| Lighthouse | Auditer la performance d'un site | Gratuit (Chrome) | Aucun |

---

## 📚 Aller plus loin

- [Cloudflare — What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [WebPageTest — tester la performance](https://www.webpagetest.org)

## Liens avec d'autres modules
- → C1-01-ports : le CDN sert sur les ports 80 (HTTP) et 443 (HTTPS)
- → C1-02-http : le CDN intercepte les requêtes HTTP et sert le cache
- → C1-04-ssl : le CDN gère souvent le certificat SSL pour toi
- → C5-01-vercel : Vercel inclut un CDN automatiquement
- → C3-01-nextjs : Next.js optimise les assets pour le cache CDN
