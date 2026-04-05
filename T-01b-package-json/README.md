# package.json & scripts npm — Couche T (Tooling)

## Dépendances
- T-01 — Node.js & npm (package.json est le fichier central de npm)
- T-02 — Terminal (on lance les scripts depuis le terminal)

## 🟦 Carte d'identité

**Définition simple :**
> package.json c'est la fiche d'identité de ton projet. 
> Il dit : "Ce projet s'appelle X, il a besoin des briques Y et Z, 
> et voici les commandes pour le lancer." Sans ce fichier, npm 
> ne sait rien de ton projet — il ne peut rien installer, 
> rien lancer, rien publier.

**Rôle technique :**
> package.json est un fichier JSON à la racine de chaque projet 
> Node.js. Il contient :
> - Le nom et la version du projet
> - La liste des dépendances (les briques téléchargées via npm)
> - Les scripts (les commandes automatisées)
> - Les métadonnées (auteur, licence, description)

**Ce que package.json n'est PAS :**
- Ce n'est pas du code exécutable (c'est de la configuration)
- Ce n'est pas optionnel (sans lui, `npm install` ne fait rien)
- Ce n'est pas le même fichier que package-lock.json (le lock 
  fige les versions exactes — on n'y touche jamais manuellement)

**Schéma mental :**
```
package.json  →  "Quoi installer et comment lancer"
     ↓
npm install   →  Télécharge tout dans node_modules/
     ↓
npm run dev   →  Lance le script "dev" défini dans package.json
```

---

## 🟩 Sous le capot

**Anatomie d'un package.json :**
```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "description": "Mon premier projet Node.js",
  "main": "index.js",
  "scripts": {
    "dev": "node src/serveur.js",
    "start": "node src/serveur.js",
    "build": "echo 'Pas de build pour l'instant'",
    "test": "echo 'Pas de tests pour l'instant'"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**Les champs essentiels :**
| Champ | Rôle | Exemple |
|-------|------|---------|
| name | Nom du projet | "eticlab" |
| version | Version sémantique | "1.0.0" |
| scripts | Commandes automatisées | "dev": "node server.js" |
| dependencies | Briques nécessaires en prod | express, next |
| devDependencies | Briques nécessaires en dev uniquement | nodemon, eslint |

**Comprendre les versions (semver) :**
```
"express": "^4.18.2"
              │ │  │
              │ │  └── patch (corrections de bugs)
              │ └──── minor (nouvelles fonctionnalités)
              └────── major (changements cassants)

^  = accepte minor + patch (^4.18.2 → 4.x.x)
~  = accepte patch uniquement (~4.18.2 → 4.18.x)
   = version exacte (4.18.2 → 4.18.2 uniquement)
```

**Les scripts npm — automatiser tes commandes :**
```bash
# Lancer un script défini dans package.json
npm run dev        # Lance le script "dev"
npm run build      # Lance le script "build"
npm test           # Raccourci pour npm run test
npm start          # Raccourci pour npm run start

# Scripts spéciaux (pas besoin de "run") :
# npm start, npm test, npm stop
```

**Outils d'observation :**
```bash
# Voir le package.json du projet
cat package.json

# Voir les scripts disponibles
npm run              # Liste tous les scripts

# Voir les dépendances installées
npm list --depth=0   # Niveau racine
npm list             # Tout l'arbre

# Voir si des dépendances sont obsolètes
npm outdated
```

---

## 🟥 Laboratoire de test

**POC 1 — Créer un package.json de zéro :**
```bash
# Créer un dossier de test
mkdir ~/test-npm && cd ~/test-npm

# Initialiser un package.json (questions interactives)
npm init

# Ou version rapide (tout par défaut)
npm init -y
```

**POC 2 — Installer et comprendre les dépendances :**
```bash
# Installer une dépendance de production
npm install chalk
# → Ajouté dans "dependencies" de package.json
# → Téléchargé dans node_modules/

# Installer une dépendance de dev
npm install --save-dev nodemon
# → Ajouté dans "devDependencies"

# Voir ce qui a changé
cat package.json
ls node_modules/
```

**POC 3 — Créer et lancer un script custom :**
> Ajouter dans package.json :
```json
"scripts": {
  "hello": "echo 'Bonjour depuis un script npm !'",
  "ports": "lsof -i -P -n | grep LISTEN"
}
```
> Puis lancer :
```bash
npm run hello
npm run ports
```

**Test de panne :**
> Supprime node_modules/ et relance ton projet :
```bash
rm -rf node_modules
npm run dev
# → Erreur : les dépendances ne sont plus là
npm install
# → Tout est retéléchargé grâce à package.json
```
> C'est exactement pourquoi on ne commite jamais node_modules/ 
> (il est dans .gitignore). package.json suffit à tout reconstruire.

---

## 💀 Zone de hack

**Vulnérabilité classique — scripts npm malveillants :**
> Un paquet npm peut définir des scripts qui s'exécutent 
> automatiquement à l'installation (preinstall, postinstall). 
> Un paquet malveillant peut exécuter du code sur ta machine 
> juste avec `npm install`.

**Vérification :**
```bash
# Voir les scripts d'un paquet AVANT de l'installer
npm info nom-du-paquet scripts

# Auditer les vulnérabilités connues
npm audit

# Installer sans exécuter les scripts (mode parano)
npm install --ignore-scripts
```

**Contre-mesure :**
> - Vérifier le nombre de téléchargements hebdomadaires sur npmjs.com
> - Lire le package.json d'un paquet avant de l'installer
> - Ne jamais installer un paquet trouvé au hasard sur internet
> - Utiliser `npm audit` après chaque `npm install`

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| npm | Gestionnaire de paquets par défaut | Gratuit, inclus avec Node.js | Scripts malveillants |
| package.json | Fichier de configuration projet | Gratuit (fichier) | Mauvaises versions |
| npm audit | Scanner les vulnérabilités | Gratuit | Faux positifs |
| npx | Exécuter sans installer | Inclus avec npm | Exécution de code distant |
| nodemon | Redémarrage auto en dev | Gratuit, open source | Dev uniquement |

## 🔄 Alternatives

| Outil | Type | Modèle | Avantage | Inconvénient |
|-------|------|--------|----------|--------------|
| npm | Gestionnaire de paquets | Gratuit / open source | Par défaut, universel | Lent sur gros projets |
| pnpm | Gestionnaire de paquets | Gratuit / open source | Rapide, économe en disque | Moins connu, liens symboliques |
| yarn | Gestionnaire de paquets | Gratuit / open source | Rapide, workspaces natifs | Fragmentation (v1 vs v2+) |
| bun | Runtime + gestionnaire | Gratuit / open source | Ultra rapide, tout-en-un | Jeune, compatibilité partielle |

> **Recommandation EticLab :** rester sur npm pour apprendre 
> (c'est le standard). Passer à pnpm quand on maîtrise les bases 
> et qu'on veut optimiser.

## Liens avec d'autres modules
- → T-01-nodejs : npm est livré avec Node.js
- → T-02-terminal : on lance les scripts npm dans le terminal
- → T-03-git : .gitignore doit exclure node_modules/
- → C3-01-nextjs : Next.js utilise package.json pour ses scripts (dev, build, start)
