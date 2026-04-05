`Couche T — Tooling Avancé`

# Landing page & structure plateforme

> Comprendre comment concevoir une landing page efficace et structurer les pages d'une plateforme SaaS.

**Prérequis :** `C3-01` `C3-02` `C3-03` `T-A03`

**Ce que tu vas apprendre :**
- La structure d'une landing page qui convertit (sections, CTA, hiérarchie)
- Les principes de copywriting pour un produit technique
- L'architecture des pages d'une plateforme comme EticLab

---

## 🟦 Carte d'identité

**Définition simple :**
> La landing page, c'est la vitrine de ton magasin. 
> Un passant a 5 secondes pour comprendre ce que tu vends 
> et décider s'il entre. Si ta vitrine est confuse, 
> il passe son chemin. Si elle est claire, avec un message 
> fort et une porte grande ouverte (le CTA), il entre.

**Rôle technique :**
> La landing page est la première page que voit un visiteur. 
> Son objectif est unique : convertir (inscription, clic, achat). 
> Chaque élément de la page sert cet objectif. La structure 
> de la plateforme derrière organise le contenu pour que 
> l'utilisateur trouve ce qu'il cherche en minimum de clics.

**Schéma** :
📸 à ajouter dans docs/

**Landing page vs page d'accueil :**
| Aspect | Landing page | Page d'accueil |
|--------|-------------|---------------|
| Objectif | 1 seul : convertir | Naviguer vers le contenu |
| Navigation | Minimale ou absente | Menu complet |
| CTA | 1 action claire, répétée | Plusieurs options |
| Contenu | Focalisé sur la valeur | Vue d'ensemble |
| Quand | Lancement, campagne, SEO | Utilisateurs récurrents |

---

## 🟩 Sous le capot

**Mécanisme — Les 8 sections d'une landing page efficace :**
> 1. **Hero** — Titre + sous-titre + CTA (au-dessus de la ligne de flottaison)
> 2. **Problème** — Décris le problème que ton utilisateur vit
> 3. **Solution** — Montre comment ta plateforme le résout
> 4. **Fonctionnalités** — 3-4 features clés avec icônes
> 5. **Preuve sociale** — Témoignages, stats, logos
> 6. **Démo / aperçu** — Screenshot, vidéo, ou démo interactive
> 7. **Pricing** — Plans et tarifs (si applicable)
> 8. **CTA final** — Rappel de l'action principale + footer

**Le Hero — l'élément le plus important :**
```
Structure :
┌─────────────────────────────────────────┐
│  [Logo]                    [Connexion]  │
│                                         │
│  Titre principal (H1)                   │
│  "Comprends chaque brique d'un SaaS"   │
│                                         │
│  Sous-titre (1-2 lignes)               │
│  "Du hardware au business, apprends    │
│   en construisant — avec l'IA."        │
│                                         │
│  [ Commencer gratuitement →  ]          │
│                                         │
│  ✓ Gratuit  ✓ Pas de compte requis     │
│                                         │
└─────────────────────────────────────────┘
```

**Règles de copywriting :**
| Règle | Mauvais | Bon |
|-------|---------|-----|
| Titre court | "Plateforme de formation technique interactive pour développeurs" | "Comprends chaque brique d'un SaaS" |
| Bénéfice, pas feature | "20 modules disponibles" | "Du débutant au déploiement en production" |
| Verbe d'action pour CTA | "Soumettre" | "Commencer gratuitement →" |
| Sous-titre explicatif | "EticLab est un outil" | "Apprends en construisant — avec l'IA comme guide" |
| Social proof chiffré | "Des utilisateurs nous font confiance" | "127 développeurs formés ce mois-ci" |

**Architecture des pages EticLab :**
```
/                          → Landing page (conversion)
/modules                   → Carte interactive des modules
/modules/[slug]            → Page d'un module (contenu)
/parcours                  → Générateur de parcours IA
/mentions-legales          → Mentions légales
/confidentialite           → Politique de confidentialité
/cgu                       → CGU

Futur (avec auth) :
/dashboard                 → Progression de l'utilisateur
/compte                    → Paramètres du compte
/admin                     → Back-office superadmin
```

