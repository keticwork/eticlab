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

## Format des modules
Le template standard est dans : _template/README.md
Toujours lire ce fichier avant de générer un nouveau module.

## Modules complétés aujourd'hui (05/04/2026)
- ✅ C1-01-ports — rédigé + TESTS.md
- ✅ T-01-nodejs — complet
- ✅ T-02-terminal — complet
- ✅ T-03-git — complet
- ✅ C1-02-http — complet + bug favicon corrigé + TESTS.md
- ✅ C2-01-os — complet
- ✅ T-A01 — Claude & IA — complet
- ✅ T-01b — package.json & scripts npm — complet
- ✅ C1-03 — CDN — complet
- ✅ C1-04 — SSL/HTTPS — complet
- ✅ C3-01 — Next.js & React — complet
- ✅ C3-02 — Routing — complet
- ✅ C3-03 — Composants & UI — complet
- ✅ C4-01 — Supabase — complet
- ✅ C4-02 — API REST — complet
- ✅ C5-01 — Vercel — complet
- ✅ T-A02 — Outils & alternatives — complet
- ✅ T-A03 — SEO & LLM-friendly — complet
- ✅ T-SEC01 — Sécurité web — complet
- ✅ T-LEG01 — Légal & RGPD — complet

## Modules créés (structure vide à remplir)
- C1-03-cdn, C1-04-ssl, C2-02-env, C2-03-docker
- C2-04-git, C3-01 à C3-04, C4-01 à C4-04
- C5-01 à C5-04

## Modules à créer (identifiés en session)
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

## Vision EticLab (plateforme de formation)
Objectif final : plateforme interactive de formation technique,
lisible comme un livre ET utilisable comme un outil de guidage IA.

### Expérience utilisateur
- Responsive mobile-first — lisible sur téléphone
- Schéma/diagramme interactif des modules
- Chat IA intégré : l'utilisateur décrit son projet → 
  le fil rouge se génère dynamiquement
- Parcours modulaire et extensible (fonctionnalités optionnelles)
- Pas d'authentification pour l'instant

### Contenu prévu
- Modules techniques (stack web, DevOps, BDD...)
- Modules IA : Claude, Gemini, génération image/vidéo, etc.
- Structure extensible : facile d'ajouter un module au bon endroit

### Stack technique
- Next.js / React (frontend)
- Supabase (base de données, freemium)
- Vercel pro (hébergement — déploiement après tests locaux uniquement)
- API Claude ou Gemini pour le chat guidage

### Back-office superadmin
- Dashboard : coût par requête API, usage total
- Système de limitation des coûts (mode gratuit pour bêta amis)

### Monétisation
- Liens affiliés dans la section Alternatives de chaque module
  (outils payants : Vercel, Supabase pro, hébergeurs, etc.)
- Champ "lien affilié" à ajouter dans le tableau Alternatives
  quand la plateforme sera en ligne

### Structure de la plateforme
- Landing page : présentation du concept + CTA inscription
- Modules : accessibles gratuitement sans compte (avec affiliation)
- Compte gratuit : sauvegarde progression, accès modules
- Compte payant : accès IA, génération parcours dynamique, prompts

### SEO & LLM-friendly (priorité dès le début)
- URLs propres : /modules/c1-04-ssl
- SSR Next.js pour pages lisibles sans JS
- Balises meta + H1/H2 structurés sur chaque module
- Sitemap.xml généré automatiquement
- Fichier llms.txt à la racine pour les IA
- Module dédié : T-A03 — SEO & LLM-friendly (à créer)

### Sécurité (priorité dès le début)
- Pas de clés API exposées côté client
- Variables d'environnement correctement séparées
- Protection XSS, injection SQL, CSRF
- Rate limiting sur les routes API et IA
- RLS (Row Level Security) activé sur Supabase
- Headers de sécurité HTTP (CSP, HSTS...)
- Module dédié : T-SEC01 — Sécurité web (à créer)

### Légal & RGPD (obligatoire dès le lancement)
- Mentions légales (société Etic — autoentrepreneur → SASU)
- Politique de confidentialité
- Gestion des cookies : consentement RGPD
- CGU (conditions générales d'utilisation)
- CGV (conditions générales de vente) si paiement
- Module dédié : T-LEG01 — Légal & RGPD (à créer)

### Société
- Nom : Etic
- Statut actuel : autoentrepreneur
- Statut futur : SASU
- Projet : EticLab (plateforme de formation)

### IA — fonctionnalités avancées
- L'IA génère le parcours dynamique selon l'objectif utilisateur
- Pour chaque étape du parcours, l'IA propose un prompt
  prêt à utiliser dans Claude, Cursor, ChatGPT ou autre
- L'utilisateur peut ainsi utiliser n'importe quelle IA externe
  en s'appuyant sur le contenu EticLab comme référence

### Contraintes
- Déploiement Vercel uniquement après tests locaux validés
- Mettre Benny en pause sur Supabase avant création projet EticLab

## Feuille de route des modules (ordre logique)
### Phase 1 — Fondations
- ✅ T-01-nodejs
- ✅ T-02-terminal
- ✅ T-03-git
- ✅ T-A01-claude
- ✅ T-01b — package.json & scripts npm
- ✅ C1-03 — CDN
- ✅ C1-04 — SSL

### Phase 1b — Bases du web
- 🔲 C2-02 — HTML (structure d'une page)
- 🔲 C2-03 — CSS (mise en forme et responsive)
- 🔲 C2-04 — JavaScript (logique et interactivité)
- 🔲 C2-05 — DOM (comment JS manipule une page)

### Phase 2 — L'appli
- ✅ C3-01 — Next.js / React (structure)
- ✅ C3-02 — Routing (navigation)
- ✅ C3-03 — Composants & UI

### Phase 3 — Les données
- ✅ C4-01 — Supabase (base de données)
- ✅ C4-02 — API REST

### Phase 4 — Mise en ligne
- ✅ C5-01 — Vercel (déploiement)
- ✅ T-A02 — Outils & alternatives
- ✅ T-A03 — SEO & LLM-friendly
- 🔲 T-A03b — Landing page & structure plateforme
- ✅ T-SEC01 — Sécurité web
- ✅ T-LEG01 — Légal & RGPD

## Convention alternatives
Chaque module doit inclure une section Alternatives.
Minimum 2 alternatives, classées par : gratuit / open source / freemium / premium.
