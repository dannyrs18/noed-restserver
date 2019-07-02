require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
// Resuelve rutas, paquete propio de node
const path = require('path');

const app = express()

// Es un middleware que transforma facilmente las peticiones post a json
const bodyParser = require('body-parser')
// Cada app.use() de express son middlewares, validadores o procesos antes de entregar la respuesta, estos codigos se ejecutan primero en la estructura de la libreria 
// parse application/x-www-form-urlencoded // codigo en tuplas de envio de datos del request
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Enlistamos en un archivo aparte las rutas para las peticiones
app.use(require('./routes/index'));

// Habilitar las paginas de carpeta public
app.use( express.static( path.resolve( __dirname, '../public') ));

// mongoose.connect(process.env.DB_CONNECT,{
mongoose.connect(process.env.MONGO_URI_CONNECT,{
    useCreateIndex: true,
    useNewUrlParser: true
}, (err, resp) => {
    if (err) throw err;
    console.log('Database connect', process.env.MONGO_URI_CONNECT);
    
});

app.listen(process.env.PORT, () => {
    console.log('listen', process.env.PORT);
})