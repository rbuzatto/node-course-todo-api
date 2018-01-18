const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //ao usar return clause nao necessita usar o 'else' 
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected do MongoDB server');

    const mydb = db.db('TodoApp');
    // mydb.collection('Todos').insertOne({
    //         text: 'Primeiro Todo Inserido',
    //         completed: false
    //     }, (err, result) => {
    //         if (err) {
    //             return console.log('Deu Pau, inseriu nada! ', err);
    //         }

    //         console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //insert new doc into Users' collection (name, age, location)

    mydb.collection('Users').
        insertOne({
            name: 'Rafael Buzatto de Campos',
            age: 33,
            location: 'São Paulo'
        }, (err, result) => {
            if (err) {
                return console.log('Falha em manipular db ', err);
            }

            console.log(JSON.stringify(result.ops, undefined, 2));
        })

    db.close();
});