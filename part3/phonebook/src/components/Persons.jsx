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

export default Persons