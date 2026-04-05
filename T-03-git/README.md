# Git & GitHub — Couche T

## Dépendances
- T-02 — Terminal (pour utiliser git en ligne de commande)

## 🟦 Carte d'identité

**Définition simple :**
> Git c'est une machine à remonter le temps pour ton code. 
> Chaque "commit" est une photo de ton projet à un instant T. 
> Tu peux revenir en arrière, créer des branches parallèles, 
> fusionner des versions. GitHub c'est juste le cloud où tu 
> stockes ces photos.

**Git ≠ GitHub :**
> Git = l'outil local installé sur ta machine
> GitHub = le service en ligne (comme Dropbox mais pour Git)
> On pourrait utiliser Git sans GitHub (GitLab, Gitea, local)

---

## 🟩 Sous le capot

**Les 3 zones de Git :**
```
Working directory  →  Staging area  →  Repository
(tes fichiers)         (git add)        (git commit)
```

**Commandes du quotidien :**
```bash
git status           # Quels fichiers ont changé ?
git add fichier      # Préparer un fichier pour commit
git add .            # Préparer TOUS les changements
git commit -m "msg"  # Sauvegarder avec un message
git push             # Envoyer vers GitHub
git pull             # Récupérer depuis GitHub
git log --oneline    # Historique des commits
git diff             # Voir les changements non commités
```

**Commandes utiles :**
```bash
git branch           # Lister les branches
git checkout -b nom  # Créer et switcher sur une branche
git merge branche    # Fusionner une branche
git clone url        # Copier un repo existant
git remote -v        # Voir les remotes configurés
```

---

## 🟥 Laboratoire de test

**POC — Voir l'historique d'EticLab :**
```bash
cd ~/Dev/keticwork/eticlab
git log --oneline
git log --oneline --graph
git show HEAD        # Voir le dernier commit en détail
```

**Test de compréhension :**
> Combien de commits a EticLab ?
> Quel était le premier message de commit ?

---

## 💀 Zone de hack

**Vulnérabilité classique — secrets dans Git :**
> Le danger numéro 1 : commiter accidentellement 
> une clé API ou un mot de passe. Une fois pushé 
> sur GitHub (même repo privé), il faut considérer 
> la clé comme compromise.

**Vérification :**
```bash
# Chercher des secrets dans l'historique Git
git log --all --full-history -- "*.env"
git grep "API_KEY"
```

**Contre-mesure :**
> - Toujours avoir un .gitignore avec .env dedans
> - Utiliser .env.example pour montrer la structure 
>   sans les vraies valeurs
> - Outil : git-secrets pour bloquer les commits dangereux

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Git | Versioning local | Gratuit | Perte si mal utilisé |
| GitHub | Remote + collaboration | Gratuit / Pro | Secrets exposés |
| GitLens (VS Code) | Visualiser Git | Gratuit | Aucun |
| .gitignore.io | Générer .gitignore | Gratuit | Aucun |

## Liens avec d'autres modules
- → T-02-terminal : git s'utilise en ligne de commande
- → C2-03-docker : .dockerignore fonctionne comme .gitignore
- → T-A01-claude : on versionne les prompts et configs Claude
