# HTTP / HTTPS — Couche 1

## Dépendances
- T-01 — Node.js (pour créer un serveur HTTP)
- C1-01 — Ports (HTTP = port 80, HTTPS = port 443)

## 🟦 Carte d'identité

**Définition simple :**
> HTTP c'est la langue que parlent le navigateur et le serveur. 
> Quand tu tapes une URL, ton navigateur envoie une "requête" 
> en HTTP. Le serveur répond avec une "réponse". C'est tout.
> HTTPS c'est la même chose mais chiffré — personne ne peut 
> lire la conversation en chemin.

**Anatomie d'une requête HTTP :**
```
GET /index.html HTTP/1.1
Host: localhost:3000
User-Agent: Chrome/120
Accept: text/html
```

**Anatomie d'une réponse HTTP :**
```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...</html>
```

**Les codes de statut essentiels :**
| Code | Signification |
|------|---------------|
| 200 | OK — ça marche |
| 301 | Redirection permanente |
| 404 | Page non trouvée |
| 403 | Accès interdit |
| 500 | Erreur serveur |

---

## 🟩 Sous le capot

**Le cycle complet d'une requête :**
> 1. Tu tapes `localhost:3000` dans Chrome
> 2. Chrome crée une requête HTTP GET
> 3. L'OS envoie le paquet vers le port 3000
> 4. Node.js reçoit la requête
> 5. Node.js prépare une réponse HTML
> 6. Chrome reçoit la réponse et affiche la page

**Observer les requêtes HTTP en vrai :**
```bash
# Faire une requête HTTP depuis le terminal
curl http://localhost:3000

# Voir les headers de la réponse
curl -I http://localhost:3000

# Voir TOUT (requête + réponse)
curl -v http://localhost:3000
```

---

## 🟥 Laboratoire de test

**POC — Serveur qui répond différemment selon l'URL :**
Voir src/serveur-routes.js

**Test dans le navigateur (DevTools) :**
> 1. Lance le serveur
> 2. Ouvre Chrome sur localhost:3000
> 3. F12 → onglet "Network"
> 4. Recharge la page
> 5. Tu vois la requête GET et la réponse 200

---

## 💀 Zone de hack

**Vulnérabilité classique — HTTP sans S :**
> Sur HTTP (sans chiffrement), n'importe qui sur le même 
> réseau WiFi peut lire tes requêtes. Dans un café, 
> quelqu'un peut voir tes identifiants si le site 
> n'utilise pas HTTPS.

**Simulation :**
```bash
# Voir le trafic réseau non chiffré
# (nécessite Wireshark — à installer séparément)
# C'est pour ça que HTTPS est obligatoire en prod
```

**Contre-mesure :**
> - Toujours HTTPS en production
> - Ne jamais envoyer de données sensibles en HTTP
> - Vercel et Netlify activent HTTPS automatiquement

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| curl | Requêtes HTTP terminal | Gratuit, intégré | Aucun |
| Postman | Tester des API | Gratuit | Lourd |
| Bruno | Alternative Postman | Gratuit, open source | Moins connu |
| DevTools Network | Observer requêtes | Intégré Chrome | Aucun |

## Liens avec d'autres modules
- → C1-01-ports : HTTP utilise le port 80/443
- → T-01-nodejs : Node.js crée les serveurs HTTP
- → C3-01-api : les API REST utilisent HTTP
- → C1-03-cdn : le CDN optimise la livraison HTTP
