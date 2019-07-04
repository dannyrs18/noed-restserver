/**
 * ===============================
 * Test Token
 * ===============================
 */

const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.get('token') || req.query.token;
    // res.json({
    //     token
    // });
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token invalid'
            });
        }
        // console.log(decoded); // payload
        
        req.usuario = decoded.usuario;
        next()
    }) 
}

/**
 * ===============================
 * Test ROLE_ADMIN
 * ===============================
 */

let verifyAdmin = (req, res, next) => {

    // Tiene q pasar primero por verifyToken para q usuario exista en req
    let usuario = req.usuario;

    if (usuario.rol !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            message: 'You are not an administrator user'
        })
    }
    next()
}

module.exports = {
    verifyToken,
    verifyAdmin
}