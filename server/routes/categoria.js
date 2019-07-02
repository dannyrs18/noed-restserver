const express = require('express');
const Categoria = require('../models/categoria');
const { verifyToken, verifyAdmin } = require('../middlewares/auth')
const _ = require('underscore');

const app = express();

app.get('/categoria', verifyToken, (req, res) => {
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron registros en la base de datos'
                    }
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let _id = req.params.id;
    Categoria.findById(_id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.post('/categoria', [verifyToken, verifyAdmin], (req, res) => {
    
    let body = req.body;
    let usuario = req.usuario

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no creada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.put('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
    let body = req.body;
    let _id = req.params.id;
    Categoria.findOneAndUpdate(_id, body, {new: true}, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.delete('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {

    let _id = req.params.id;
    
    Categoria.findByIdAndRemove(_id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Categoria not found'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

module.exports = app;