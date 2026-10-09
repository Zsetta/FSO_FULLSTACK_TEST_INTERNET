import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL

const getAll = () => {
	console.log("getAll");
	const request = axios.get(baseURL);
	return request.then(response=>{console.log(response);return response.data});
}

const create = (newObject = {name,phone}) => {
	const request = axios.post(baseURL,newObject);
	return request.then(response=>response.data);
}

const deleteObject = (id) => {
	const request = axios.delete(`${baseURL}/${id}`);
	return request.then(res=>res.data);
}

const changePhone = (newObject,id) => {
	const request = axios.put(`${baseURL}/${id}`,newObject);
	if(request)
	{
		return request.then(res=>res.data) 
	}
	else
	{
		return request.catch(err=>err);
	}
}

export default {getAll,create,deleteObject,changePhone}