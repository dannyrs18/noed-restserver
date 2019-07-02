const mongoose = require('mongoose');
// var uniquevalidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerida']
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }

})

module.exports = mongoose.model('Categoria', categoriaSchema)