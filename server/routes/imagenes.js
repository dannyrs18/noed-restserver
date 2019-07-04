const express = require('express'),
    fs = require('fs'),
    app = express(),
    path = require('path'),
    { verifyToken } = require('../middlewares/auth');

app.get('/imagen/:tipo/:img', verifyToken, (req, res) => {
    let tipo = req.params.tipo,
    img = req.params.img,
    pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync( pathImg )){
        res.sendFile(pathImg);
    } else {
        pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImg);
    }
})

module.exports = app;