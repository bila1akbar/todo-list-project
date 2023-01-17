const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _= require("lodash");
const { day } = require("./external_modules/handlingItems");
// eslint-disable-next-line no-undef
const handlingItems = require(__dirname + "/external_modules/handlingItems.js");
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs"); // to tell we are using ejs for dynamic binding
app.use(bodyParser.urlencoded({ extended: true })); //to parse the body of the html and store it into req.body
app.use(express.static("public")); //When a client makes a request for a file in this directory, the middleware will check if the file exists and, if it does, send it to the client with the appropriate Content-Type header.
mongoose.set("strictQuery", true); //to avoid the deprecation warning
mongoose.connect(
	"mongodb+srv://admin-bilal:test123@atlascluster.kvhg4ya.mongodb.net/todolistDB"
);
const itemSchema = new mongoose.Schema({
	name: {
		type: String
	},
});
const Item = mongoose.model("item", itemSchema);
const customListSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema]
});
const customList = mongoose.model("customList", customListSchema);
app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/", function (req, res) {
	console.log(`Request at ${req.url}}`)
	handlingItems.listTitle = handlingItems.day;
	Item.find({}, function (err, items) {
		if (err) console.log(err);
		else res.render("list", { listTitle: handlingItems.listTitle, newItems: items });
	});
	console.log("Yes yes ");
});
function createandDisColl(theList, res) {
	customList.findOne({ name: theList }, async function (err, result) {
		if (!result) {
			const newDocument = new customList({
				name: theList,
			});
			await newDocument.save();
			res.render("list", { listTitle: handlingItems.listTitle, newItems: newDocument.items});
		}
		else {
			res.render("list", { listTitle: handlingItems.listTitle, newItems: result.items });
		}
	});
}
app.get("/:list", function (req, res) {
	const theList = _.capitalize(req.params.list);
	handlingItems.listTitle = `${theList}`;
	createandDisColl(theList, res);
});
app.post("/", function (req, res) {
	const item = req.body.newItem;
	if (handlingItems.listTitle !== handlingItems.day) {
		handlingItems.handlingPostRequest(customList, handlingItems.listTitle, item, req, res);
	} else {
		handlingItems.handlingPostRequest(Item, "items", item, req, res);
	}
});
// handling the post request
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
