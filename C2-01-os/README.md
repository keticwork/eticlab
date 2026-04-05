# OS & processus — Couche 2

## Dépendances
- T-02 — Terminal (pour observer l'OS)
- C0-01 — Hardware (l'OS tourne sur le hardware)

## 🟦 Carte d'identité

**Définition simple :**
> L'OS (Operating System) c'est le chef d'orchestre. 
> Il gère qui a le droit d'utiliser le CPU, la mémoire, 
> le disque et le réseau. Sans lui, tes programmes ne 
> pourraient pas coexister — ils se marcheraient dessus.

**Les 3 OS principaux :**
| OS | Usage | Noyau |
|----|-------|-------|
| macOS | Développement, créatifs | XNU (Unix) |
| Linux | Serveurs, Raspberry Pi | Linux |
| Windows | Grand public, entreprises | NT |

> Ton Mac et ton Raspberry Pi parlent des langages proches 
> (Unix/Linux) — c'est pour ça que les commandes Terminal 
> fonctionnent sur les deux.

---

## 🟩 Sous le capot

**Observer l'OS en temps réel :**
```bash
# Charge CPU et mémoire en temps réel
top

# Version plus lisible (si installé)
htop

# Infos système
uname -a         # Nom et version de l'OS
sw_vers          # Version macOS spécifiquement
df -h            # Espace disque
free -h          # Mémoire (Linux/Pi)
```

**Les processus :**
```bash
# Lister tous les processus
ps aux

# Voir l'arbre des processus (parent → enfants)
pstree           # Linux/Pi
ps aux --forest  # Alternative

# C'est pourquoi Benny n'était pas facile à tuer :
# Next.js crée un processus parent et des enfants.
# Tuer l'enfant ne tue pas le parent qui recrée l'enfant.
```

---

## 🟥 Laboratoire de test

**POC — Photographier ton système :**
```bash
uname -a
sw_vers
df -h
ps aux | grep node
lsof -i -P -n | grep LISTEN
```

**POC — Tuer Benny correctement :**
```bash
# Trouver le PID du processus Next.js
ps aux | grep next

# Tuer par nom de processus
pkill -f "next dev"

# Vérifier
lsof -i :3000
```

---

## 💀 Zone de hack

**Vulnérabilité classique — escalade de privilèges :**
> Sur Linux/Pi, chaque processus a un utilisateur. 
> Un attaquant qui accède à un processus cherche 
> à obtenir les droits "root" (administrateur). 
> C'est pour ça qu'on ne fait jamais tourner un 
> serveur web en root.

**Vérification :**
```bash
# Voir sous quel utilisateur tournent tes serveurs
ps aux | grep node
# La colonne 1 = l'utilisateur
# Si c'est "root" : danger
```

**Contre-mesure :**
> Toujours faire tourner les serveurs avec un 
> utilisateur limité, jamais root.

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Activity Monitor | GUI processus macOS | Gratuit, intégré | Aucun |
| top / htop | Processus en temps réel | Gratuit | Aucun |
| Console.app | Logs système macOS | Gratuit, intégré | Aucun |
| ufw | Firewall Linux/Pi | Gratuit | Mauvaise config |

## Liens avec d'autres modules
- → T-02-terminal : on observe l'OS via le terminal
- → C0-01-hardware : l'OS tourne sur le hardware
- → C1-01-ports : l'OS gère l'attribution des ports
- → C2-03-docker : Docker isole des processus OS
