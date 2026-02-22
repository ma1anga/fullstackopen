import axios from "axios"

const baseUrl = "https://api.openweathermap.org/data/2.5/weather"
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

const getForecast = (latitude, longitude) => {
  return axios
    .get(`${baseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
    .then(response => response.data)
}

export default { getForecast }