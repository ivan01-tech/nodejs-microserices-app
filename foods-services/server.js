import express from "express"
import { config } from "dotenv"
import cors from "cors"
import { dbConnection } from "./dbConnection.js"
import { Foods } from "./FoodsModel.js"
import mongoose from "mongoose"
// load env file
config()

const { PORT } = process.env
const server = express();

// connect to the database
(
	async function () {
		await dbConnection()
	}
)()

// middleware
server.use(cors({ origin: "*" }))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

/**
 * API Gateway
 */

// add new food
server.post("/foods", async function (req, res) {
	try {

		const { name, author } = req.body

		if (!name || !author) return res.status(400).json({ message: "all data are required !" })

		const food = await Foods.create({ name, author })

		res.status(201).json({ data: food })

	} catch (err) {
		console.log(err);
	}
})

// get all food
server.get("/foods", async function (req, res) {
	try {
		const foods = await foods.find()
		if (!foods) return res.status(404).json({ message: "foods not found" })
		res.status(201).json({ data: foods })
	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// get a single food by id
server.get("/foods/:id", async function (req, res) {
	try {
		const { id } = req.params
		const food = await Foods.findById(id).lean().exec()

		if (!food)
			return res.status(404).json({ message: "food not found" })

		console.log(food);
		return res.status(200).json({ data: food })

	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// delete a food with a specify id
server.delete("/foods/:id", async function (req, res) {
	try {
		const { id } = req.params
		const food = await Foods.findById(id).lean().exec()

		if (!food)
			return res.status(404).json({ message: "food not found" })

		console.log(food);
		const deletefood = await Foods.deleteOne({ ...food })

		return res.status(200).json({ data: food, prop: deletefood })

	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

mongoose.connection.once("open", function () {
	console.log("Connected to MongoDB");
	// listen to the server after we are connected to the db
	server.listen(PORT, function () {
		console.log("server up and running on port ", PORT);
	})

})
