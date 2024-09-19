# Creación de un mini servidor HTTP

## Descripción

Crea una API que simule el funcionamiento de una aplicación similar a Twitter.

## Iniciar un proyecto de Node

Iniciar un Proyecto de NodeJs con

```bash
npm init -y
```

## Dependencias de Desarrollo

1. Eslint:

   - Instalar

     ```bash
     npm install -D eslint
     ```

   - Configurar:

     ```bash
     npx eslint --init
     ```

     - Instalar `@eslint/create-config@0.4.6`
       - Check syntax and find problems
       - JavaScript modules (import/export)
       - None of these
       - TyScript: No
       - Code run: Desmarcar con 'space' Browser, marcar Node
       - Format: JSON

   - Ejecutar: ESLint analiza los archivos JavaScript en tu proyecto según las reglas definidas en tu archivo de configuración de ESLint `.eslintrc.json` y te informa sobre cualquier problema que encuentre, como errores de sintaxis, problemas de estilo, o posibles problemas de lógica.

     ```bash
     npx eslint
     ```

   - Integrar Eslint-Prettier: `npm install -D eslint-config-prettier`
   - Agregar la siguiente regla en el archivo `.eslintrc.json` para que no considere `next` como error si no lo usamos y para que de una warning (en vez de error) si hay variables sin usar.

     ```json
     "rules": {
       "no-unused-vars": ["warn",{ "argsIgnorePattern": "next" }]
     }
     ```

2. Prettier:

   - Instalar

     ```bash
     npm install -D prettier
     ```

   - Crear archivo `.prettierrc.json`
   - Agregar esta configuración al archivo `.prettierrc.json`:

     ```json
     {
       "trailingComma": "es5",
       "tabWidth": 2,
       "semi": true,
       "singleQuote": true
     }
     ```

## Dependencias

1. **bcrypt**: Para el hash y la comparación de contraseñas de forma segura.

   ```bash
   npm install bcrypt
   ```

2. **cors**: Middleware de Express que permite el acceso a recursos de un servidor desde un dominio diferente al del propio servidor.

   ```bash
   npm install cors
   ```

3. **dotenv**: Permite cargar variables de entorno desde un archivo .env para configurar la aplicación.

   ```bash
   npm install dotenv
   ```

4. **express**: Para simplificar el manejo de rutas, solicitudes y respuestas HTTP.

   ```bash
   npm install express
   ```

5. **express-fileupload**: Facilita la carga de archivos desde formularios HTML.

   ```bash
   npm install express-fileupload
   ```

6. **jsonwebtoken**: Implementa la generación y verificación de tokens JWT (JSON Web Tokens) para autenticación.

   ```bash
   npm install jsonwebtoken
   ```

7. **morgan**: Middleware de registro de solicitudes HTTP para Express, que registra los detalles de cada solicitud recibida por el servidor.

   ```bash
   npm install morgan
   ```

8. **mysql2**: Cliente MySQL para Node.js que proporciona una interfaz para interactuar con bases de datos MySQL.

   ```bash
   npm install mysql2
   ```

9. **nodemailer**: Biblioteca para enviar correos electrónicos desde aplicaciones Node.js.

   ```bash
   npm install nodemailer
   ```

10. **sharp**: Librería para el procesamiento de imágenes en Node.js, utilizada para manipular, redimensionar y convertir imágenes.

    ```bash
    npm install sharp
    ```

11. **joi**: Biblioteca para definir y validar la estructura y los tipos de datos de entrada en tu aplicación.

    ```bash
    npm install joi
    ```

## Estructura Principal

1. Crear un archivo `.gitignore` para no subir al repositorio `node_modules`, `.env` ni `uploads`.
2. Crear un archivo `.env` para las Variables de Entorno.
3. Crear un archivo `env.js` para importar las Variables de Entorno y exportarlas para usarlas desde aquí.
4. Crear un archivo `app.js` que va a ser el punto de entrada de nuestra aplicación.
5. Crear el directorio `src` con la estructura de archivos y carpetas necesaria para el proyecto: `controllers`, `db`, `middlewares`, `models`, `routes`, `schemas`, `services`y`utils`.

## Documento package.json

- Añadir

  ```json
  "type": "module"
  ```

## Directorio db

1. Crear los archivos `getPool.js` e `initDb.js`.
2. Crear un **script** en el `package.json` para ejecutar el `initDb.js`.

   ```json
   "scripts": {
      "initDb": "node ./src/db/initDb.js"
   }
   ```

3. Documento <a name="db-getPool">`getPool.js`</a>

   - Importar `mysql2` y de `./env.js` importar `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` y `MYSQL_DATABASE`.
   - Crear una variable `pool` para almacenar el pool de conexiones.
   - Crear y exportar una función asincrona `getPool` para crear si no existe el `pool` de conexiones y devolverlo. Usar un bloque `try/catch`.
     - Hacer un Pool temporal `poolTemp` usando solo `host, user y password`.
     - Crear la base de datos `MYSQL_DATABASE` si no existe.
     - Crear un nuevo pool de conexiones a la base de datos con todas las variables necesarias.

