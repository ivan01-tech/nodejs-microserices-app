import express from "express"
import { config } from "dotenv"
import cors from "cors"
import { dbConnection } from "./dbConnection.js"
import { Users } from "./UserModel.js"
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

// add new user
server.post("/users", async function (req, res) {
	try {

		const { name, email } = req.body

		if (!name || !email) return res.status(400).json({ message: "all data are required !" })

		const user = await Users.create({ name, email })

		res.status(201).json({ data: user })

	} catch (err) {
		console.log(err);
	}
})

// get all user
server.get("/users", async function (req, res) {
	try {
		const users = await Users.find()
		res.status(201).json({ data: users })

	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// get a single user by id
server.get("/users/:id", async function (req, res) {
	try {
		const { id } = req.params
		const user = await Users.findById(id).lean().exec()

		if (!user)
			return res.status(404).json({ message: "user not found" })

		console.log(user);
		return res.status(200).json({ data: user })

	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// delete a user with a specify id
server.delete("/users/:id", async function (req, res) {
	try {
		const { id } = req.params
		const user = await Users.findById(id).lean().exec()

		if (!user)
			return res.status(404).json({ message: "user not found" })

		console.log(user);
		const deleteUser = await Users.deleteOne({ ...user })

		return res.status(200).json({ data: user, prop: deleteUser })

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
