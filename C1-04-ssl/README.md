# SSL / TLS / HTTPS — Couche 1

## Dépendances
- C1-01 — Ports (HTTPS = port 443)
- C1-02 — HTTP (HTTPS = HTTP + chiffrement)
- C1-03 — CDN (le CDN gère souvent le certificat SSL pour toi)

## 🟦 Carte d'identité

**Définition simple :**
> Imagine que tu envoies une lettre. En HTTP, la lettre est 
> ouverte — le facteur, tes voisins, n'importe qui peut la lire. 
> En HTTPS, la lettre est dans une enveloppe scellée — seul le 
> destinataire peut l'ouvrir. Le certificat SSL, c'est le sceau 
> qui prouve que l'enveloppe n'a pas été ouverte en chemin, 
> et que le destinataire est bien celui qu'il prétend être.

**Rôle technique :**
> SSL (Secure Sockets Layer) / TLS (Transport Layer Security) 
> est un protocole de chiffrement qui protège les données en 
> transit entre le navigateur et le serveur. HTTPS = HTTP + TLS. 
> Un certificat SSL est un fichier qui prouve l'identité du 
> serveur et permet d'établir une connexion chiffrée.

**Vocabulaire à ne pas confondre :**
| Terme | Signification |
|-------|---------------|
| SSL | Ancien nom du protocole (obsolète, remplacé par TLS) |
| TLS | Version moderne du protocole (TLS 1.3 = le standard actuel) |
| HTTPS | HTTP + TLS = communication web chiffrée |
| Certificat SSL | Fichier qui prouve l'identité du serveur |
| CA (Certificate Authority) | Organisme qui délivre les certificats |
| Let's Encrypt | CA gratuite et automatique |

**Ce qu'on dit "SSL" mais qu'on devrait dire "TLS" :**
> Tout le monde dit "certificat SSL" par habitude, mais en réalité 
> SSL est mort depuis 2015. On utilise TLS 1.2 ou 1.3. 
> C'est comme dire "Frigidaire" pour un réfrigérateur.

---

## 🟩 Sous le capot

**Mécanisme — Le "handshake" TLS (ce qui se passe en 50ms) :**
> Quand tu ouvres https://google.com, voici ce qui se passe 
> AVANT que la moindre page ne s'affiche :
> 1. **Client Hello** — Ton navigateur dit : "Bonjour, je parle 
>    TLS 1.3, voici les méthodes de chiffrement que je connais"
> 2. **Server Hello** — Le serveur répond : "OK, utilisons 
>    cette méthode, voici mon certificat SSL"
> 3. **Vérification** — Ton navigateur vérifie le certificat :
>    - Est-il signé par une CA de confiance ?
>    - Est-il encore valide (pas expiré) ?
>    - Le nom de domaine correspond-il ?
> 4. **Échange de clés** — Navigateur et serveur créent une 
>    clé de session unique (chiffrement symétrique)
> 5. **Connexion chiffrée** — Toutes les données sont maintenant 
>    chiffrées. La page peut s'afficher.

**Schéma du handshake :**
```
Navigateur                          Serveur
    │                                   │
    │──── Client Hello ────────────────→│
    │                                   │
    │←─── Server Hello + Certificat ────│
    │                                   │
    │──── Vérification OK ─────────────→│
    │     + échange de clés             │
    │                                   │
    │←──── Connexion chiffrée ──────────│
    │      (toutes les données)         │
```

**Observer le certificat SSL d'un site :**
```bash
# Voir le certificat complet d'un site
openssl s_client -connect google.com:443 -servername google.com </dev/null 2>/dev/null | openssl x509 -text -noout

# Version courte — juste les dates de validité
openssl s_client -connect google.com:443 -servername google.com </dev/null 2>/dev/null | openssl x509 -dates -noout

# Voir la chaîne de certificats
openssl s_client -connect google.com:443 -showcerts </dev/null 2>/dev/null

# Vérifier la version TLS utilisée
curl -vI https://google.com 2>&1 | grep "SSL connection"
```

**Dans Chrome DevTools :**
> 1. Clique sur le cadenas 🔒 dans la barre d'adresse
> 2. "La connexion est sécurisée" → Certificat
> 3. Tu vois : émetteur (CA), validité, domaine couvert

---

## 🟥 Laboratoire de test

**POC 1 — Comparer HTTP vs HTTPS :**
```bash
# Ton serveur local (HTTP — pas de certificat)
curl -v http://localhost:3001 2>&1 | head -20
# → Pas de handshake TLS, pas de chiffrement

# Un vrai site en HTTPS
curl -v https://vercel.com 2>&1 | head -30
# → Tu vois le handshake TLS, la version, le certificat
```

**POC 2 — Inspecter un certificat :**
```bash
# Certificat de Vercel
echo | openssl s_client -connect vercel.com:443 -servername vercel.com 2>/dev/null | openssl x509 -dates -subject -issuer -noout

# Résultat attendu :
# notBefore = date de début
# notAfter  = date d'expiration
# subject   = le domaine couvert
# issuer    = la CA qui a signé (ex: Let's Encrypt)
```

