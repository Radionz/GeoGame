# GeoGame

GeoGame est un jeu de piste qui consiste à faire se déplacer les joueurs autour d'un endroit, un bâtiment ou n'importe que point pour répondre à des questions et gagner des points.

Un partie est limitée en temps et un classement est disponible à chaque instant pour voir où en sont les équipes.

Ce jeu constitue le mini-projet de la matière "Programmable Web client-side & server-side 2016/2017"

**Groupe** :
 - Dorian BLANC
 - Yann GUIDEZ
 - Manuel PAVONE

## Principe ##

## Comment jouer ?##

## Comment lancer le serveur ?##

Dans le dossier back-end lancez npm install

    npm install

Cette commande installera les dépendences suivantes, nécessaires au fonctionnement du serveur :

	"dependencies": {
		"body-parser": "^1.9.2",
		"express": "^4.14.0",
		"mongoose": "^4.7.6"
	}

Vous pouvez désormais lancer le serveur avec la commande

	node app.js
	
Ensuite vous devriez voir :

	Listening on port 8080
	Connection succesful to mongodb.

Si vous ne voyez pas cette seconde ligne mais plûtot :

	MongoError: failed to connect to server

Alors vous n'avez certainement pas MongoDB d'installé ou de lancé sur votre machine :

### Lancer MongoDB : ###

	mongod

### Installer MongoDB : ###

#### Windows ####
Rendez-vous ici :
https://www.mongodb.com/download-center?jmp=nav
et létélchargez la dernière version que vous installerez en version Complète
*Current Stable Release (3.4.1) le 12/1/2017*

N'oubliez pas de créer le répertoire **C:\data\db**.

Vous pouvez ensuite lancer le serveur MongoDB avec la commande :

	mongod

pour plus d'informations, rendez vous ici :
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

#### Linux ####

Lancez cette commande :

	sudo apt-get -y install mongodb
	
Pour plus d'informations, rendez vous ici :
https://docs.mongodb.com/manual/administration/install-on-linux/


## Les technologies utilisées ##
### Côté client ###
Côté client notre application web, qui se veut hybride (disponible autant sur navigateur qu'en tant qu'application natives sur les plateformes Android et Ios) utilise le framework Ionic (version 1), lui même basé sur AngularJS (Pour la gestion MVC de l'application) et Apache Cordova (qui permet de compilé un site web en application navite, et d'avoir accès aux capteurs du téléphone).

### Côté serveur ###
Côté serveur nous avons un serveur Node.js couplé à une base de donnée MongoDB (nos données ayant peu de nécessité relationnelle et MongoDB étant le gestionnaire de base de donnée NoSQL le plus complet au niveau de son API et de ses requêtes. Elle permet notamment de faire facilement des recherches basées sur des critères en relation avec la position (latitude, longitude).

#### Comment nous avons procédé
Installer node.js

    sudo apt-get install nodejs

Vérifier que ça à fonctionné

    node -v
    npm -v

Installer MongoDB

    sudo apt-get -y install mongodb

Ensuite installer mongoose (Package NPM pour communiquer en JS avec la base MongoDB)
    
    npm install mongoose --save

Installer express

    npm install express --save
    
Installer bodyParser

    npm install body-parser --save
