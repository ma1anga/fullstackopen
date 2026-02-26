import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(persons => setPersons(persons))
  }, [])

  const getPersonByName = name => {
    return persons.find(person => person.name === name)
  }

  const addPerson = event => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = getPersonByName(newPerson.name)

    if (existingPerson) {
      const confirmMessage =
        `${newName} is already added to phonebook, replace the old number with a new one?`

      if (window.confirm(confirmMessage)) {
        updatePerson(existingPerson.id, newPerson)
      }

      return
    }

    personService.create(newPerson)
      .then(savedPerson => {
        setPersons(persons.concat(savedPerson))

        setNotificationMessage(`Added ${savedPerson.name}`)
        setTimeout(() => setNotificationMessage(null), 5000)
      })

    setNewName('')
    setNewNumber('')


  }

  const updatePerson = (id, newPerson) => {
    personService.update(id, newPerson)
      .then(updatedPerson => {
        const updatedList = persons
          .map(person => person.id === id ? updatedPerson : person)

        setPersons(updatedList)
        setNewName('')
        setNewNumber('')

        setNotificationMessage(`Updated ${updatedPerson.name}`)
        setTimeout(() => setNotificationMessage(null), 5000)
      })
      .catch(() => {
        setErrorMessage(`Information of ${newPerson.name} has already been removed from the server`)
        setTimeout(() => setErrorMessage(null), 5000)

        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = personToDelete => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(personToDelete.id).then(removedPerson => {
        setPersons(persons.filter(person => person.id !== removedPerson.id))

        setNotificationMessage(`Deleted ${removedPerson.name}`)
        setTimeout(() => setNotificationMessage(null), 5000)
      })
    }
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value)
  }

  const personsToShow = filterValue
    ? persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={errorMessage ? errorMessage : notificationMessage}
        isError={errorMessage ? true : false}
      />
      <Filter value={filterValue} onChange={handleFilterValueChange} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleNewNameChange}
        onNumberChange={handleNewNumberChange}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDeleteClick={deletePerson} />
    </div>
  )
}

export default App