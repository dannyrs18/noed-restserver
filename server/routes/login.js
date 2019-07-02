const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_ID);

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecta'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecta'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.EXPIRED_TOKEN})
        })

    })
})


// Google config

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });

    console.log(ticket);
    
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    console.log(token);
    let googleCredentials;
    try {
        googleCredentials = await verify(token)
    } catch(err) {
        return res.json({
            ok: false,
            err
        })
    }

    Usuario.findOne({email: googleCredentials.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(usuarioDB){
            // Si existe nuestro usuario en la base de datos
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                })
            } else {
                return res.json({
                    ok: true,
                    token: jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.EXPIRED_TOKEN})
                })
            }
        } else {
            // Caso contrario
            let usuario = new Usuario({
                nombre: googleCredentials.nombre,
                email: googleCredentials.email,
                password: ':)',
                img: googleCredentials.picture,
                google: true
            });
            
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    token: jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.EXPIRED_TOKEN})
                })
            })
        }
    })
    // res.json({
    //     ok: true,
    //     usuario: googleCredentials
    // })
})

module.exports = app;