4. Documento <a name="initDb">`initDb.js`</a>

   - Importar:

     ```javascript
     // Importar el pool de conexiones
     import { getPool } from './getPool.js';

     // Importar los utilidades para crear y borrar directorios
     import { createUploadsPathUtil } from '../utils/createUploadsPathUtil.js';
     import { deleteUploadsPathUtil } from '../utils/deleteUploadsPathUtil.js';

     // Importar las variables de entorno
     import { MYSQL_DATABASE } from '../../env.js';
     ```

   - Crear una función asincrona `initDb`. Usar un bloque `try/catch`.

     - Obtener el pool de conexiones con [`await getPool()`](#db-getPool).
     - Poner `MYSQL_DATABASE` en uso.
     - Eliminar las tablas `tweets` y `users` (si existen).
     - Crear la tabla `users` (si no existe).

       ```sql
       id CHAR(36) PRIMARY KEY NOT NULL,
       username VARCHAR(30) UNIQUE NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password VARCHAR(100) NOT NULL,
       avatar CHAR(40),
       bio VARCHAR(150),
       hobbies VARCHAR(100),
       role ENUM('admin', 'user') DEFAULT 'user',
       active BOOLEAN DEFAULT false,
       registrationCode CHAR(36),
       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
       updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
       ```

     - Crear la tabla `tweets` (si no existe).

       ```sql
       id CHAR(36) PRIMARY KEY NOT NULL,
       userId CHAR(36) NOT NULL,
       text VARCHAR(280) NOT NULL,
       image CHAR(40),
       FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
       updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
       ```

     - Borrar el directorio `uploads` si existe con [`deleteUploadsPathUtil`](#utils-deleteUploadsPathUtil).
     - Crear el directorio `uploads` con [`createUploadsPathUtil`](#utils-createUploadsPathUtil).
     - Si no hubo error. Cerro la conexión con `process.exit(0)`. El 0 indica que todo ha ido bien.
     - Si hubo error. Cerro la conexión con `process.exit(1)`. El 1 indica que ha habido un error.

   - Llamar a la funció `initDb()`
   - Estaría bien ir poniendo un `console.log()` despues de cada proceso para ir informando de los avances.

5. Ejecutar el **script** `initDb`

   ```bash
   npm run initDb
   ```

6. Si todo fue bien ya tengo mi **DDBB** creada.

## Documento app

1. Crear un **script** en el `package.json` para ejecutar el `initDb.js`.

   ```json
   "scripts": {
     "dev": "node --watch app.js"
   }
   ```

2. Importar `express`, `fileUpload`, `morgan`, `cors` y de `./env.js` importar `PORT`.

3. Importar cuando estén hechos, los controladores de errores de [`./src/controllers/errors/index.js`](#controllers-error-index) y las rutas de [`./src/routes/index.js`](#routes-index).

4. Crear el servidor

   ```javascript
   const app = express();
   ```

5. Crear los Milddewares para parsear el `body`

   ```javascript
   app.use(express.json());
   app.use(fileUpload());
   ```

6. Crear el Milddewar de `morgan`

   ```javascript
   app.use(morgan('dev'));
   ```

7. Establecer el directorio de archivos estáticos

   ```javascript
   app.use('/uploads', express.static('./uploads'));
   ```

8. Crear el Milddewar de `cors`

   ```javascript
   app.use(cors());
   ```

9. Crear el middleware que indica a `express` dónde están las [rutas](#routes-index) cuando estén hechas.

   ```javascript
   app.use(router);
   ```

10. Crear el Milddewar de [`Ruta No Encontrada`](#controllers-error-notFoundController) cuando esté hecho el controller

    ```javascript
    app.use(notFoundController);
    ```

11. Crear el Milddewar de [`Error`](#controllers-error-errorController) cuando esté hecho el controller

    ```javascript
    app.use(errorController);
    ```

12. Ponemos el servidor a escuchar

    ```javascript
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
    ```

## Directorio routes

1. Crear los archivos: `index.js`, `tweetRoutes.js` y `userRoutes.js`.
2. Documento <a name="userRoutes">`userRoutes.js`</a>:

   - Importar:

     ```javascript
     // Importamos las dependencias.
     import express from 'express';

     // Importamos los controladores.
     import {
       updateUserAvatarController,
       updateUserController,
       editUserPassController,
       getOwnUserController,
       getUserProfileController,
       loginUserController,
       newUserController,
       sendRecoverPassController,
       validateUserController,
     } from '../controllers/users/index.js';

     // Importamos los middlewares.
     import {
       authUserController,
       userExistsController,
     } from '../middlewares/index.js';
     ```

   - Crear el router con `express.Router`.
   - Crear las rutas:

     - Usuario pendiente de activación con [`newUserController`](#controllers-users-newUserController).

       ```javascript
       userRouter.post('/users/register', newUserController);
       ```

     - Validar usuario con [`validateUserController`](#controllers-users-validateUserController).

       ```javascript
       userRouter.post(
         '/users/validate/:registrationCode',
         validateUserController
       );
       ```

     - Login de usuario con [`loginUserController`](#controllers-users-loginUserController).

       ```javascript
       userRouter.post('/users/login', loginUserController);
       ```

     - Obtener el perfil publico de un usuario con [`userExistsController`](#middlewares-userExistsController) y [`getUserProfileController`](#controllers-users-getUserProfileController).

       ```javascript
       userRouter.get(
         '/users/:userId',
         userExistsController,
         getUserProfileController
       );
       ```

     - Obtener el perfil propio de un usuario con [`authUserController`](#middlewares-authUserController), [`userExistsController`](#middlewares-userExistsController) y [`getOwnUserController`](#controllers-users-getOwnUserController).

       ```javascript
       userRouter.get(
         '/users',
         authUserController,
         userExistsController,
         getOwnUserController
       );
       ```

     - Editar usuario con [`authUserController`](#middlewares-authUserController), [`userExistsController`](#middlewares-userExistsController) y [`updateUserController`](#controllers-users-updateUserController).

       ```javascript
       userRouter.put(
         '/users',
         authUserController,
         userExistsController,
         updateUserController
       );
       ```

     - Editar avatar de usuario con [`authUserController`](#middlewares-authUserController), [`userExistsController`](#middlewares-userExistsController) y [`updateUserAvatarController`](#controllers-users-updateUserAvatarController).

       ```javascript
       userRouter.put(
         '/users/avatar',
         authUserController,
         userExistsController,
         updateUserAvatarController
       );
       ```

   - Exportar el router con `export { userRouter }`.

3. Documento <a name="tweetRoutes">`tweetRoutes.js`</a>:

   - Importar:

     ```javascript
     // Importamos las dependencias.
     import express from 'express';

     // Importamos los controladores.
     import {
       deleteTweetController,
       getSingleTweetController,
       getTweetsController,
       getTweetsUserController,
       newTweetController,
       updateTweetController,
     } from '../controllers/tweets/index.js';

     // Importamos los middlewares.
     import {
       authUserController,
       tweetExistsController,
       userExistsController,
     } from '../middlewares/index.js';
     ```

   - Crear el router con `express.Router`.
   - Crear las rutas:

     - Crear un tweet con [`authUserController`](#middlewares-authUserController) y [`newTweetController`](#controllers-tweets-newTweetController).

       ```javascript
       tweetRouter.post('/tweets', authUserController, newTweetController);
       ```

     - Obtener todos los tweets con [`getTweetsController`](#controllers-tweets-getTweetsController).

       ```javascript
       tweetRouter.get('/tweets', getTweetsController);
       ```

     - Obtener los tweets de un usuario con [`userExistsController`](#middlewares-userExistsController) y [`getTweetsUserController`](#controllers-tweets-getTweetsUserController).

       ```javascript
       tweetRouter.get(
         '/tweets/user/:userId',
         userExistsController,
         getTweetsUserController
       );
       ```

     - Obtener un tweet con [`tweetExistsController`](#middlewares-tweetExistsController) y [`getSingleTweetController`](#controllers-tweets-getSingleTweetController).

       ```javascript
       tweetRouter.get(
         '/tweets/:tweetId',
         tweetExistsController,
         getSingleTweetController
       );
       ```

     - Editar un tweet con [`authUserController`](#middlewares-authUserController), [`tweetExistsController`](#middlewares-tweetExistsController) y [`updateTweetController`](#controllers-tweets-updateTweetController).

       ```javascript
       tweetRouter.put(
         '/tweets/:tweetId',
         authUserController,
         tweetExistsController,
         updateTweetController
       );
       ```

     - Borrar un tweet con [`authUserController`](#middlewares-authUserController), [`tweetExistsController`](#middlewares-tweetExistsController) y [`deleteTweetController`](#controllers-tweets-deleteTweetController).

       ```javascript
       tweetRouter.delete(
         '/tweets/:tweetId',
         authUserController,
         tweetExistsController,
         deleteTweetController
       );
       ```

   - Exportar el router con `export { tweetRouter }`.

4. Documento <a name="routes-index">`index.js`</a>:

   - Se encarga de centralizar todas las rutas de la aplicación y exportarlas.
   - Importar:

     ```javascript
     // Importamos las dependencias.
     import express from 'express';

     // Importamos los routers.
     import { userRouter } from './users/userRoutes.js';
     import { tweetRouter } from './tweets/tweetRoutes.js';
     ```

   - Crear y exportar el `router` con `express.Router`.
   - Usar las rutas:
     - Usuarios con [`userRoutes`](#userRoutes).
     - Tweets con [`tweetRoutes`](#tweetRoutes).

## Directorio controllers

1. Crear los directorios: `errors`, `users` y `tweets`.

2. Directorio `errors`

   - Crear los archivos: `index.js`, `errorController.js` y `notFoundController.js`.
   - Documento <a name="controllers-error-notFoundController">`notFoundController.js`</a>:

     - Se encarga de manejar los errores que se generan al no encontrar un recurso. En este caso, se utiliza el servicio de errores para generar un `error 404` con el recurso que no se encontró.
     - Importar:

       ```javascript
       import { notFoundError } from '../../services/errorService.js';
       ```

     - Crear y exportar la función controladora `notFoundController`.

       ```javascript
       export const notFoundController = (req, res, next) => {
         const resourcePath = req.path;
         console.log(`Recurso no encontrado: ${resourcePath}`);

         next(notFoundError(resourcePath));
       };
       ```

     - A traves de `next` le pasamos el error que nos da [`notFoundError`](#services-errorService-notFoundError) al [errorController](#controllers-error-errorController).

   - Documento <a name="controllers-error-errorController">`errorController.js`</a>:

     - Se encarga de manejar los errores de la aplicación y enviar una respuesta al cliente.
     - Crear y exportar la función controladora `errorController`. Hay que poner los 4 parametros en el middleware de error para que express lo reconozca como tal.

       ```javascript
       export const errorController = (error, req, res, next) => {
         res.status(error.httpStatus || 500).send({
           status: 'error',
           code: error.code || 'INTERNAL_SERVER_ERROR',
           message: error.message,
         });
       };
       ```

   - Documento <a name="controllers-error-index">`index.js`</a>:

     - Se encarga de centralizar todas las funciones controladoras de errores y exportarlas.

       ```javascript
       import { errorController } from './errorController.js';
       import { notFoundController } from './notFoundController.js';

       export { notFoundController, errorController };
       ```

3. Directorio `users`

   - Crear los archivos: `index.js`, `newUserController.js`, `validateUserController.js`, `loginUserController.js`, `getUserProfileController.js`, `getOwnUserController.js`, `updateUserController.js` y `updateUserAvatarController.js`.
   - Documento <a name="controllers-users-newUserController">`newUserController.js`</a>:

     - Importar:

       ```javascript
       // Importamos el esquema.
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
       import { newUserSchema } from '../../schemas/users/newUserSchema.js';

       // Importamos los servicios.
       import { insertUserService } from '../../services/users/insertUserService.js';
       ```

     - Crear y exportar la función asincrona controladora `newUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Desestructurar el `body` de la `request` para obtener el `username`, el `email` y la `password`.
         - Validar el cuerpo de la petición con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`newUserSchema`](#schemas-users-newUserSchema).
         - Crear el `registrationCode` con `crypto.randomUUID`.
         - La función [`insertUserService`](#services-users-insertUserService) recibe el `username`, el `email`, la `password` y el `registrationCode` del usuario. Nos devuelve el usuario insertado.
         - Responder al cliente con un mensaje de confirmación. Añado el `registrationCode` para facilitarme los automatismos de pruebas.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-validateUserController">`validateUserController.js`</a>:

     - Importar:

       ```javascript
       import { selectUserByRegistrationCodeModel } from '../../models/users/index.js';
       import { updateUserActivationModel } from '../../models/users/updateUserActivationModel.js';
       ```

     - Crear y exportar la función asincrona controladora `validateUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `registrationCode` de la `request`.
         - La función [`selectUserByRegistrationCodeModel`](#models-users-selectUserByRegistrationCodeModel) recibe el `registrationCode` del usuario. Nos devuelve el usuario.
         - La función [`updateUserActivationModel`](#models-users-updateUserActivationModel) recibe el `registrationCode` del usuario. Nos devuelve el resultado de la actualización.
         - Responder al cliente con un mensaje de confirmación.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-loginUserController">`loginUserController.js`</a>:

     - Importar:

       ```javascript
       // Importamos las dependencias.
       import bcrypt from 'bcrypt';
       import jwt from 'jsonwebtoken';

       // Importamos el modelo, el esquema y el validador.
       import { selectUserByEmailModel } from '../../models/users/selectUserByEmailModel.js';
       import { loginUserSchema } from '../../schemas/users/loginUserSchema.js';
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';

       // Importamos los modulos de error.
       import {
         invalidCredentialsError,
         pendingActivationError,
       } from '../../services/errorService.js';

       // Importamos la variable de entorno.
       import { SECRET } from '../../../env.js';
       ```

     - Crear y exportar la función asincrona controladora `loginUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `email` y la `password` del cuerpo de la petición.
         - Validar el cuerpo de la petición con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`loginUserSchema`](#schemas-users-loginUserSchema).
         - Obtener el usuario con [`selectUserByEmailModel`](#models-users-selectUserByEmailModel).
         - Crear una variable `validPass` para guardar el resultado de comparar la contraseña con `bcrypt.compare()`.
         - Si no hay usuario o la contraseña no es válida, lanzar el error con [`invalidCredentialsError`](#services-errorService-invalidCredentialsError).
         - Si no está activado, lanzar el error con [`pendingActivationError`](#services-errorService-pendingActivationError).
         - Crear el objeto con la info que se va a usar para crear el token.
         - Crear el token con `jwt.sign()`, el `SECRET y tiempo de expiración`.
         - Responder con el token.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-getUserProfileController">`getUserProfileController.js`</a>:

     - Importar:

       ```javascript
       import { selectUserByIdModel } from '../../models/users/index.js';
       ```

     - Crear y exportar la función asincrona controladora `getUserProfileController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `id` del usuario de la `request`.
         - La función [`selectUserByIdModel`](#models-users-selectUserByIdModel) recibe el `id` del usuario. Nos devuelve el usuario.
         - Borrar los campos `email`, `password` y `registrationCode` del usuario.
         - Responder con el usuario.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-getOwnUserController">`getOwnUserController.js`</a>:

     - Importar:

       ```javascript
       import { selectUserByIdModel } from '../../models/users/index.js';
       ```

     - Crear y exportar la función asincrona controladora `getOwnUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `id` del usuario de la `request`.
         - La función [`selectUserByIdModel`](#models-users-selectUserByIdModel) recibe el `id` del usuario. Nos devuelve el usuario.
         - Responder con el usuario.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-updateUserController">`updateUserController.js`</a>:

     - Importar:

       ```javascript
       import { updateUserSchema } from '../../schemas/users/updateUserSchema.js';
       import { updateUserService } from '../../services/users/updateUserService.js';
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
       ```

     - Crear y exportar la función asincrona controladora `updateUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Validar el cuerpo de la petición con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`updateUserSchema`](#schemas-users-updateUserSchema).
         - Obtener el `id` del usuario de la `request`.
         - La función [`updateUserService`](#services-users-updateUserService) recibe el `id` del usuario y el cuerpo de la petición. Nos devuelve el usuario actualizado.
         - Responder con el usuario actualizado.
     - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-updateUserAvatarController">`updateUserAvatarController.js`</a>:

     - Importar:

       ```javascript
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
       import { updateUserAvatarSchema } from '../../schemas/users/updateUserAvatarSchema.js';
       import { updateAvatarUserService } from '../../services/users/updateAvatarUserService.js';
       ```

     - Crear y exportar la función asincrona controladora `updateUserAvatarController`.
     - Usar un bloque `try/catch`.
     - En el bloque `try`:
     - Validar el cuerpo de la petición con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`updateUserAvatarSchema`](#schemas-users-updateUserAvatarSchema).
     - Obtener el `id` del usuario de la `request`.
     - La función [`updateAvatarUserService`](#services-users-updateAvatarUserService) recibe el `id` del usuario, el archivo de la imagen y el tamaño de redimensión. Nos devuelve el nombre de la imagen.
     - Responder con el nombre de la imagen.
     - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-users-index">`index.js`</a>:
   - Se encarga de centralizar todas las funciones controladoras de usuarios y exportarlas.
   - Importar:

     ```javascript
     import { newUserController } from './newUserController.js';
     import { validateUserController } from './validateUserController.js';
     import { loginUserController } from './loginUserController.js';
     import { getUserProfileController } from './getUserProfileController.js';
     import { getOwnUserController } from './getOwnUserController.js';
     import { updateUserController } from './updateUserController.js';
     import { updateUserAvatarController } from './updateUserAvatarController.js';
     ```

   - Exportar:

     ```javascript
     export {
       newUserController,
       validateUserController,
       loginUserController,
       getUserProfileController,
       getOwnUserController,
       updateUserController,
       updateUserAvatarController,
     };
     ```

4. Directorio `tweets`

   - Crear los archivos: `index.js`, `newTweetController.js`, `getTweetsController.js`, `getTweetsUserController.js`, `getSingleTweetController.js`, `updateTweetController.js` y `deleteTweetController.js`.
   - Documento <a name="controllers-tweets-newTweetController">`newTweetController.js`</a>:

     - Importar:

       ```javascript
       import { imgSchema } from '../../schemas/imgSchema.js';
       import { newTweetSchema } from '../../schemas/tweets/newTweetSchema.js';
       import { insertTweetService } from '../../services/tweets/insertTweetService.js';
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
       ```

     - Crear y exportar la función asincrona controladora `newTweetController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `id` del usuario de la `request`.
         - Obtener el `text` de `req.body`.
         - Validar el `text` con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`newTweetSchema`](#schemas-tweets-newTweetSchema).
         - Obtener el `image` de `req.files`.
         - Si hay imagen, validarla con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`imgSchema`](#schemas-imgSchema).
         - Guardar en `tweet` el resultado de la función [`insertTweetService`](#services-tweets-insertTweetService) que recibe el `userId`, el `text` y la `image`. Nos devuelve el tweet.
         - Responder con el tweet insertado.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-tweets-getTweetsController">`getTweetsController.js`</a>:

     - Importar:

       ```javascript
       import { selectTweetsModel } from '../../models/tweets/index.js';
       ```

     - Crear y exportar la función asincrona controladora `getTweetsController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Guardar en tweets el resultado de la función [`selectTweetsModel`](#models-tweets-selectTweetsModel). Nos devuelve los tweets.
         - Si no hay tweets, lanzar un error 'No hay tweets', httpStatus 404, code 'TWEETS_NOT_FOUND'.
         - Responder con los tweets.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-tweets-getTweetsUserController">`getTweetsUserController.js`</a>:

     - Importar:

       ```javascript
       import { selectTweetsByUserIdModel } from '../../models/tweets/index.js';
       ```

     - Crear y exportar la función asincrona controladora `getTweetsUserController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `userId` de los `params` de la `request`.
         - Guardar en tweets el resultado de la función [`selectTweetsByUserIdModel`](#models-tweets-selectTweetsByUserIdModel) que recibe el `userId`. Nos devuelve los tweets de ese usuario.
         - Si no hay tweets, lanzar un error 'Aun no tiene tweets', httpStatus 404, code 'TWEETS_NOT_FOUND'.
         - Responder con los tweets.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-tweets-getSingleTweetController">`getSingleTweetController.js`</a>:

     - Importar:

       ```javascript
       import { selectTweetByIdModel } from '../../models/tweets/index.js';
       import { notFoundError } from '../../services/errorService.js';
       ```

     - Crear y exportar la función asincrona controladora `getSingleTweetController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `tweetId` de los `params` de la `request`.
         - Guardar en tweet el resultado de la función [`selectTweetByIdModel`](#models-tweets-selectTweetByIdModel) que recibe el `tweetId`. Nos devuelve el tweet.
         - Responder con el tweet.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-tweets-updateTweetController">`updateTweetController.js`</a>:

     - Importar:

       ```javascript
       import { imgSchema } from '../../schemas/imgSchema.js';
       import { updateTweetSchema } from '../../schemas/tweets/updateTweetSchema.js';
       import { updateTweetService } from '../../services/tweets/updateTweetService.js';
       import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
       ```

     - Crear y exportar la función asincrona controladora `updateTweetController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `id` del usuario de la `request`.
         - Obtener el `id` del tweet de los `params` de la `request`.
         - Obtener el `text` de `req.body`.
         - Validar el `text` con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`updateTweetSchema`](#schemas-tweets-updateTweetSchema).
         - Obtener el `image` de `req.files`.
         - Si hay imagen, validarla con [`validateSchemaUtil`](#utils-validateSchemaUtil) y [`imgSchema`](#schemas-imgSchema).
         - Guardar en `tweet` el resultado de la función [`updateTweetService`](#services-tweets-updateTweetService) que recibe el `userId`, el `tweetId`, el `text` y la `image`. Nos devuelve el tweet actualizado.
         - Responder con el tweet actualizado.
       - En el bloque `catch` lanzar el error con `next(error)`.

   - Documento <a name="controllers-tweets-deleteTweetController">`deleteTweetController.js`</a>:

     - Importar:

       ```javascript
       import { deleteTweetService } from '../../services/tweets/deleteTweetService.js';
       ```

     - Crear y exportar la función asincrona controladora `deleteTweetController`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Obtener el `id` del usuario de la `request`.
         - Obtener el `id` del tweet de los `params` de la `request`.
         - La función [`deleteTweetService`](#services-tweets-deleteTweetService) recibe el `userId` y el `tweetId`. Nos devuelve el resultado de la eliminación.
         - Responder con un mensaje de confirmación.
       - En el bloque `catch` lanzar el error con `next(error)`.

## Directorio middlewares

1. Crear los archivos: `index.js`, `authUserController.js` y `userExistsController.js`.
2. Documento <a name="middlewares-authUserController">`authUserController.js`</a>:

   - Importar:

     ```javascript
     // importar los errores personalizados.
     import { notAuthenticatedError } from '../services/errorService.js';

     // importar las utilidades.
     import { validateTokenUtil } from '../utils/validateTokenUtil.js';
     ```

   - Crear y exportar la función middleware asincrona `authUserController`.
   - Usar un bloque `try/catch`.
     - En el bloque `try`:
       - Desestructurar la cabecera `Authorization` de la `request` y guardar el token en `authorization`.
       - Si no hay token, lanzar el error con [`notAuthenticatedError`](#services-errorService-notAuthenticatedError).
       - Verificar el token con [`validateTokenUtil`](#utils-validateTokenUtil) y guardar la info descifrada en `tokenInfo`.
       - Añadir `tokenInfo` a la propiedad `req.user`.
       - Pasar al siguiente middleware con `next()`.
     - En el bloque `catch` lanzar el error con `next(error)`.

3. Documento <a name="middlewares-userExistsController">`userExistsController.js`</a>:

   - Importar:

     ```javascript
     import { selectUserByIdModel } from '../models/users/index.js';
     import { notFoundError } from '../services/errorService.js';
     ```

   - Crear y exportar la función middleware asincrona `userExistsController`.
   - Usar un bloque `try/catch`.
     - En el bloque `try`:
       - Obtener el `id` del usuario ya sea de `req.user.id` o de la `req.params.userId`.
       - La función [`selectUserByIdModel`](#models-users-selectUserByIdModel) recibe el `id` del usuario. Nos devuelve el usuario.
       - Si no existe el usuario, lanzar el error con [`notFoundError`](#services-errorService-notFoundError).
       - Pasar al siguiente middleware con `next()`.
     - En el bloque `catch` lanzar el error con `next(error)`.

4. Documento <a name="middlewares-tweetExistsController">`tweetExistsController.js`</a>:

   - Importar:

     ```javascript
     import { selectTweetByIdModel } from '../models/tweets/index.js';
     import { notFoundError } from '../services/errorService.js';
     ```

   - Crear y exportar la función middleware asincrona `tweetExistsController`.
   - Usar un bloque `try/catch`.
     - En el bloque `try`:
       - Obtener el `tweetId` de la `request`.
       - Guardar en `tweet` el resultado de la función [`selectTweetByIdModel`](#models-tweets-selectTweetByIdModel) que recibe el `tweetId`. Nos devuelve el tweet.
       - Si no existe el tweet, lanzar el error con [`notFoundError`](#services-errorService-notFoundError).
       - Pasar al siguiente middleware con `next()`.
     - En el bloque `catch` lanzar el error con `next(error)`.

5. Documento <a name="middlewares-index">`index.js`</a>:

   - Se encarga de centralizar todos los middlewares y exportarlos.
   - Importar:

     ```javascript
     import { authUserController } from './authUserController.js';
     import { userExistsController } from './userExistsController.js';
     import { tweetExistsController } from './tweetExistsController.js';
     ```

   - Exportar:

     ```javascript
     export { authUserController, userExistsController, tweetExistsController };
     ```

## Directorio utils

1. Crear los archivos: `createPathUtil.js`, `createUploadsPathUtil.js`, `deleteImageUtil.js`, `deleteUploadsPathUtil.js`, `sendEmailUtil.js`, `validateSquemaUtil.js` y `validateTokenUtil.js`.
2. Documento <a name="utils-createPathUtil">`createPathUtil.js`</a>:

   - Importar:

     ```javascript
     import fs from 'fs/promises';
     ```

   - Crear y exportar la función asincrona `createPathIfNotExistsUtil`.
     - Debe recibir la ruta.
     - Usar un bloque `try/catch`.
     - En el bloque `try` comprobar si la ruta existe con `await fs.access`.
     - En el bloque `catch` si no existe, crear la ruta con `await fs.mkdir`.

3. Documento <a name="utils-createUploadsPathUtil">`createUploadsPathUtil.js`</a>:

   - Importar:

     ```javascript
     import fs from 'fs/promises';
     import path from 'path';
     import { UPLOADS_DIR } from '../../env.js';
     ```

   - Crear y exportar la función asincrona `createUploadsPathUtil`.
     - Crear las rutas `rootDir`, `uploadsDir`, `usersDir` y `tweetsDir` con `path.join`.
     - Usar un bloque `try/catch`.
     - En el bloque `try` crear las 3 rutas con `await fs.mkdir(ruta, { recursive: true })`.
     - En el bloque `catch` si no se puede crear la ruta, lanzar el error con `throw error`.

4. Documento <a name="utils-deleteImageUtil">`deleteImageUtil.js`</a>:

   - Importar:

     ```javascript
     import fs from 'fs/promises';
     import path from 'path';
     ```

   - Crear y exportar la función asincrona `deleteImageUtil`.
     - Recibe la ruta donde se guardan las imágenes de los `tweets` de un usuario `tweetUserDir` y el nombre de la imagen `image`.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Crear la ruta `imagePath` con `path.join`.
         - Elimina la imagen con `await fs.rm(imagePath)`.
       - En el bloque `catch` si no se puede eliminar la imagen, lanzar el error con `throw error`.

5. Documento <a name="utils-deleteUploadsPathUtil">`deleteUploadsPathUtil.js`</a>:

   - Importar:

     ```javascript
     import fs from 'fs/promises';
     import path from 'path';
     import { UPLOADS_DIR } from '../../env.js';
     ```

   - Crear y exportar la función asincrona `deleteUploadsPathUtil`.
     - Crear la ruta `uploadsDir` con `path.join`.
     - Usar un bloque `try/catch`.
     - En el bloque `try` eliminar la ruta con `await fs.rm(ruta, { recursive: true })`.
     - En el bloque `catch` si no se puede eliminar la ruta, lanzar el error con `throw error`.

6. Documento <a name="utils-sendEmailUtil">`sendEmailUtil.js`</a>:

   - Importar:

     ```javascript
     // Importamos las dependencias.
     import nodemailer from 'nodemailer';

     // Importamos los errores.
     import { sendEmailError } from '../services/errorService.js';

     // Obtenemos las variables de entorno necesarias.
     import {
       SMTP_SERVICE,
       SMTP_PORT,
       SMTP_USER,
       SMTP_PASS,
     } from '../../env.js';
     ```

   - Crear el transporter usando `nodemailer` y las variables de entorno.

   - Crear y exportar la función asincrona `sendEmailUtil`.
     - Recibe la dirección `email`, el `asunto` y el `texto` del email.
     - Usar un bloque `try/catch`.
     - En el bloque `try` enviar el email con `await transporter.sendMail`.
     - En el bloque `catch` si no se puede enviar el email, lanzar el error con [`sendEmailError`](#services-errorService-sendEmailError).

7. Documento <a name="utils-validateSchemaUtil">`validateSchemaUtil.js`</a>:

   - Crear y exportar la función asincrona `validateSchemaUtil`. Recibe el `schema` y el contenido del `body` de la `request` para validar si los datos recibidos son correctos.
   - Usar un bloque `try/catch`.
   - En el bloque `try` validar el cuerpo con el esquema con `await schema.validateAsync(body)`.
   - En el bloque `catch` si hay un error, añadirle el `httpStatus`, el `code` y lanzar el error con `throw error`.

8. Documento <a name="utils-validateTokenUtil">`validateTokenUtil.js`</a>:

   - Importar:

     ```javascript
     // Importar jwt
     import jwt from 'jsonwebtoken';

     // Importar el error personalizado.
     import { invalidCredentialsError } from '../services/errorService.js';

     // Importar la clave secreta.
     import { SECRET } from '../../env.js';
     ```

   - Crear y exportar la función asincrona `validateTokenUtil` que recibe el `token`.
   - Usar un bloque `try/catch`.
     - En el bloque `try`, devolver la info descifrada del token con `jwt.verify` y la `SECRET`.
     - En el bloque `catch`, si el token no es válido, lanzar el error con [`invalidCredentialsError`](#services-errorService-invalidCredentialsError).

## Directorio services

1. Crear el archivo `errorService.js` y los directorios `users` y `tweets`.
2. Documento <a name="services-errorService">`errorService.js`</a>:

   - Crear y exportar la función <a name="services-errorService-notFoundError">`notFoundError`</a>.

     ```javascript
     export const notFoundError = (resource) => {
       throw {
         httpStatus: 404, // Not Found
         code: 'RESOURCE_NOT_FOUND',
         message: `El recurso '${resource}' no existe`,
       };
     };
     ```

     Recibe el recurso solicitado y crea un objeto error con `httpStatus`, `code` y `message`.

   - Crear y exportar la función <a name="services-errorService-sendEmailError">`sendEmailError`</a>.

     ```javascript
     export const sendEmailError = () => {
       throw {
         httpStatus: 500, // Internal Server Error
         code: 'SEND_EMAIL_ERROR',
         message: 'Error al enviar el email',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-usernameAlreadyRegisteredError">`usernameAlreadyRegisteredError`</a>.

     ```javascript
     export const usernameAlreadyRegisteredError = () => {
       throw {
         httpStatus: 409, // Conflict
         code: 'USER_ALREADY_REGISTERED',
         message: 'El nombre de usuario ya está registrado',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-emailAlreadyRegisteredError">`emailAlreadyRegisteredError`</a>.

     ```javascript
     export const emailAlreadyRegisteredError = () => {
       throw {
         httpStatus: 409, // Conflict
         code: 'EMAIL_ALREADY_REGISTERED',
         message: 'El email ya está registrado',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-invalidCredentialsError">`invalidCredentialsError`</a>.

     ```javascript
     export const invalidCredentialsError = () => {
       throw {
         httpStatus: 401, // Unauthorized
         code: 'INVALID_CREDENTIALS',
         message: 'Credenciales inválidas',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-pendingActivationError">`pendingActivationError`</a>.

     ```javascript
     export const pendingActivationError = () => {
       throw {
         httpStatus: 403, // Forbidden
         code: 'PENDING_ACTIVATION',
         message: 'Usuario pendiente de activación. Revisa tu email',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-userAlreadyActivatedError">`userAlreadyActivatedError`</a>.

     ```javascript
     export const userAlreadyActivatedError = () => {
       throw {
         httpStatus: 409, // Conflict
         code: 'USER_ALREADY_ACTIVATED',
         message: 'El usuario ya está activado',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-notAuthenticatedError">`notAuthenticatedError`</a>.

     ```javascript
     export const notAuthenticatedError = () => {
       throw {
         httpStatus: 401, // Unauthorized
         code: 'NOT_AUTHENTICATED',
         message:
           'Debes enviar el token de autenticación en la cabecera "Authorization"',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-notAuthorizedError">`notAuthorizedError`</a>.

     ```javascript
     export const notAuthorizedError = () => {
       throw {
         httpStatus: 403, // Forbidden
         code: 'NOT_AUTHORIZED',
         message: 'No tienes permisos para realizar esta acción',
       };
     };
     ```

   - Crear y exportar la función <a name="services-errorService-saveFileError">`saveFileError`</a>.

     ```javascript
     export const saveFileError = () => {
       throw {
         httpStatus: 500, // Internal Server Error
         code: 'FILE_SAVE_FAILED',
         message: 'Error al guardar el archivo en el disco',
       };
     };
     ```

3. Directorio `users`:

   - Crea los archivos: `insertUserService.js`, `updateUserService.js` y `updateAvatarUserService.js`.
   - Documento <a name="services-users-insertUserService">`insertUserService.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo bcrypt.
       import bcrypt from 'bcrypt';

       // Importar los modelos.
       import {
         insertUserModel,
         selectUserByEmailModel,
         selectUserByUsernameModel,
       } from '../../models/users/index.js';

       // Importar las utilidades.
       import { sendEmailUtil } from '../../utils/sendEmailUtil.js';

       // Importar los módulos de error.
       import {
         emailAlreadyRegisteredError,
         usernameAlreadyRegisteredError,
       } from '../errorService.js';

       import { PORT } from '../../../env.js';
       ```

     - Crear y exportar la función asincrona `insertUserService`.
       - Recibe el `username`, el `email`, el `password` y el `registrationCode` del usuario.
       - Comprobar si el `username` ya está registrado con [`await selectUserByUsernameModel`](#models-users-selectUserByUsernameModel)
       - Si ya está registrado con ese `username`, lanzar el error con [`usernameAlreadyRegisteredError`](#services-errorService-usernameAlreadyRegisteredError).
       - Comprobar si el `email` ya está registrado con [`await selectUserByEmailModel`](#models-users-selectUserByEmailModel).
       - Si ya está registrado con ese `email`, lanzar el error con [`emailAlreadyRegisteredError`](#services-errorService-emailAlreadyRegisteredError).
       - Hashear la contraseña con `await bcrypt.hash`.
       - Crear un `registrationCode` con `crypto.randomUUID`.
       - Insertar el usuario con [`await insertUserModel`](#models-users-insertUserModel).
       - Crear el asunto y el texto del email de activación.
       - Enviamos el email de activación con [`await sendEmailUtil`](#utils-sendEmailUtil).

   - Documento<a name="services-users-updateUserService">`updateUserService.js`</a>:

     - Importar:

       ```javascript
       import {
         selectUserByEmailModel,
         selectUserByIdModel,
         selectUserByUsernameModel,
         updateUserModel,
       } from '../../models/users/index.js';
       import {
         emailAlreadyRegisteredError,
         usernameAlreadyRegisteredError,
       } from '../errorService.js';
       ```

     - Crear y exportar la función asincrona `updateUserService`.
       - Desestructurar el `body` para obtener el `username`, el `email`, la `bio` y los `hobbies`.
       - Comprobar si el `username` ya está registrado con [`selectUserByUsernameModel`](#models-users-selectUserByUsernameModel).
       - Si ya está registrado con ese `username` y el `id` no es el mismo, lanzar el error con [`usernameAlreadyRegisteredError`](#services-errorService-usernameAlreadyRegisteredError).
       - Comprobar si el `email` ya está registrado con [`selectUserByEmailModel`](#models-users-selectUserByEmailModel).
       - Si ya está registrado con ese `email` y el `id` no es el mismo, lanzar el error con [`emailAlreadyRegisteredError`](#services-errorService-emailAlreadyRegisteredError).
       - Actualizar el usuario con [`await updateUserModel`](#models-users-updateUserModel).
       - Recuperar el usuario actualizado con [`await selectUserByIdModel`](#models-users-selectUserByIdModel).
       - Devolver el usuario actualizado con `return user`.

   - Documento <a name="services-users-updateAvatarUserService">`updateAvatarUserService.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo path.
       import path from 'path';

       // Importar el módulo sharp.
       import sharp from 'sharp';

       import { saveFileError } from './errorService.js';
       import { createPathIfNotExistsUtil } from '../utils/createPathUtil.js';
       import { UPLOADS_DIR } from '../../env.js';
       ```

     - Crear y exportar la función asincrona `updateAvatarUserService`.
       - Recibe el `id` del usuario, el archivo de la imagen y el tamaño de redimensión.
       - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Crear la ruta donde se guardará el archivo. Usar `path.join` con `process.cwd()`, `UPLOADS_DIR`, `avatar` y `id`.
         - Comprobar si existe el directorio con [`await createPathIfNotExists`](#utils-createPathUtil). Si no existe lo crea y si no puede lanzar un error.
         - Crear un objeto Sharp con la imagen recibida con `sharp(img.data)`.
         - Redimensionar la imagen con `imgSharp.resize(width)`.
         - Crear el nombre de la imagen como uuid.
         - Insertar el nombre de la imagen en la base de datos con [`await updateUserAvatarModel`](#models-users-updateUserAvatarModel).
         - Ruta de la imagen con `path.join` con `uploadsDir` y `imgName`.
         - Usar un bloque `try/catch` para guardar la imagen.
           - En el bloque `try` guardar la imagen con `await imgSharp.toFile()`.
           - En el bloque `catch` si hay un error, lanzar el error con [`saveFileError`](#services-errorService-saveFileError).
         - Devolver el nombre de la imagen con `return imgName`.
       - En el bloque `catch` lanzar el error con `throw error`.

4. Directorio `tweets`:

   - Crear los archivos: `insertTweetService.js`, `updateTweetService.js` y `deleteTweetService.js`.
   - Documento <a name="services-tweets-insertTweetService">`insertTweetService.js`</a>:

     - Importar:

       ```javascript
       import path from 'path';
       import sharp from 'sharp';
       import { saveFileError } from '../errorService.js';
       import { createPathIfNotExistsUtil } from '../../utils/createPathUtil.js';
       import { insertTweetModel } from '../../models/tweets/index.js';
       import { UPLOADS_DIR } from '../../../env.js';
       ```

     - Crear y exportar la función asincrona `insertTweetService`.
       - Recibe el `userId`, el `text` y la `image` del tweet.
       - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Crear una `id` para el tweet con `crypto.randomUUID`.
         - Crear un nombre para la imagen con `crypto.randomUUID` si hay imagen.
         - Insertar el tweet con [`await insertTweetModel`](#models-tweets-insertTweetModel) que recibe el `tweetId`, el `userId`, el `text` y la `imgName`. Nos devuelve el tweet insertado.
         - Si hay `tweet` e `image`:
           - Crear la ruta `uploadsDir` donde se guardará la imagen con `path.join` con `process.cwd()`, `UPLOADS_DIR`, `tweets` y `userId`.
           - Crear la ruta donde se guardará el archivo con [`createUploadsPathUtil`](#utils-createUploadsPathUtil) si no existe.
           - Crear un objeto Sharp con la imagen recibida con `sharp(img.data)`.
           - Redimensionar la imagen con `imgSharp.resize(500)`.
           - Crear la ruta de la imagen `imgPath` con `path.join` con `uploadsDir` y `imgName`.
           - Guardar la imagen con `await imgSharp.toFile(imgPath)`. Si hay un error, lanzar el error con [`saveFileError`](#services-errorService-saveFileError).
         - Devolver el tweet insertado con `return tweet`.
       - En el bloque `catch` lanzar el error con `throw error`.

   - Documento <a name="services-tweets-updateTweetService">`updateTweetService.js`</a>:

     - Importar:

       ```javascript
       import path from 'path';
       import sharp from 'sharp';
       import { saveFileError } from '../errorService.js';
       import { createPathIfNotExistsUtil } from '../../utils/createPathUtil.js';
       import { UPLOADS_DIR } from '../../../env.js';
       import {
         selectTweetByIdModel,
         updateTweetModel,
       } from '../../models/tweets/index.js';
       import { notAuthorizedError } from '../errorService.js';
       import { deleteImageUtil } from '../../utils/deleteImageUtil.js';
       ```

     - Crear y exportar la función asincrona `updateTweetService`.
       - Recibe el `userId`, el `tweetId`, el `text` y la `image` del tweet.
       - Usar un bloque `try/catch`.
         - En el bloque `try`:
           - Guardar en `oldTweet` el resultado de la función [`selectTweetByIdModel`](#models-tweets-selectTweetByIdModel) que recibe el `tweetId`. Nos devuelve el tweet.
           - Si no es el autor, lanzar el error con [`notAuthorizedError`](#services-errorService-notAuthorizedError).
           - Crear un nombre para la imagen con `crypto.randomUUID` si hay imagen con la extensión `.jpg`.
           - Guardar en `tweet` el resultado de la función [`updateTweetModel`](#models-tweets-updateTweetModel) que recibe el `tweetId`, el `text` y la `imgName`. Nos devuelve el tweet actualizado.
           - Si hay `tweet` e `image`:
             - Crear la ruta `uploadsDir` donde se guardará la imagen con `path.join` con `process.cwd()`, `UPLOADS_DIR`, `tweets` y `userId`.
             - Crear la ruta `uploadsDir` donde se guardará el archivo con [`createUploadsPathUtil`](#utils-createUploadsPathUtil) si no existe.
             - Si existe `oldTweet.image` borrar la imagen anterior con [`deleteImageUtil`](#utils-deleteImageUtil) que recibe la ruta `uploadsDir` y el nombre de la imagen `oldTweet.image`.
             - Crear un objeto Sharp con la imagen recibida con `sharp(img.data)`.
             - Redimensionar la imagen con `imgSharp.resize(500)`.
             - Crear la ruta de la imagen `imgPath` con `path.join` con `uploadsDir` y `imgName`.
             - Guardar la imagen con `await imgSharp.toFile(imgPath)`. Si hay un error, lanzar el error con [`saveFileError`](#services-errorService-saveFileError).
           - Devolver el tweet actualizado con `return tweet`.

   - Documento <a name="services-tweets-deleteTweetService">`deleteTweetService.js`</a>:

     - Importar:

       ```javascript
       import {
         deleteTweetModel,
         selectTweetByIdModel,
       } from '../../models/tweets/index.js';
       import { notAuthorizedError } from '../errorService.js';
       ```

     - Crear y exportar la función asincrona `deleteTweetService`.
       - Recibe el `userId` y el `tweetId` del tweet.
       - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Guardar en `tweet` el resultado de la función [`selectTweetByIdModel`](#models-tweets-selectTweetByIdModel) que recibe el `tweetId`. Nos devuelve el tweet.
         - Si no es el autor, lanzar el error con [`notAuthorizedError`](#services-errorService-notAuthorizedError).
         - Eliminar el tweet con [`deleteTweetModel`](#models-tweets-deleteTweetModel) que recibe el `tweetId`. Nos devuelve el resultado de la eliminación.
       - En el bloque `catch` lanzar el error con `throw error`.

## Directorio models

1. Crear los directorios `users` y `tweets`
2. Directorio `users`.

   - Crear los archivos: `index.js`, `insertUserModel.js`, `selectUserByUsernameModel`, `selectUserByEmailModel.js`, `selectUserByIdModel.js`, `selectUserByRegistrationCodeModel.js`, `updateUserActivationModel.js`, `updateUserModel` y `updateUserAvatarModel.js`.

   - Documento <a name="models-users-insertUserModel">`insertUserModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `insertUserModel`. Recibe el `id`, el `username`, el `email`, el `password` y el `registrationCode` del usuario.
     - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
     - Guardar el resultado de la consulta en `result` usando `await pool.query`.
     - Comprobar si se ha insertado el usuario con `result.affectedRows`, si no se ha insertado, lanzar un error.

   - Documento <a name="models-users-selectUserByUsernameModel">`selectUserByUsernameModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `selectUserByUsernameModel`. Recibe el `username` del usuario.
     - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
     - Guardar el resultado de la consulta en `[user]` usando `await pool.query`.
     - Devolver el resultado de la consulta con `return user[0]`.

   - Documento <a name="models-users-selectUserByEmailModel">`selectUserByEmailModel.js`</a>:

     - Igual que `selectUserByUsernameModel.js` pero recibe el `email`.

   - Documento <a name="models-users-selectUserByIdModel">`selectUserByIdModel.js`</a>:

     - Igual que `selectUserByUsernameModel.js` pero recibe el `id`.

   - Documento <a name="models-users-selectUserByRegistrationCodeModel">`selectUserByRegistrationCodeModel.js`</a>:

     - Igual que `selectUserByUsernameModel.js` pero recibe el `registrationCode`.
     - Si no encuentra el usuario con ese `registrationCode`, lanzar un error.
     - Comprobamos si el usuario ya está activado. Si ya está activado, lanzar un error.
     - Devuelve el resultado de la consulta con `return user[0]`.

   - Documento <a name="models-users-updateUserActivationModel">`updateUserActivationModel.js`</a>:

     - Igual que `selectUserByUsernameModel.js` pero recibe el `registrationCode`.
     - Guardar el resultado de la consulta en `result` usando `await pool.query`.
     - Comprobar si se ha actualizado el usuario con `result.affectedRows`, si no se ha actualizado, lanzar un error.
     - Devuelve el resultado de la consulta con `return result`.

   - Documento <a name="models-users-updateUserModel">`updateUserModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `updateUserModel`. Recibe el `userId`, el `username`, el `email`, la `bio` y los `hobbies`.
     - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
     - Crea la `query` con los valores `username` y `email` que son `required`.
     - Crea un `array` con los valores `username` y `email` que son `required`.
     - Si hay `bio` lo añade a la query y hace un push al array. Si no hay `bio` lo añade a la query como `, bio = NULL`.
     - Si hay `hobbies` lo añade a la query y hace un push al array. Si no hay `hobbies` lo añade a la query como `, hobbies = NULL`.
     - Termina la query con ` WHERE id = ?`.
     - Guardar el resultado de la consulta en `result` usando `await pool.query` con la `query` y el `[...values, userId]`.
     - Compobar si se ha actualizado el usuario con `result.affectedRows`, si no se ha actualizado, lanzar un error.
     - Devuelve el resultado de la consulta con `return result`.

   - Documento <a name="models-users-updateUserAvatarModel">`updateUserAvatarModel.js`</a>:

     - Igual que `selectUserByUsernameModel.js` pero recibe el `userId` y el `avatarName`.
     - Guardar el resultado de la consulta en `result` usando `await pool.query`.
     - Comprobar si se ha actualizado el usuario con `result.affectedRows`, si no se ha actualizado, lanzar un error.
     - Devuelve el resultado de la consulta con `return result`.

   - Documento <a name="models-users-index">`index.js`</a>:

     - Se encarga de centralizar todos los modelos de usuarios y exportarlos.
     - Importar:

       ```javascript
       import { insertUserModel } from './insertUserModel.js';
       import { selectUserByUsernameModel } from './selectUserByUsernameModel.js';
       import { selectUserByEmailModel } from './selectUserByEmailModel.js';
       import { selectUserByIdModel } from './selectUserByIdModel.js';
       import { selectUserByRegistrationCodeModel } from './selectUserByRegistrationCodeModel.js';
       import { updateUserActivationModel } from './updateUserActivationModel.js';
       import { updateUserModel } from './updateUserModel.js';
       import { updateUserAvatarModel } from './updateUserAvatarModel.js';
       ```

     - Exportar:

       ```javascript
       export {
         insertUserModel,
         selectUserByUsernameModel,
         selectUserByEmailModel,
         selectUserByIdModel,
         selectUserByRegistrationCodeModel,
         updateUserActivationModel,
         updateUserModel,
         updateUserAvatarModel,
       };
       ```

3. Directorio `tweets`.

   - Crear los archivos: `insertTweetModel.js`, `selectTweetsModel.js`, `selectTweetsByUserIdModel.js`, `selectTweetByIdModel.js`, `updateTweetModel.js`, `deleteTweetModel.js` e `index.js`.
   - Documento <a name="models-tweets-insertTweetModel">`insertTweetModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `insertTweetModel`. Recibe el `id`, el `userId`, el `text` y la `imgName` del tweet.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
         - Crear la `query` base con `id`, `userId` y `text` que son `required`.
         - Crear el array `values` con los valores `id`, `userId` y `text` que son `required`.
         - Si hay `image`:
           - Modifica la `query` y añade `imgName` que es `required` y hace un push al array `values`.
           - Añade `image` al array `values` haciendo un push.
         - Insertar el tweet con `await pool.query` con la `query` y el `values`.
         - Verificar si se ha insertado el tweet con `result.affectedRows`, si no se ha insertado, lanzar un error.
         - Buscar el tweet insertado.
         - Devolver el tweet insertado con `return tweet[0]`.
       - En el bloque `catch` lanzar el error con `throw error`.

   - Documento <a name="models-tweets-selectTweetsModel">`selectTweetsModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `selectTweetsModel`.
       - Usar un bloque `try/catch`.
         - En el bloque `try`:
           - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
           - Guardar el resultado de la consulta en `tweets` usando `await pool.query`.
           - Devolver el resultado de la consulta con `return tweets`.
         - En el bloque `catch` lanzar el error con `throw error`.

   - Documento <a name="models-tweets-selectTweetsByUserIdModel">`selectTweetsByUserIdModel.js`</a>:

     - Igual que `selectTweetsModel.js` pero recibe el `userId`.
     - Devuelve los tweets del usuario.

   - Documento <a name="models-tweets-selectTweetByIdModel">`selectTweetByIdModel.js`</a>:

     - Igual que `selectTweetsModel.js` pero recibe el `tweetId`.
     - Devuelve el tweet con ese `tweetId`.

   - Documento <a name="models-tweets-updateTweetModel">`updateTweetModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `updateTweetModel`. Recibe el `id`, el `text` y la `image` del tweet.
     - Usar un bloque `try/catch`.
       - En el bloque `try`:
         - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
         - Crear la `query` base con `text` que es `required`.
         - Crear el array `values` con el valor `text` que es `required`.
         - Si hay `image`:
           - Añadir a la `query` y añade `image = ?` que es `required`.
           - Añade `image` al array `values` haciendo un push.
         - Añadir a la `query` el `WHERE id = ?`.
         - Añadir al array `values` el `id` haciendo un push.
         - Actualizar el tweet con `await pool.query` con la `query` y el `values`.
         - Verificar si se ha insertado el tweet con `result.affectedRows`, si no se ha insertado, lanzar un error.
         - Buscar el tweet insertado.
         - Devolver el tweet insertado con `return tweet[0]`.
       - En el bloque `catch` lanzar el error con `throw error`.

   - Documento <a name="models-tweets-deleteTweetModel">`deleteTweetModel.js`</a>:

     - Importar:

       ```javascript
       // Importamos la conexión a la base de datos.
       import { getPool } from '../../db/getPool.js';
       ```

     - Crear y exportar la función asincrona `deleteTweetModel`. Recibe el `tweetId` del tweet.
       - Usar un bloque `try/catch`.
         - En el bloque `try`:
           - Crea el pool de conexiones con [`await getPool()`](#db-getPool).
           - Guardar el resultado de la consulta en `result` usando `await pool.query`.
           - Verificar si se ha eliminado el tweet con `result.affectedRows`, si no se ha eliminado, lanzar un error.
         - En el bloque `catch` lanzar el error con `throw error`.

   - Documento <a name="models-tweets-index">`index.js`</a>:

     - Importar:

       ```javascript
       import { insertTweetModel } from './insertTweetModel.js';
       import { selectTweetsModel } from './selectTweetsModel.js';
       import { selectTweetsByUserIdModel } from './selectTweetsByUserIdModel.js';
       import { selectTweetByIdModel } from './selectTweetByIdModel.js';
       import { updateTweetModel } from './updateTweetModel.js';
       import { deleteTweetModel } from './deleteTweetModel.js';
       ```

     - Exportar:

       ```javascript
       export {
         insertTweetModel,
         selectTweetsModel,
         selectTweetsByUserIdModel,
         selectTweetByIdModel,
         updateTweetModel,
         deleteTweetModel,
       };
       ```

## Directorio schemas

1. Crear los archivos `imgSchema.js` y `joiErrorMessages.js` y los directorios `users` y `tweets`.
2. Documento <a name="schemas-imgSchema">`imgSchema.js`</a>:

   - Importar:

     ```javascript
     // Importar el módulo joi.
     import joi from 'joi';

     // Importar el módulo joiErrorMessages.
     import { joiErrorMessages } from './joiErrorMessages.js';
     ```

   - Crear y exportar el esquema `imgSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

     ```javascript
     export const imgSchema = joi
       .object({
         name: joi.string().required().messages(joiErrorMessages),
         mimetype: joi
           .string()
           .valid('image/jpeg', 'image/png')
           .required()
           .messages(joiErrorMessages),
         size: joi.number().max(5000000).required().messages(joiErrorMessages),
       })
       .unknown(true);
     ```

3. Documento <a name="schemas-joiErrorMessages">`joiErrorMessages.js`</a>:

   - Crear y exportar el objeto `joiErrorMessages` con los mensajes de error personalizados.

     ```javascript
     export const joiErrorMessages = {
       'any.required': 'El campo "{#key}" es requerido',
       'string.base': 'El valor de "{#key}" debe ser una cadena',
       'string.empty': 'El campo "{#key}" no debe estar vacío',
       'number.base': 'El valor de "{#key}" debe ser un número',
       'number.max': 'El archivo no debe exceder los 5 MB',
       'object.base': 'El valor de "{#key}" debe ser un objeto',
       'any.only': 'Solo se permiten fotos jpeg o png',
       'string.email':
         'Debe proporcionar un correo electrónico válido para "{#key}"',
       'string.pattern.base':
         'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo de puntuación para "{#key}"',
       'string.min':
         'El campo "{#key}" debe tener al menos {#limit} caracteres',
       'string.max':
         'El campo "{#key}" no debe exceder los {#limit} caracteres',
       'object.unknown': 'No se permiten campos adicionales en este objeto',
     };
     ```

4. Directorio `users`:

   - Crear los archivos: `newUserSchema.js`, `loginUserSchema.js`, `updateUserSchema.js` y `updateUserAvatarSchema.js`.
   - Documento <a name="schemas-users-newUserSchema">`newUserSchema.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo joi.
       import joi from 'joi';

       // Importar el módulo joiErrorMessages.
       import { joiErrorMessages } from '../joiErrorMessages.js';
       ```

     - Crear y exportar el esquema `newUserSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

       ```javascript
       export const newUserSchema = joi.object({
         username: joi
           .string()
           .min(3)
           .max(30)
           .required()
           .messages(joiErrorMessages),
         email: joi.string().email().required().messages(joiErrorMessages),
         password: joi
           .string()
           .pattern(
             /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@¡!$%^&*()_+|~=`{}:";'<>¿?,.])[a-zA-Z0-9@¡!$%^&*()_+|~=`{}:";'<>¿?,.]{8,}$/
           )
           .required()
           .messages(joiErrorMessages),
       });
       ```

   - Documento <a name="schemas-users-loginUserSchema">`loginUserSchema.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo joi.
       import joi from 'joi';

       // Importar el módulo joiErrorMessages.
       import { joiErrorMessages } from '../joiErrorMessages.js';
       ```

     - Crear y exportar el esquema `loginUserSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

       ```javascript
       export const loginUserSchema = joi.object({
         email: joi.string().email().required().messages(joiErrorMessages),
         password: joi.string().required().messages(joiErrorMessages),
       });
       ```

   - Documento <a name="schemas-users-updateUserSchema">`updateUserSchema.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo joi.
       import joi from 'joi';
       ```

     - Crear y exportar el esquema `updateUserSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

       ```javascript
       export const updateUserSchema = joi.object({
         username: joi
           .string()
           .min(3)
           .max(30)
           .required()
           .messages(joiErrorMessages),
         email: joi.string().email().required().messages(joiErrorMessages),
         bio: joi.string().max(150).messages(joiErrorMessages),
         hobbies: joi.string().max(100).messages(joiErrorMessages),
       });
       ```

   - Documento <a name="schemas-users-updateUserAvatarSchema">`updateUserAvatarSchema.js`</a>:

     - Importar:

       ```javascript
       // Importar el módulo joi.
       import joi from 'joi';

       // Importar el schema de img.
       import { imgSchema } from '../../imgSchema.js';
       ```

     - Crear y exportar el esquema `updateUserAvatarSchema` y usar [`imgSchema`](#schemas-imgSchema).

       ```javascript
       export const updateUserAvatarSchema = joi.object({
         avatar: imgSchema.required(),
       });
       ```

5. Directorio `tweets`:

   - Crear los archivos: `newTweetSchema.js` y `updateTweetSchema.js`.
   - Documento <a name="schemas-tweets-newTweetSchema">`newTweetSchema.js`</a>:

     - Importar:

       ```javascript
       import joi from 'joi';
       import { joiErrorMessages } from '../joiErrorMessages.js';
       ```

     - Crear y exportar el esquema `newTweetSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

       ```javascript
       export const newTweetSchema = joi.object({
         text: joi
           .string()
           .min(1)
           .max(280)
           .required()
           .messages(joiErrorMessages),
       });
       ```

   - Documento <a name="schemas-tweets-updateTweetSchema">`updateTweetSchema.js`</a>:

     - Importar:

       ```javascript
       import joi from 'joi';
       import { joiErrorMessages } from '../joiErrorMessages.js';
       ```

     - Crear y exportar el esquema `updateTweetSchema` y usar [`joiErrorMessages`](#schemas-joiErrorMessages).

       ```javascript
       export const updateTweetSchema = joi.object({
         text: joi
           .string()
           .min(1)
           .max(280)
           .required()
           .messages(joiErrorMessages),
       });
       ```
