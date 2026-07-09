import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import Form from './Components/Form'
import Persons from './Components/Persons'
import personService from './Services/persons'
import './index.css'
import SuccessNotification from './Components/SuccessNotification'
import ErrorNotification from './Components/ErrorNotification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  // The useEffect hook is used to fetch data from the server when the component mounts.
  useEffect(() => {
  console.log('effect')
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
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
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        personService
          .update(personToUpdate.id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
            setSuccessMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }

    // Add a check to ensure that the number is not empty and is a valid format (e.g., contains only digits and optional dashes)
    if (checkNumber(newNumber)) {
      alert('Please enter a valid number in the format XXX-XXXXXXX')
      return
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(`Failed to add ${newName}: ${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (person) => {
  if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setSuccessMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorMessage(`Information of ${person.name} has already been removed from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
}
  
  // This variable determines which persons to show based on the value of filterText
  const personsToShow = filterText
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase())) 
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
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
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App