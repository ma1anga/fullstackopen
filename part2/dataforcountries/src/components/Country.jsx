import { useState, useEffect } from "react"
import weatherService from '../services/weather'

const Country = ({ countryData }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    weatherService
      .getForecast(countryData.latlng[0], countryData.latlng[1])
      .then(weather => setWeatherData(weather))
  }, [countryData])

  const weather = weatherData ? (
    <>
      <h2>Weather in {countryData.name.common}</h2>
      <div>Temperature: {weatherData.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`}
        alt={`${weatherData.weather[0].icon} weather Icon`} />
      <div>Wind: {weatherData.wind.speed} m/s</div>
    </>
  ) : null

  return (
    <div>
      <h1>{countryData.name.common}</h1>
      <div>Capital: {countryData.capital.join(", ")}</div>
      <div>Area: {countryData.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(countryData.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={countryData.flags.png} alt={countryData.flags.alt} />
      {weather}
    </div>
  )
}

export default Country