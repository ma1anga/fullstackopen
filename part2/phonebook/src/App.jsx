import { useEffect, useState } from 'react'
import axios from 'axios'

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

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map(person => (
        <div key={person.name}>
          {person.name} {person.number} <br />
        </div>
      ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    }), [])

  const isNameExist = (newPerson) => {
    return persons.some(person => person.name === newPerson.name)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (isNameExist(newPerson)) {
      alert(`${newName} is already added to phonebook`)

      return
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
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
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App