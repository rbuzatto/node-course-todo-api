const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //ao usar return clause nao necessita usar o 'else' 
        return console.log('Unable to connect to MongoDB server');
    }

    const mydb = db.db('TodoApp');
    //look duplicates - deleteMany, findOneAndDelete qq um by id

    mydb.collection('Users').deleteMany({name: 'Rafael'}).then((result) => {
        console.log(result);
    });


    mydb.collection('Users').findOneAndDelete({_id: new ObjectID("5a60d24b89425dc2cee297c9")})
    .then((result) => {
        console.log(JSON.stringify(result.value, undefined, ' -- '));
    });

    // deleteMany, deleteOne, *findOneAndDelete (*retorna valor e o deleta)

    // mydb.collection('Todos').deleteMany({text: 'eat lunch'})
    // .then((result) => {
    //     console.log(result);
    // });

    // mydb.collection('Todos').deleteOne({text: 'eat lunch'})
    // .then((result) => {
    //     console.log(result);
    // });

    // mydb.collection('Todos').findOneAndDelete({completed: false})
    // .then((object) => {
    //     console.log(object);
    // });
    /* eu coloquei object mas na verdade o obj esta inserido em object.value */


    //db.close();
});