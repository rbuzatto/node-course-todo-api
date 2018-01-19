var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validateEmail(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

var userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email é necessário'],
        minlength: [1,'tamanho minimo nao encontrado'],
        trim: true,
        validate: [validateEmail, 'email não válido']
        
    }
});


var User = mongoose.model('User', userSchema);

module.exports ={User};