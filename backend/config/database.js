import mongoose from "mongoose";

mongoose.connect("mongodb://bhuvabrijesh14_db_user:010tg0uV9eIQ4YKZ@ac-3cjdczi-shard-00-00.vbmndwq.mongodb.net:27017,ac-3cjdczi-shard-00-01.vbmndwq.mongodb.net:27017,ac-3cjdczi-shard-00-02.vbmndwq.mongodb.net:27017/Techerudite-task-db?ssl=true&replicaSet=atlas-m8amlo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0", {
  serverSelectionTimeoutMS: 10000,
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Database connection error", err);
});
db.once("open", (err) => {
    console.log("Database connected successfully");
})

export default db;