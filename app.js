// importamos express para crear el servidor
import express from 'express';
import fileUpload from 'express-fileupload';

// Importamos morgan para mostrar información de las peticiones
import morgan from 'morgan';

// Importamos cors para evitar problemas con las CORS
import cors from 'cors';

// Importamos las rutas
import { router } from './src/routes/index.js';

// Importamos los controladores de errores
import {
  notFoundController,
  errorController,
} from './src/controllers/errors/index.js';

// Obtenemos las variables de entorno
import { PORT } from './env.js';

// Creamos el servidor
const app = express();

// Middleware para parsear el body de las peticiones
app.use(express.json());

// Middleware para parsear el body de las peticiones en form-data
app.use(fileUpload());

// Middleware para mostrar información de las peticiones
app.use(morgan('dev'));

// Establecer el directorio público
app.use('/uploads', express.static('./uploads'));

// Middleware que evita que las CORS interfieran a la hora de conectar el frontend con el backend.
app.use(cors());

// Middleware que indica a express dónde están las rutas.
app.use(router);

// Middleware de Ruta No Encontrada que ejecuta su función controladora
app.use(notFoundController);

// Middleware de Error. No nos lo piden
app.use(errorController);

// Ponemos el servidor a escuchar en el puerto 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