**Outils d'observation :**
```bash
# Vérifier que le H1 est présent et unique
curl -s https://eticlab.vercel.app | grep "<h1"

# Vérifier le temps de chargement (Core Web Vitals)
# F12 → Lighthouse → Performance + SEO

# Vérifier le rendu mobile
# F12 → Toggle device toolbar (Ctrl+Shift+M)
```

**Schéma technique** :
```mermaid
graph TD
  A[Landing /] -->|CTA| B[/modules]
  B --> C[/modules/c1-01-ports]
  B --> D[/modules/c3-01-nextjs]
  A -->|CTA IA| E[/parcours]
  E -->|génère| F[Parcours personnalisé]
  F --> C
  F --> D
  A --> G[Footer]
  G --> H[/mentions-legales]
  G --> I[/confidentialite]
  G --> J[/cgu]
```

**Hiérarchie visuelle — les 3 niveaux de lecture :**
```
Niveau 1 — Scan (3 secondes)
  → Titre H1, CTA principal, image hero
  → L'utilisateur décide s'il reste ou part

Niveau 2 — Survol (15 secondes)
  → Sous-titres H2, icônes features, preuve sociale
  → L'utilisateur comprend la valeur

Niveau 3 — Lecture (1-3 minutes)
  → Détails, pricing, FAQ
  → L'utilisateur décide de s'inscrire
```

**Le CTA — Call To Action :**
| Règle | Application |
|-------|------------|
| Visible immédiatement | Au-dessus de la ligne de flottaison |
| Couleur contrastée | Bouton coloré sur fond neutre |
| Texte d'action | "Commencer gratuitement →" (pas "En savoir plus") |
| Répété | Hero + milieu de page + footer |
| Réduire la friction | "Pas de compte requis" / "Gratuit" / "30 secondes" |

---

## 🟥 Laboratoire de test

**POC 1 — Analyser des landing pages existantes :**
> Ouvre ces sites et identifie les 8 sections :
> - vercel.com (tech, clean)
> - supabase.com (tech, developer-focused)
> - linear.app (SaaS, minimaliste)
> - cal.com (open source, CTA clair)
> Repère : H1, sous-titre, CTA, preuve sociale, pricing

**POC 2 — Wireframe de la landing EticLab :**
```
┌────────────────────────────────────┐
│ HERO                               │
│ H1 + sous-titre + CTA             │
├────────────────────────────────────┤
│ PROBLÈME                           │
│ "Tu veux créer un SaaS mais tu     │
│  ne sais pas par où commencer"     │
├────────────────────────────────────┤
│ SOLUTION                           │
│ "EticLab te guide brique par       │
│  brique, avec l'IA comme coach"    │
├────────────────────────────────────┤
│ FEATURES (3 colonnes)              │
│ [Modules] [IA] [Parcours]          │
├────────────────────────────────────┤
│ APERÇU                             │
│ Screenshot carte des modules       │
├────────────────────────────────────┤
│ CTA FINAL                          │
│ "Commence ton parcours →"          │
├────────────────────────────────────┤
│ FOOTER                             │
│ Liens légaux + réseaux + contact   │
└────────────────────────────────────┘
```

**POC 3 — Créer le Hero en Next.js :**
```tsx
// app/page.tsx — Hero section
export default function LandingPage() {
  return (
    <main>
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', maxWidth: '600px' }}>
          Comprends chaque brique d'un SaaS
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '500px' }}>
          Du hardware au business, apprends en construisant 
          — avec l'IA comme guide.
        </p>
        <a href="/modules" style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          background: '#0070f3',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.1rem'
        }}>
          Commencer gratuitement →
        </a>
        <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>
          Gratuit · Pas de compte requis · 20+ modules
        </p>
      </section>
    </main>
  );
}
```

