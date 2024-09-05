import axios from "axios";
import { apiKey } from "../index";

 const forcastEndPoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=no&alerts=no` ; 
 const locationEndPoint = params => `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}&aqi=no` ; 


 const apiCall = async (endPoint)=>{
    const option = {
        method : "GET" , 
        url : endPoint , 
    }

    try{
        const response = await axios.request(option);
        return response.data
    }catch(error){
        console.log(error)
        return null ; 
    }
}

export const fetchWeatherForcast = (params)=>{
    return apiCall(forcastEndPoint(params))
}

export const fetchLocation = (params)=>{
    return apiCall(locationEndPoint(params))
}
