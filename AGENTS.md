# AGENTS.md — Florentine sur Seine / rédaction SEO et Codex

## Objectif commercial
Développer le trafic organique **qualifié** et les demandes de privatisation pour **https://florentine-sur-seine.fr/**. Florentine sur Seine présente trois péniches :
- **Florentine sur Seine**, Boulogne-Billancourt (52 quai du Point du Jour, 92100), **notre coup de cœur / adresse signature à mettre en avant** dans la rubrique blog et les contenus adaptés. Il s'agit d'un choix éditorial de la marque, pas d'un avis tiers ou d'une note Google.
- **Mistinguett**, secteur Paris-Bercy / port de la Râpée, deux niveaux, surface annoncée 340 m², 80 couverts assis ; renseignements et prix sur devis.
- **Alizé**, secteur Paris-Bercy / port de la Râpée, surface annoncée 450 m², 170 places assises, rooftop aménagé ; prix sur devis. Ne pas annoncer comme certaine une jauge cocktail non confirmée.

## Routine quotidienne : 3 brouillons maximum
Chaque jour à 09:00 heure de Paris, si la routine externe Codex est déjà programmée, proposer **au maximum trois articles distincts**, un par intention de recherche clairement différente. **Ne pas publier automatiquement**, ne pas modifier une tâche Codex que l'utilisateur n'a pas autorisé à changer. Conserver le processus de validation dans `validation-seo.html` et `editorial-studio/data/editorial-store.json`.

La cadence de trois n'est PAS un objectif de volume inconditionnel. Si seulement un ou deux sujets originaux et utiles sont identifiés, produire un ou deux brouillons. Si le sujet a déjà été publié, **actualiser la page existante** plutôt que fabriquer une URL concurrente.

### Avant de rédiger
1. Lire `editorial-studio/data/editorial-store.json`, `sitemap.xml`, `blog.html` et les titres de tous les articles `blog/*.html`.
2. Détecter chevauchement d'intention, cannibalisation SEO, similarité des H1 et sujets trop proches.
3. Vérifier la disponibilité des faits dans le code actuel : `peniches.html`, `privatisation.html`, pages des trois péniches, et tarif visible au calendrier. Ne **jamais** inventer chiffre, prestataire, offre ou avis.
4. Faire prioritairement un rafraîchissement substantiel des contenus existants qui ont des informations périmées, en gardant l'URL canonique et en ne modifiant `dateModified` qu'après vraie réécriture.
5. Regrouper les demandes sous trois familles : location/anniversaire à Boulogne (Florentine), comparaison des 3 péniches, mariage/soirée entreprise/organisation. Réserver une seule intention principale par page.

### Faits actuels
- **Florentine** : deux salons vitrés ; capacité annoncée jusqu'à 180 en cocktail ou 80 en dîner assis, à confirmer selon configuration ; bateau à quai (ne navigue pas). Équipement son et lumière. 
- **Prix affichés de location Florentine** : dimanche–mercredi **1 800 € journée / 2 500 € soirée** ; jeudi–samedi **2 000 € journée / 2 800 € soirée**, sous réserve de devis et de disponibilité, options supplémentaires non incluses. Calendrier indicatif, **pas** un planning de disponibilité en temps réel.
- Options sur devis : bartender confirmé et bar à cocktails au tarif par personne ; prestataires food casher possibles à étudier. **Momento** (pizzas/antipasti) et **LAKAM** (carné/burgers) sont des pistes, pas des partenariats contractualisés. Ne jamais garantir leur disponibilité ni une certification sans vérification. Ne pas mélanger offres lactées et carnées.
- **Formulaire de devis** : `/devis-peniche.html`, WhatsApp `+33 6 63 65 96 79`. Le formulaire e-mail doit être testé et le destinataire activé avant de promettre des notifications automatiques.
- Ne jamais reprendre l'ancien prix d'appel de 1 500 € à la place des tarifs actuels.
- Ne plus promouvoir les pages `/le-concept.html` et `/carte.html` (elles sont redirigées). Les trois nouvelles pages dédiées sont :
  - `/privatisation-peniche-florentine-boulogne.html`
  - `/privatisation-peniche-mistinguett-paris-bercy.html`
  - `/privatisation-peniche-alize-paris-bercy.html`

### Exigences éditoriales / Search Central
- Un titre original, un seul H1, description utile, vrai contenu répondant à une question d'organisateur : formats possibles, étapes, budget, contraintes de salle et nombre de personnes, questions fréquentes pertinentes, liens vers documents utiles.
- Démontrer le vécu du lieu et les détails spécifiques (mise en place, horaires sur devis, choix d'un prestataire), sans inventer de retours d'expérience.
- Rédiger un bloc `Notre coup de cœur : Florentine à Boulogne-Billancourt` uniquement quand il s'intègre naturellement au propos. Lien descriptif vers sa fiche et CTA devis. Ne pas prétendre que c'est un classement indépendant.
- Maillage interne naturel vers 1 à 3 pages liées, en priorité la page dédiée à la péniche et `/devis-peniche.html`. Éviter ancres répétitives sur-optimisées et liens vers anciennes pages.
- Conserver les URL canoniques, textes alternatifs précis pour les images réelles, `BlogPosting` valides avec dates cohérentes (pas de fausse date de mise à jour).
- Éviter texte IA générique, listes de mots-clés, répétition mécanique, faux témoignages, suroptimisation par quartiers, multiplication d'articles similaires et inflation du nombre de pages.
- Les trois péniches sont à Paris/Boulogne, pas toutes à Boulogne : respecter les lieux.

### Publication
- Préparer les articles en brouillon dans `editorial-studio/data/editorial-store.json` et soumettre à validation via `validation-seo.html` lorsque ce workflow est utilisable.
- À validation seulement : publier la page, insérer une entrée lisible dans `blog.html`, ajouter l'URL canonique au `sitemap.xml`, vérifier le déploiement GitHub Pages. Éviter 3 commits concurrents sur le même fichier.
- Chaque livraison mentionne les URL des articles effectivement publiés et distingue nettement brouillons, commits GitHub et publication publique.
