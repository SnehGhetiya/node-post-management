const mongoose = require("mongoose");
require("dotenv").config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DATABASE;
const cluster = process.env.MONGODB_CLUSTER;

const MONGODB_URL = `mongodb+srv://${username}:${password}@${cluster}.cg8odaj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

module.exports = db;
