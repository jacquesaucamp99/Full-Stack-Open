import Header from './Header'
import Part from './Part'

const Course = ({course}) => {

  return (
    <div>
      <Header headerText={course.name} />

      <ul style={{ listStyle: 'none' }}>
        {course.parts.map(part => (
          <Part part={part} key={part.id} />
        ))}
      </ul>
      <p style={{ fontWeight: 'bold' }}>
        Number of exercises {course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      </p>
    </div>
  )
}

export default Course