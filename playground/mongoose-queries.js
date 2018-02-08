const {ObjectID}    = require('mongodb');

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');

var id = '5a61669d31ef5933f42f4869';
// mongoose dispensa necessidade de criar objectID, ele faz isso pra vc

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });


// se estiver fetching 1 item use esse que retorna um obj apenas ao inves de array
// e se não existir seu item o retorno sera null
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found'); //se todo retorna null nao gera erro, essa é uma maneira de gerir.
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e)); // em caso de um id size nao válido, ai retorna erro

/* challenge
* querie users' collection - 
* load users model
* -> user.findById -> handle 3 cases*/

User.findById(id).then((user) => {
    if(!user) {
        return console.log('Id not found');
    }
    console.log('User By Id', user);
}).catch((e) => console.log(e));