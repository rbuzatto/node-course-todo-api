const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //ao usar return clause nao necessita usar o 'else' 
        return console.log('Unable to connect to MongoDB server');
    }

    const mydb = db.db('TodoApp');
    //look duplicates - deleteMany, findOneAndDelete qq um by id

    //necessario os update operators para realizar os updates. para saber mais google!
    
    mydb.collection('Users')
        .findOneAndUpdate({
            _id: new  ObjectID("5a60d26489425dc2cee297cd")
            }, {
                $rename: {name: 'firstName'}
            }, {
                returnOriginal: false
        })
        .then((result) => {
            console.log(JSON.stringify(result.value, undefined, '[o] '));
        });
    
    // mydb.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5a60e6f689425dc2cee29acc")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false //queremos o valor updated
    // }).then((result) => {
    //     console.log(result);
    // });

    //db.close();
});