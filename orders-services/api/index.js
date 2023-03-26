import axios from "axios";

export function getAxiosIntance(ressource) {
	let instance
	switch (ressource) {
		case "foods":
			instance = axios.create({
				baseURL: "http://localhost:5000/foods"
			})
			break
		case "users":
			instance = axios.create({
				baseURL: "http://localhost:3000/users"
			})
			break
		default: instance = axios
			break
	}

	return instance
}