const express = require('express'),
    fileUpload = require('express-fileupload'),
    fs = require('fs'),
    path = require('path'),
    Usuario = require('../models/usuario'),
    Producto = require('../models/producto'),
    app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    
    let tipo = req.params.tipo,
        _id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message:'No se ha cargado un archivo'
            }
        });
    }
    
    let tiposAvailable = ['productos', 'usuarios']; // Solo rutas de producto y usuarios

    if (!tiposAvailable.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las tipos permitidas son ${tiposAvailable.join(', ')}`
            }
        })
    }

    let archivo = req.files.archivo,
        extensionsAvailable = ['png', 'jpg', 'gif', 'jpeg'],
        archivoExtension = archivo.name.split('.').pop();

    if (!extensionsAvailable.includes(archivoExtension)) { 
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extenciones permitidas son ${extensionsAvailable.join(', ')}`
            }
        })
    }
    
    let imgName = `${_id}-${new Date().getMilliseconds()}.${archivoExtension}`
    archivo.mv(`server/uploads/${tipo}/${imgName}`, function(err) {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') imagenUsuario(res, _id, imgName);
        else imagenProducto(res, _id, imgName)
    });
})


function imagenUsuario(res, _id, imgName) {
    Usuario.findById(_id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuarios', imgName);
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!usuarioDB) {
            borrarArchivo('usuarios', imgName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        let oldImg = usuarioDB.img;
        usuarioDB.img = imgName;
        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                borrarArchivo('usuarios', imgName);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            borrarArchivo('usuarios', oldImg)
            res.json({
                ok: true,
                message: 'Imagen guardada con exito',
                usuario: usuarioDB
            }) 
        })
    })
}

function imagenProducto(res, _id, imgName) {
    Producto.findById(_id, (err, productoDB) => {
        if (err) {
            borrarArchivo('productos', imgName);
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoDB) {
            borrarArchivo('productos', imgName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }
        let oldImg = productoDB.img;
        productoDB.img = imgName;
        productoDB.save((err, productoDB) => {
            if (err) {
                borrarArchivo('productos', imgName);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            borrarArchivo('productos', oldImg)
            res.json({
                ok: true,
                message: 'Imagen guardada con exito',
                usuario: productoDB
            }) 
        })
    })
}


function borrarArchivo(carpeta, imgName) {

    let pathImg = path.resolve(__dirname, `../uploads/${carpeta}/${imgName}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }

}

module.exports = app;