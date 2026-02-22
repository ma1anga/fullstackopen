const CountriesList = ({ countries, onShowButtonClick }) => {
  const tooManyCountries = "Too many countries, specify another filter"
  const list = countries.map(country => {
    const name = country.name.common

    return (
      <div key={name}>
        {name} <button onClick={() => onShowButtonClick(name)}>Show</button>
      </div>
    )
  })

  return (
    <div>
      {countries.length > 10 ? tooManyCountries : list}
    </div>
  )
}

export default CountriesList