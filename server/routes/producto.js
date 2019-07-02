const express = require('express');
const Producto = require('../models/producto')
const app = express();
const { verifyToken } = require('../middlewares/auth')

app.get('/producto', verifyToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;

    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encuentran datos de Productos'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
    })
})

app.get('/producto/:id', verifyToken, (req, res) => {
    let _id = req.params.id
    let usuario = req.usuario
    Producto.findById(_id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encuentran datos de Productos'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
    })
})

app.get('/producto/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encuentran datos de Productos'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

app.post('/producto', verifyToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

app.put('/producto/:id', verifyToken, (req, res) => {
    let _id = req.params.id;
    let body = req.body; // Aqui deberiamos quitar propiedades que no queremos actualizar // Ahora por tema de practica se envia todo lo que viene del cliente
    Producto.findByIdAndUpdate(_id, body, {new: true, runValidators:true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar producto'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.delete('/producto/:id', (req, res) => {
    let _id = req.params.id;
    Producto.findByIdAndUpdate(_id, {disponible: false}, {new: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo inhabilitar el producto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

module.exports = app;