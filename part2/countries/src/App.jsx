import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import countriesService from './Services/countries'
import './index.css'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div>
      <h1>Search</h1>
      <div>
        <Filter filterText={filterText} handleFilterChange={(event) => setFilterText(event.target.value)} />
      </div>

      <h1>Countries</h1>
      <div>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length === 1 ? (
          <div>
            <h2>{filteredCountries[0].name.common}</h2>
            <p>Capital: {filteredCountries[0].capital}</p>
            <p>Population: {filteredCountries[0].population}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(filteredCountries[0].languages ?? {}).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} />
          </div>
        ) : (
          // Add an inline button to show details for each country when there are multiple matches
          filteredCountries.map((country) => (
            <div key={country.name.common}>
              <p>{country.name.common}</p> 
              <button onClick={() => setFilterText(country.name.common)}>Show Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  )

}

export default App
