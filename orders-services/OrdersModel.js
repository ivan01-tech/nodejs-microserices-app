import mongoose from "mongoose";

const OrdersModel = mongoose.Schema({
	userId: {
		type: mongoose.SchemaTypes.ObjectId,
		require: true
	},
	foodId: {
		type: mongoose.SchemaTypes.ObjectId,
		require: true
	},
	startDate: { type: Date, require: true },
	endDate: { type: Date, require: false },
})

const Orders = mongoose.models.Orders || mongoose.model("Orders", OrdersModel)

export { Orders }