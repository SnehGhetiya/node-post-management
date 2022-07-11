const express = require("express");
const cors = require("cors");
const db = require("./helper/connection");

const userRouter = require("./routes/user/user.routes");
const postRouter = require("./routes/post/post.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the Post Management API",
	});
});

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
	console.log("Connected to MongoDB");
});

module.exports = app;
