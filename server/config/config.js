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