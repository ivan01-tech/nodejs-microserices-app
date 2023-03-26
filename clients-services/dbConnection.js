import { config } from "dotenv";
import mongoose from "mongoose";

// load env
config()

const { USERS_DB_URL } = process.env

export const dbConnection = async function () {
	console.log(USERS_DB_URL);
	mongoose.set("strictQuery", true);
	try {
		mongoose.connect(USERS_DB_URL, {
			useNewUrlParser: true,
			autoIndex: true
		})
		console.log("connected to mongodb !");
	} catch (err) {
		console.log("db error : ", err);
	}
}