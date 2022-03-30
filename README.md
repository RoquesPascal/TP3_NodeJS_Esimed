# Express Esimed

## TP n°1

### First steps

- Fichier de configuration de l'app
- Fichier dédié à la DB (table "user" avec : id, firstName, lastName, password)
- Fichier dédié à l'intéraction avec la DB
- Route pour récupérer tous les "user"
- Route pour récupérer un "user" via son firstName
- Route pour créer un "user"
- Route pour modifier un "user"
- Route pour supprimer un "user"
- Les routes créées doivent retourner le bon code HTTP et doivent utiliser le bon verbe HTTP
- Ajouter un fichier `.gitignore` à la racine de votre projet pour faire en sorte de ne pas pousser les `node_modules` ainsi que le répertoire `.idea`
- Si les `node_modules` avaient déjà été poussé sur le repository, trouver la commande git qui permettra de supprimer ce répertoire seulement sur le dépôt GitHub et non en local

### Optional steps

- Créez toutes vos routes dans un autre fichier, de façon à sortir cette logique du fichier index.js => [Express Doc](https://expressjs.com/fr/guide/routing.html)
- Encrypter en md5 le password de l'utilisateur
- Logger chaque requête avec: Date, IP de l'appelant, durée de la requête, verbe + route HTTP
- Pour la gestion des dates, vous pouvez utiliser la librairie de votre choix disponible sur npm (a condition qu'elle vous semble viable)
- Pour l'insertion des utilisateurs, et plus particulièrement leur identifiant "id", il faut un uuid et non un entier qui va être auto increment
- Middleware pour la gestion des erreurs

## TP n°2

### First steps

> Pour vérifier le fonctionnement de vos JWT, il faudra bien entendu faire les appels de vos routes en passant le bon header (que vous trouverez en cherchant comment fonctionne JWT)

- Installez les librairies `jsonwebtoken`, `express-jwt` et `bcryptjs`
- Modifier la route de création d'un utilisateur
  - Au lieu d'encrypter le mot de passe en `md5`, l'encrypter en `bcrypt` avec un `salt` de 12 (cf. doc de la lib)
- Créez une route d'authentification: `/login`
  - Body de la request: firstName, password
  - Allez chercher dans les utilisateurs, celui dont le firstName correspond à celui dans le body de la request
  - En fonction de l'utilisateur récupéré, comparé le password qu'il avait en base (encrypté) avec celui qui est dans le body de la request
  - Si les passwords ne matchent pas => Réponse 401 Unauthorized
  - Si les password matchent, on créé et retourne un jwt (grâce à la lib `jsonwebtoken`)
- Enfin, grâce à la lib `express-jwt`, créez un middleware qui rendra les routes de MODIFICATION / SUPPRESSION d'un utilisateur accessibles seulement aux utilisateurs authentifiés grâce à un JWT valide

### Optional steps

- Étant donné la requête par `firstName` de la route `/login`, faites en sorte que dans la table des utilisateurs, on ne puisse pas avoir 2 fois un utilisateur avec le même `firstName`
- Rajoutez une information `roles` dans la table des utilisateurs, qui sera un tableau de string
- 2 rôles existeront au sein de l'aplication: ADMIN / MEMBER
- Pour les routes suivantes, définissez les accès comme suit:
  - `/login` => tout le monde à le droit
  - `GET /users` & `GET /users/:firstName` => les utilisateurs ayant les rôles ADMIN / MEMBER ont le droit
  - `POST /users` & `PUT /users/:id` & `DELETE /users/:id` => seul les ADMIN ont le droit
- Gérez en conséquence les retours d'erreurs de façon à avoir des erreurs compréhensibles pour ceux qui utiliseront les API de votre back-end
- Pour le `secret` permettant la génération du JWT, utilisez une **variable d'environnement** dédiée à ce besoin (cherchez donc à comprendre ce que sont les "variables d'environnement" ainsi que leurs utilités)
- Lors de la création du JWT, rajoutez lui une durée de 1h avant expiration. Cette information doit également se retrouver dans une variable d'environnement dédiée

## TP n°3

### First steps

#### Validation

- Installez la librairie `express-validator`
- Rajoutez des règles de validation pour les routes de création d'un utilisateur et d'authentification
- Les règles de validation pour les routes sont les suivantes:
  - `POST /users/login` => le body de la request doit contenir les champs `firstName` et `password`
  - `POST /users` => le body de la request doit vontenur les champs pour créer l'utilisateur, et le `password` doit avoir une taille minimum de 8 caractères

#### Tests (mise en place)

- Installez dans les dépendances **DEV** les librairies `jest` & `supertest`
- Ajoutez dans votre `package.json`, le script suivant: `"test": "jest"`. Il est a placer juste après notre autre script `"devstart": "nodemon index.js"`
- Dans la `class WebServer`, rajoutez, après le `port = 3000;` une propriété `server = undefined;`
- Toujours dans cette classe, dans la méthode `start()`, assignez cette nouvelle variable: `this.server = this.app.listen(.....);`
- Enfin, rajoutez à cette classe une méthode `stop()` qui contiendra seulement: `this.server.close();`
- Créez à la racine du projet un répertoire `tests`
- Qui contiendra un sous répertoire `core`
- À l'intérieur de ce sous répertoire, copiez les fichiers `setup.js` et `teardown.js`
- Enfin, à la racine de votre projet, copiez le fichier `jest.config.js`
- Une fois effectué, vous allez pouvoir créer vos tests en vous inspirant de cet exemple:

```javascript
const request = require('supertest');

test('My super test', async () => {
  const res = await request(apiUrl)
    .post('/the/route/to/test')
    .send({
      some: 'data',
    });

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('some data present in the body');
});
```

- La librairie `jest` reconnait les fichiers de test, lorsqu'ils sont nommés de la sorte: `*.test.js` (exemple: `user-routes.test.js`)
- Vous placerez ce(s) fichier(s) de test dans le répertoire `./tests`
#### Tests (pratique)

- Commencez par créer le test de la route de `/login`. Servez vous des docs des 2 librairies pour parvenir à vos besoins. Le but étant, pour la route de `/login`:
  - Vérifier que si on passe les bonnes données, on arrive bien à créer un JWT
  - Vérifier que si on passe un mot de passe incohérent, une erreur survienne
  - Vérifier que si on passe un mauvais `firstName`, une erreur survienne
  - Vérifier que si on oublie un champ dans le body de la request, une erreur survienne
- Une fois que les tests de la route `/login` sont effectués, vous pourrez démarrer les tests des utilisateurs (les routes `GET /users` et `POST /users` pour le moment). L'idée étant, comme pour le `/login` de tester un maximum de comportement que vous avez codé

#### Suite de test

Vous trouverez ci-dessous la suite de test minimum a réaliser.

Par soucis d'organisation, il serait préférable d'avoir 4 fichiers distincts pour les cas d'utilisation présentés (`POST /login`, `GET /users`, `POST /users` et enfin le `Full scénario`)

|               | Scénario                                                                                                                                                                                                                                                                                                                       | Résultat attendu | Supplément                                                          |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------------------------------|
| POST /login   |                                                                                                                                                                                                                                                                                                                                |                  |                                                                     |
|               | Request body sans firstName                                                                                                                                                                                                                                                                                                    | Erreur           |                                                                     |
|               | Request body avec un firstName non connu en DB                                                                                                                                                                                                                                                                                 | Erreur           |                                                                     |
|               | Request body avec mauvais mot de passe par rapport à l'utilisateur en DB                                                                                                                                                                                                                                                       | Erreur           |                                                                     |
|               | Request body avec firstName correct et mot de passe également                                                                                                                                                                                                                                                                  | Succès           | Token récupéré                                                      |
| GET /users    |                                                                                                                                                                                                                                                                                                                                |                  |                                                                     |
|               | Request sans le header JWT                                                                                                                                                                                                                                                                                                     | Erreur           |                                                                     |
|               | Request avec le header JWT                                                                                                                                                                                                                                                                                                     | Succès           | Liste des utilisateurs récupérés: on vérifie le contenu des données |
| POST /users   |                                                                                                                                                                                                                                                                                                                                |                  |                                                                     |
|               | Request body sans password                                                                                                                                                                                                                                                                                                     | Erreur           |                                                                     |
|               | Request body avec password de moins de 8 caractères                                                                                                                                                                                                                                                                            | Erreur           |                                                                     |
|               | Request body avec les bonnes données pour créer un utilisateur                                                                                                                                                                                                                                                                 | Succès           |                                                                     |
| Full scénario | POST /login => Récupération du token pour les prochaines request<br /> GET /users => Vérification qu'il y a bien 1 utilisateur<br /> PUT /users/:id => Modifiez un champ de votre utilisateur<br /> GET /users/:id => Vérifiez que la donnée a bien été modifiée<br /> DELETE /users/:id GET /users => Vérifiez que votre liste d'utilisateur est vide |                  |                                                                     |