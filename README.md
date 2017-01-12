# GeoGame

GeoGame est un jeu de piste qui consiste à faire se déplacer les joueurs autour d'un endroit, un bâtiment ou n'importe que point pour répondre à des questions et gagner des points.

Un partie est limitée en temps et un classement est disponible à chaque instant pour voir où en sont les équipes.

Ce jeu constitue le mini-projet de la matière "Programmable Web client-side & server-side 2016/2017"

Groupe :
 - Dorian BLANC
 - Yann GUIDEZ
 - Manuel PAVONE

## Principe ##

## Comment jouer ?##

## Les technologies utilisées ##
### Côté client ###
Côté client notre application web, qui se veut hybride (disponible autant sur navigateur qu'en tant qu'application natives sur les plateformes Android et Ios) utilise le framework Ionic (version 1), lui même basé sur AngularJS (Pour la gestion MVC de l'application) et Apache Cordova (qui permet de compilé un site web en application navite, et d'avoir accès aux capteurs du téléphone).

### Côté serveur ###
Côté serveur nous avons un serveur Node.js couplé à une base de donnée MongoDB (nos données ayant peu de nécessité relationnelle et MongoDB étant le gestionaire de base de donnée NoSQL le plus complet au niveau de son API et de ses requêtes. Elle permet notamment de faire facilement des recherches basées sur des critères en relation avec la position (latitude, longitude).
