import mongoose from "mongoose";

const FoodModel = mongoose.Schema({
	name: { type: String, require: true },
	author: { type: String, require: true }
})

const Foods = mongoose.models.Food || mongoose.model("Food", FoodModel)

export { Foods }