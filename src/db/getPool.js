// Importar la versión asincrona de mysql2
import mysql from 'mysql2/promise';

// Obtener las variables de entorno
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} from '../../env.js';

// Crear una variable para almacenar el pool de conexiones
let pool;

// Crear una función para crear y devolver el pool de conexiones
export const getPool = async () => {
  try {
    if (!pool) {
      // Crear un pool temporal para conectarse al servidor de MySQL
      const poolTemp = mysql.createPool({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        port: MYSQL_PORT || 3306,
      });

      // Crear la base de datos si no existe
      await poolTemp.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`);

      // Creamos un nuevo pool de conexiones a la base de datos
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        port: MYSQL_PORT || 3306,
        database: MYSQL_DATABASE,
        timezone: 'Z',
      });
    }

    return pool;
  } catch (error) {
    console.log(error);
  }
};
