import { getAxiosIntance } from "./index.js";

export async function getFood(id) {

	try {
		const { data } = await getAxiosIntance("foods").get(`/${id}`)
		if (!data.data) return { message: "something went wrong" }

		console.log(data);
		return { data: data.data }

	} catch (err) {
		console.log("err : ", err);
		return { message: "something went wrong" }
	}
}