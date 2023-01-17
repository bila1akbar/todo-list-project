// variables

//functions
async function handlingPostRequest(dataBase, collName, item, req, res) {
	let items;
	console.log(dataBase.collection.name);
	if (dataBase.collection.name === "items" && item === undefined) {
		await dataBase.deleteOne({ _id: req.body.deletionButton }).exec((err) => {
			if (err) console.log("Error in deleting the item");
			else console.log("successfully deleted the item");
		});
		res.redirect("/");
	} else if (item === undefined) {
		const collection = await dataBase
			.findOneAndUpdate(
				{ name: collName },
				{
					$pull: { items: { _id: req.body.deletionButton } },
				},
				{ new: true }
			)
			.exec((err) => {
				if (err) console.log("Error in deleting the item");
				else console.log("successfully deleted the item");
			});
		res.redirect(`/${collName}`);
	}
	//Adding new items to the list
	else if (dataBase.collection.name === "items" && item !== undefined) {
		const newItem = new dataBase({
			name: item,
		});
		await newItem.save();
		res.redirect("/");
	} else {
		const foundedDB = await dataBase.findOneAndUpdate(
			{ name: collName },
			{ $push: { items: { name: item } } },
			{ new: true }
		);
		res.redirect(`/${foundedDB.name}`);
	}
}
const today = new Date();
const option = {
	weekday: "short",
	day: "numeric",
	month: "long",
	year: "2-digit",
};
const day = today.toLocaleDateString("en-US", option); //converts the date w.r.t to the values given in the option object
//the exporting object
module.exports = {
	listTitle: listTitle,
	handlingPostRequest: handlingPostRequest,
	day: day,
};
