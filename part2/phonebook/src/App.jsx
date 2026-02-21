import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ value, onChange }) => {
  return (
    <div>filter shown with
      <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const { onSubmit, name, number, onNameChange, onNumberChange } = props;

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} />
        <br />
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, onDeleteClick }) => {
  return (
    <>
      {persons.map(person => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => onDeleteClick(person)}>delete</button>
        </div>
      ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

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
      .then(savedPerson => setPersons(persons.concat(savedPerson)))

    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (id, newPerson) => {
    personService.update(id, newPerson)
          .then(updatedPerson => {
            const updatedList = persons
              .map(person => person.id === id ? updatedPerson : person)

            setPersons(updatedList)
          })
  }

  const deletePerson = personToDelete => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(personToDelete.id).then(removedPerson => {
        setPersons(persons.filter(person => person.id !== removedPerson.id))
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