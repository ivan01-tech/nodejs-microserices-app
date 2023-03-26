import mongoose from "mongoose";

const UserModel = mongoose.Schema({
	name: { type: String, require: true },
	email: { type: String, require: true }
})
const Users = mongoose.models.User || mongoose.model("User", UserModel)

export { Users }