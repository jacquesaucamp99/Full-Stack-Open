import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import Form from './Components/Form'
import Persons from './Components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  // The useEffect hook is used to fetch data from the server when the component mounts.
  useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
}, [])
  console.log('render', persons.length, 'persons')
  
  // Check if the name already exists in the phonebook
  const checkNameExists = (name) => {
    // persons.some() returns true if at least one element in the array satisfies the condition
    // person: is the function parameter that represents each element in the persons array
    // person.name === name: checks if the name property of the current person 
    // object is equal to the name parameter passed to the function
    return persons.some(person => person.name === name)
  }

  const checkNumber = (number) => {
    return number.trim() === '' || !/^\d{3}-\d{7}$/.test(number)
  }

  // Add a new name to the phonebook
  // This is called on submit
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    if (checkNameExists(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    // Add a check to ensure that the number is not empty and is a valid format (e.g., contains only digits and optional dashes)
    if (checkNumber(newNumber)) {
      alert('Please enter a valid number in the format XXX-XXXXXXX')
      return
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }
  
  // This variable determines which persons to show based on the value of filterText
  const personsToShow = filterText
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase())) 
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter filterText={filterText} handleFilterChange={(event) => setFilterText(event.target.value)}/>
      </div>
      <h2>Add a new person</h2>
      <Form newName={newName}
        newNumber={newNumber}
        handleNameChange={(event) => setNewName(event.target.value)}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App