**Test de panne :**
> Supprime le CTA du Hero :
> → Le taux de conversion chute drastiquement
> → Sans action claire, le visiteur scroll puis part

**Commande clé à retenir :**
```bash
# Vérifier que le H1 est présent (SEO + conversion)
curl -s https://ton-site.vercel.app | grep "<h1"
```

---

## 💀 Zone de hack

**Vulnérabilité classique — dark patterns :**
> Certains sites utilisent des techniques manipulatoires :
> - Bouton "Refuser" minuscule et gris, "Accepter" énorme et coloré
> - Case pré-cochée pour la newsletter
> - Compteur d'urgence faux ("Plus que 2 places !")
> - Difficulté à se désinscrire
> → Interdit par la CNIL et contraire à l'éthique.

**Autre risque — promesses exagérées :**
> "Deviens développeur en 30 jours" → mensonger.
> "Comprends les bases en construisant" → honnête.
> Les fausses promesses détruisent la confiance et 
> sont sanctionnables légalement (pratiques commerciales trompeuses).

**Contre-mesure :**
> - CTA honnête : "Commencer gratuitement" (pas "Devenir expert")
> - Refuser aussi facile qu'accepter (cookies, newsletter)
> - Pas de faux compteurs ou de fausse rareté
> - Mentionner clairement ce qui est gratuit et ce qui est payant

---

## 🔄 Alternatives

| Outil | Gratuit | Open Source | Freemium | Premium | Limites |
|-------|---------|-------------|----------|---------|---------|
| Next.js custom | ✅ | ✅ | — | — | Plus de travail, contrôle total |
| Framer | ✅ | — | ✅ | ✅ (15$/mois) | No-code, joli, limité en logique |
| Webflow | ✅ | — | ✅ | ✅ (14$/mois) | No-code, puissant, courbe d'apprentissage |
| Notion public | ✅ | — | ✅ | — | Très limité en design et SEO |
| Carrd | ✅ | — | ✅ (19$/an) | — | 1 page uniquement, simple |
| Super.so (Notion → site) | — | — | ✅ | ✅ | Limité, dépendant de Notion |

> **Recommandation EticLab :** Next.js custom — c'est la stack, 
> le site EST le produit, et on a besoin de SSR pour le SEO. 
> Pas de no-code : la landing page fait partie de l'app Next.js. 
> Pour prototyper rapidement avant de coder : Framer (gratuit 
> pour tester le design et le copywriting).

---

## ✅ Checklist de validation

- [ ] Est-ce que le H1 communique la valeur en moins de 5 mots ?
- [ ] Est-ce que le CTA est visible sans scroller ?
- [ ] Est-ce que la page est lisible sur mobile ?
- [ ] Est-ce que je sais expliquer les 8 sections d'une landing page ?

---

## 🧰 Toolbox

| Outil | Usage | Prix | Risque |
|-------|-------|------|--------|
| Figma | Maquetter la landing page | Gratuit | Aucun |
| Lighthouse | Tester performance + SEO | Gratuit (Chrome) | Aucun |
| PageSpeed Insights | Tester la vitesse mobile | Gratuit (Google) | Aucun |
| Hotjar | Heatmaps (où cliquent les gens) | Freemium | Cookies RGPD |
| Excalidraw | Wireframes rapides | Gratuit, open source | Aucun |

---

## 📚 Aller plus loin

- [Julian Shapiro — Landing Page Guide](https://www.julian.com/guide/startup/landing-pages)
- [Vercel — Next.js Templates](https://vercel.com/templates/next.js)
- [Refactoring UI — design pour développeurs](https://www.refactoringui.com)

## Liens avec d'autres modules
- → C3-01-nextjs : la landing page est une page Next.js
- → C3-02-routing : architecture des routes (/modules, /parcours)
- → C3-03-composants-ui : composants Hero, CTA, Feature cards
- → T-A03-seo-llm : SEO de la landing page (H1, meta, SSR)
- → T-LEG01-legal : pages légales dans le footer
