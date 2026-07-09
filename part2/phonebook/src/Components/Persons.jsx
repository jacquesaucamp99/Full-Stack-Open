const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <li className="person" key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>delete</button>
        </li>
      )}
    </ul>
  )
}

export default Persons