const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
}

var token = jwt.sign(data, 'secretsalter'); //esse token sera armazenado no token array
console.log(token);

var decoded = jwt.verify(token, 'secretsalter');
console.log('decoded', decoded);

// jwt.sign // ----takes the data and creates the hash
// jwt.verify //---- makes sure the data was not manipulated
// var message = 'I am user number 1!';
// var hash = SHA256(message).toString(); //SHA256() return obj

// console.log(`Message: ${message}`);
// console.log(`Message: ${hash}`);

// var data = {
//     id: 3
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret salter').toString()
// }

// token.data.id = 5; //pilantra querendo manipular 5
// token.hash = SHA256(JSON.stringify(token.data)).toString(); // pilantra safado criando hash do user 5!

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret salter').toString(); // salter impede pilantra!

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Pilantra tentando entrar no sistema!');
// }
/* -----------hashing is a one way algorithm - meaning I cant get the original message back from the result 
though I always get the same result even running a few times------------------------*/
/*------- chamado the JSON web token ---------*/
