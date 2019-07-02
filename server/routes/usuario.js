const express = require('express');
const Usuario = require('../models/usuario');
const { verifyToken, verifyAdmin } = require('../middlewares/auth')
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let estado = req.query.estado || true;
    Usuario.find({ estado:estado }, 'nombre email rol estado google') // buscar usuarios con la condicion {} y solo obtener los datos de ""
        .skip(desde) // saltarse _desde_ colecciones
        .limit(limite) // tomar _limite_ colecciones
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado:estado }, (err, conteo) => { // contar los registros con la condicion de {}
                res.json({
                    ok: true,
                    usuarios,
                    conteo: conteo
                })
            })
        })
});

app.post('/usuario', [verifyToken, verifyAdmin], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.put('/usuario/:id', [verifyToken, verifyAdmin], (req, res) => {
    
    let id = req.params.id;
    // req.body trae todas los datos que se quiere modificar.. en teroria hasta la clave se cambiaria si no cambiamos el esquema del objeto
    // para no elminar uno por uno los valores que no se deseen cambiar en la base de datos instalamos una libreria que es una extencion para manejar
    // codigo mas facil ya que aumenta la funcionalidad de javascript
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // creamos un json con 3 elementos que se pueden crear

    // Usuario fue un elemento required() de los modelos line 2
    Usuario.findOneAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.delete('/usuario/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    //  Usuario.findByIdAndRemove(id, (err, usuario) => { // Esta linea eliminaba el registro completamente de la base de datos pero se la modifico para que cambiase el estado del usuario
    Usuario.findOneAndUpdate(id, {estado: false}, {new: true}, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario
        })
    })
});

module.exports = app;