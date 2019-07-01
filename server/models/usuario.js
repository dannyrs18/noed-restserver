const mongoose = require('mongoose');
var uniquevalidator = require('mongoose-unique-validator');

let roleValidation = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido'] //Agregar una advertencia 
    },
    password: {
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidation
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})


// Quitar parametro password del schema (evitando q se visualize el password dentro del JSON llamada)
// EL objeto toJSON() es el objeto que siempre se llama antes de enviar el objeto. lo vamos a modificar para cambiar la estructura
usuarioSchema.methods.toJSON = function() {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    
    return userObject
}

// Crear un validador personalizado 
usuarioSchema.plugin(uniquevalidator, {message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema)