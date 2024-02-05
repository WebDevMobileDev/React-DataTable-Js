import React, { useEffect, useState } from 'react'
import './table.css'


const DataTable = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("http://localhost:8000/students")
      const json = await response.json();
      if (response.ok) {
        setStudents(json)
        console.log(json)
      }
    }

    fetchStudents()
  }, [])

  const columns = [
    { key: "id", component: "Id" },
    { key: "name", component: "Name" },
    { key: "matricule", component: "Matricule" },
    { key: "age", component: "age" },
    { key: "gender", component: "Gender" },
    { key: "level", component: "Level" }
  ]

  const createBodyTr = (student) => {
    return (
      <tr key={student.id} data-id={student.id}>
        <td><span>{student.id}</span></td>
        <td><span>{student.name}</span></td>
        <td><span>{student.matricule}</span></td>
        <td><span>{student.age}</span></td>
        <td><span>{student.gender}</span></td>
        <td><span>{student.level}</span></td>
      </tr>)
  }
  console.log(columns)

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <td key={column.key}>{column.component}</td>
            ))}
          </tr>
        </thead>
        <tbody>
              {students && students.map((student) => (
                createBodyTr(student)
              ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable