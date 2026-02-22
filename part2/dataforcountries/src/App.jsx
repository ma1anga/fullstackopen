import { useState, useEffect, useReducer } from 'react'
import countriesService from './services/countries'

import CountriesList from './components/CountriesList'
import Country from './components/Country'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(countries => setAllCountries(countries))
  }, [])

  const onFilterValueChange = event => {
    setFilterValue(event.target.value)
    setSelectedCountry(null)
  }

  const selectCountry = name => {
    countriesService.get(name).then(country => setSelectedCountry(country))
  }

  const filteredCountries = allCountries
    .filter(country => country.name.common.toLowerCase().includes(filterValue.toLowerCase()))
  const isSpecificCountrySelected = filteredCountries.length === 1 || selectedCountry

  return (
    <div>
      find countries <input value={filterValue} onChange={onFilterValueChange} />
      {
        isSpecificCountrySelected
          ? <Country countryData={selectedCountry ? selectedCountry : filteredCountries[0]} />
          : <CountriesList countries={filteredCountries} onShowButtonClick={selectCountry} />
      }
    </div>
  )
}

export default App