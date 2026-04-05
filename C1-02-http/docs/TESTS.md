# Tests réels — HTTP

## Test 1 — Serveur multi-routes
- Commande : node C1-02-http/src/serveur-routes.js
- Port utilisé : 3001 (3000 occupé par projet Benny/Next.js)
- Résultat : page visible sur http://localhost:3001
- Routes testées : /, /about, /api, /url-inexistante (404)

## Observation
Benny (projet Next.js) occupait le port 3000.
Le conflit de ports est réel et documenté dans C1-01.
