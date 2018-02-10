var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/TodoAppTest';
}
if (process.env.NODE_ENV === 'production') {
    process.env.MONGO_URI = 'mongodb://dumbuser:test123@ds229648.mlab.com:29648/nodecourse_todoapp';
}
