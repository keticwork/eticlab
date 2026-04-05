# Tests réels — Ports

## Test 1 — Conflit de port
- Benny (Next.js) occupe le port 3000
- lsof -ti:3000 | xargs kill n'a pas suffi
- Raison : Next.js crée des processus enfants
- Solution correcte : pkill -f "next dev"

## Test 2 — Observer les ports ouverts
- Commande : lsof -i -P -n | grep LISTEN
- Résultat : ports 3000 (Benny), 53 (DNS), etc.
