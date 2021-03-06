Geogame App !
===================


Hey! Bienvenue dans le jeu  **GeoGame**. Nous allons t'expliquer un peu les technologies que nous avons utilisé pour développer ce fantastique jeu de chasse au trésor ! Puis nous allons t'expliquer les règles du jeu et comment le tout fonctionne, ça va être génial !


Introduction
-------------

GeoGame est un jeu de piste qui consiste à faire se déplacer les joueurs autour d'un endroit, un bâtiment ou n'importe que point pour répondre à des questions et gagner des points. Un partie est limitée en temps et un classement est disponible à chaque instant pour voir où en sont les équipes.

Ce jeu constitue le mini-projet de la matière "Programmable Web client-side & server-side 2016/2017"


## Comment jouer ?##

Avec Geogame vous vouvez tout simplement vous connecter à ce site [GEOGAME](geogame.dobl.fr) pour jouer avec n'importe qu'il type de périphérique. Il vous suffira de créer un compte, renseigner dans quelle équipe vous êtes et c'est partis ! 

Les technos
-------------

Etant donné que ce jeu est censé s'adapter à tout environnement, extérieur comme intérieur, il doit être utilisable à la fois sur PC que sur téléphone. Nous avons donc choisis d'utiliser le framework **Ionic** permettant de créer une application simple sur navigateur et qui est facilement exportable en application sur téléphone mobile (Android, Ios, Windows phone).
Niveau backend nous avions besoin de quelque chose de stable et qui puisse être intégré facilement avec le Frontend, nous avons donc choisi Node js ( Techno que nous avons vu en cours) avec MongoDB.

> **Note: qui a fait quoi ?**

> - Dorian BALNC: Backend NodeJS/Mongo + Frontend (Game Manager, Question Manager, GameList)
> - Manuel PAVONE : Backend (NodeJS, Socket.io) + Frontend (Global Chat, Chat in Game, GameList)  
> - Yann GUIDEZ : Frondtend ( Questions Map, Game List, Réponse aux questions)

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

## Comment lancer le serveur ?##

Geogame possède un serveur déjà lancé, si cependant vous voulez lancer un serveur en local voici la procédure :

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
https://www.mongodb.com/download-center
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

