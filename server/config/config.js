// Estas variables solo estan disponibles en el entorno de desarrollo HEROKU
// Asi podremos revisar si estamos en producción o desarrollo

/**
 * =================================
 * Puerto
 * =================================
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * =================================
 * Coneccion en MongoDB
 * =================================
 */

// creamos una variable global y colocaremos la configuración de la base de datos
// si existe la propiedad process.env.NODE_ENV significa que estamos en produccion (HEROKU) caso contrario estamos en local y dependiendo de ello creamos la conexión
// process.env.DB_CONNECT = (!process.env.NODE_ENV) ? 
//     'mongodb://localhost:27017/cafe' : 
//     process.env.MONGO_URI_CONNECT
// CODIGO ANTIGUO

// Se creo una variable de entono dentro de heroku llamada MONGO_URI_CONNECT donde mantiene la direccion de conexión de la base de datos con sus credenciales
process.env.MONGO_URI_CONNECT = process.env.MONGO_URI_CONNECT || 'mongodb://localhost:27017/cafe'


/**
 * =================================
 * Tokens
 * =================================
 */

process.env.EXPIRED_TOKEN = '48h' // 60 seg * 60 min * 24 hor * 30 dias
process.env.SEED = process.env.SEED || 'SED_DEV'; // Firma del token

/**
 * Comandos de Heroku para crear variables de entorno
 * heroku config // Listar todas las variables de entorno
 * heroku config:set nombre = "Danny Romero" // Se crea una variable con valor
 * heroku config:get nombre // Obtener valor de variable 
 * heroku config:unset nombre // Remover variable de entorno
 */

/**
 * =================================
 * Google Client Id
 * =================================
 */

 process.env.GOOGLE_ID = process.env.GOOGLE_ID || '273882050262-trb151u2g16acko4lnh13gnlrg5hpsab.apps.googleusercontent.com'