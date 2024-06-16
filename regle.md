# Grille

Le jeu se déroule sur une grille bidimensionnelle composée de cellules carrées, chaque cellule pouvant être dans un état "vivant" ou "mort".

# États des cellules

Une cellule peut être dans l'état "vivant" (remplie) ou "mort" (vide).
L'état des cellules évolue à chaque étape discrète en fonction de l'état de leurs voisines.

# Évolution des cellules

À chaque étape, l'état de chaque cellule est mis à jour en fonction de l'état de ses huit voisines immédiates (horizontal, vertical, et diagonal).

Les règles d'évolution sont les suivantes :
Une cellule vivante avec moins de deux voisines vivantes meurt (de solitude).
Une cellule vivante avec deux ou trois voisines vivantes survit à la génération suivante.
Une cellule vivante avec plus de trois voisines vivantes meurt (de surpopulation).
Une cellule morte avec exactement trois voisines vivantes devient vivante (elle naît par reproduction).

# Conditions initiales

L'état initial de la grille est configuré en plaçant un nombre quelconque de cellules vivantes dans certaines positions de la grille.

# Observations

Le jeu évolue à chaque génération (étape) en appliquant simultanément les règles à toutes les cellules de la grille.
Les configurations peuvent générer des motifs stables, des oscillateurs périodiques, ou même des structures qui se déplacent à travers la grille (appelées vaisseaux).

# Simulation

Bien que le jeu soit déterministe dans le sens où les règles d'évolution sont fixes, des configurations initiales différentes peuvent conduire à des évolutions très variées et parfois imprévisibles.
