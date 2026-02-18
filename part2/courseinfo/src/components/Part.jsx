{/* Created as a universal component */}
const Part = (props) => {
  return (
    <li>
      {props.part.name} {props.part.exercises}
    </li>
  )
}

export default Part