import express from "express"
import { config } from "dotenv"
import cors from "cors"
import { dbConnection } from "./dbConnection.js"
import { Orders } from "./OrdersModel.js"
import mongoose from "mongoose"
import { getUser } from "./api/Users.js"
import { getFood } from "./api/Food.js"
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

// add new Order
server.post("/orders", async function (req, res) {
	try {
		const { userId, foodId, startDate, endDate } = req.body

		if (!userId || !foodId || !startDate) return res.status(400).json({ message: "all data are required !" })
		// get user properties
		const { data: user } = await getUser(userId)
		// get food properties
		const { data: food } = await getFood(foodId)

		if (!user) return res.status(404).json({ message: "User Not Found" })
		if (!food) return res.status(404).json({ message: "Food Not Found" })

		const Order = await Orders.create({
			userId: mongoose.Types.ObjectId(userId),
			foodId: mongoose.Types.ObjectId(foodId),
			startDate: new Date(startDate),
			endDate: endDate && new Date(endDate)
		})

		if (!Order) return res.status(500).json({ message: "something went wrong !" })

		return res.status(201).json({ data: Order })

	} catch (err) {
		console.log(err);
	}
})

// get all Order
server.get("/orders", async function (req, res) {
	try {
		const Orders = await Orders.find()
		if (!Orders) return res.status(404).json({ message: "Orders not found" })
		res.status(201).json({ data: Orders })
	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// get a single Order by id
server.get("/orders/:id", async function (req, res) {
	try {
		const { id } = req.params
		const Order = await Orders.findById(id).lean().exec()

		if (!Order)
			return res.status(404).json({ message: "Order not found" })

		console.log(Order);
		// get user properties
		const { data: user } = await getUser(Order.userId)
		// get food properties
		const { data: food } = await getFood(Order.foodId)

		return res.status(200).json({ Order, user, food })

	} catch (err) {
		console.log(err);
		res.status(501).json({ message: "something went wrong" })
	}
})

// delete an Order with a specify id
server.delete("/Orders/:id", async function (req, res) {
	try {
		const { id } = req.params
		const Order = await Orders.findById(id).lean()

		if (!Order)
			return res.status(404).json({ message: "Order not found" })

		console.log(Order);
		const deleteOrder = await Orders.deleteOne({ ...Order })

		return res.status(200).json({ data: Order, prop: deleteOrder })

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
