const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //ao usar return clause nao necessita usar o 'else' 
        return console.log('Unable to connect to MongoDB server');
    }

    const mydb = db.db('TodoApp');
    // .find() gera um pointer. algo como reference, nao o array per say
    // por isso .toArray()
    // mydb.collection('Todos').find({
    //     _id: new ObjectID('5a5fbb7466d5293630050a92')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to connect ', err);
    // });

    
    // mydb.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to connect ', err);
    // });

    mydb.collection('Users').find({name: 'Rafael'}).count()
    .then((count) =>{
        console.log(`Users name Rafael count: ${count}`);
    }, (err) => {
        console.log('Unable to connect ', err);
    });

    mydb.collection('Users').find({name: 'Rafael'}).toArray()
    .then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log(`Unable to connect ${err}`);
    });


    //db.close();
});