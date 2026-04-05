# EticLab — Contexte de session

## C'est quoi EticLab
Laboratoire R&D personnel de Ketic (Kevin).
Objectif : comprendre chaque brique technologique 
d'un SaaS, du hardware au business.
Repo GitHub : github.com/keticwork/eticlab

## Stack personnelle de Ketic
- MacBook Air M4 / macOS
- Raspberry Pi 5
- Stack : HTML/CSS/JS → Next.js/React, Vercel, Supabase
- Projets actifs : Reflety (SaaS pages locales), 
  Benny (collecte déchets Var)
- Dossier de travail : ~/Dev/keticwork/eticlab

## Workflow
- Claude.ai (claude.ai) : réflexion, architecture, prompts
- Claude Code : exécution, fichiers, commits
- GitHub : versioning (github.com/keticwork/eticlab)

## Modules complétés aujourd'hui (05/04/2026)
- ✅ C1-01-ports — rédigé + TESTS.md
- ✅ T-01-nodejs — complet
- ✅ T-02-terminal — complet
- ✅ T-03-git — complet
- ✅ C1-02-http — complet + bug favicon corrigé + TESTS.md
- ✅ C2-01-os — complet

## Modules créés (structure vide à remplir)
- C1-03-cdn, C1-04-ssl, C2-02-env, C2-03-docker
- C2-04-git, C3-01 à C3-04, C4-01 à C4-04
- C5-01 à C5-04

## Modules à créer (identifiés en session)
- T-A01 — IA & Claude (prompts, projets, contexte)
- T-A02 — Outils & alternatives (Supabase, Vercel, etc.)
- T-A03 — Ne pas réinventer la roue
- T-01b — package.json & scripts npm

## Bugs rencontrés et documentés
- Port 3000 occupé par Benny (Next.js) → utilisé 3001
- lsof -ti:3000 | xargs kill insuffisant sur Next.js
- ERR_HTTP_HEADERS_SENT → favicon.ico non géré

## Prochaines étapes
1. Module T-A01 Claude/IA
2. Rendre le serveur visible sur le réseau (Pi ou Vercel)
3. Ajouter captures d'écran dans docs/ de chaque module
4. Créer interface visuelle EticLab (page web du labo)