**POC 3 — Voir ce qui se passe avec un certificat expiré :**
```bash
# Tester un site avec un certificat volontairement invalide
curl https://expired.badssl.com
# → Erreur SSL certificate problem
# C'est exactement ce que ton navigateur bloque avec le ⚠️

# Forcer la connexion malgré le certificat invalide (dangereux)
curl -k https://expired.badssl.com
# → Ça marche, mais les données ne sont pas protégées
```

**Test de panne :**
> Si le certificat SSL expire :
> - Chrome affiche "Votre connexion n'est pas privée" (ERR_CERT_DATE_INVALID)
> - Les visiteurs ne peuvent plus accéder au site
> - Sur Vercel : impossible — le renouvellement est automatique
> - Sur un serveur perso : il faut renouveler manuellement 
>   (ou automatiser avec certbot)

---

## 💀 Zone de hack

**Vulnérabilité classique — Man in the Middle (MITM) :**
> Sans HTTPS, un attaquant sur le même réseau WiFi peut 
> intercepter toutes les données entre toi et le serveur : 
> mots de passe, cookies, données personnelles. 
> C'est l'attaque la plus basique et la plus courante 
> sur les WiFi publics (cafés, hôtels, aéroports).

**Autre risque — certificat auto-signé :**
> N'importe qui peut créer un certificat SSL. Mais s'il 
> n'est pas signé par une CA de confiance, le navigateur 
> affiche un avertissement. Un attaquant pourrait créer 
> un faux certificat pour usurper l'identité d'un site.

**Vérification — Tester la sécurité SSL d'un site :**
```bash
# Voir quelle version TLS est utilisée
curl -vI https://ton-site.vercel.app 2>&1 | grep "SSL connection"
# Devrait afficher TLS 1.3 (le plus récent)

# Vérifier que les anciennes versions dangereuses sont désactivées
# TLS 1.0 et 1.1 sont considérées vulnérables
openssl s_client -connect ton-site.vercel.app:443 -tls1 </dev/null 2>&1 | grep "error"
# → Devrait échouer (TLS 1.0 refusé = c'est bien)
```

**Contre-mesure :**
> - Toujours HTTPS en production (jamais HTTP pour des données sensibles)
> - Utiliser Let's Encrypt (gratuit) ou le SSL auto de Vercel
> - Ne jamais ignorer les avertissements de certificat du navigateur
> - Activer HSTS (force le navigateur à toujours utiliser HTTPS)
> - Sur le Raspberry Pi : utiliser certbot pour obtenir un certificat gratuit

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| openssl | Inspecter les certificats | Gratuit, intégré | Complexe |
| curl -v | Voir le handshake TLS | Gratuit, intégré | Aucun |
| Chrome DevTools | Voir le certificat dans le navigateur | Gratuit | Aucun |
| badssl.com | Tester avec des certificats invalides | Gratuit | Aucun |
| certbot | Obtenir un certificat Let's Encrypt | Gratuit, open source | Config serveur |

## 🔄 Alternatives

| Outil | Type | Modèle | Avantage | Inconvénient |
|-------|------|--------|----------|--------------|
| Let's Encrypt + certbot | CA + outil automatique | Gratuit / open source | Standard, automatisable, reconnu par tous les navigateurs | Config manuelle sur serveur, renouvellement tous les 90 jours |
| Vercel SSL | Certificat intégré | Freemium (inclus dans Vercel) | Zéro configuration, renouvellement automatique | Uniquement sur Vercel |
| Cloudflare SSL | SSL via proxy CDN | Freemium (plan gratuit) | Gratuit, facile, protège même un serveur sans SSL | Le trafic passe par Cloudflare (confiance requise) |
| AWS Certificate Manager | Certificats pour services AWS | Gratuit (avec services AWS) | Intégré à l'écosystème AWS | Uniquement sur AWS, complexe |
| Certificats payants (DigiCert, Sectigo) | CA commerciales | Premium (50-500$/an) | Support, garantie financière, certificats EV (barre verte) | Cher, pas nécessaire pour la plupart des sites |

> **Recommandation EticLab :** Sur Vercel, le SSL est automatique — 
> rien à faire. Sur le Raspberry Pi, utiliser Let's Encrypt avec 
> certbot. Ne jamais payer pour un certificat SSL basique — 
> Let's Encrypt fait exactement la même chose, gratuitement.

## Liens avec d'autres modules
- → C1-01-ports : HTTPS utilise le port 443
- → C1-02-http : HTTPS = HTTP + chiffrement TLS
- → C1-03-cdn : le CDN (Vercel, Cloudflare) gère le certificat SSL
- → C3-03-securite : SSL est la première couche de sécurité
- → C5-01-vercel : Vercel fournit SSL automatiquement
