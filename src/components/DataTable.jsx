import React, { useEffect, useState } from 'react'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './table.css'

const iconStyles = {
  borderRadius: "50%",
  padding: "2px",
  border: "none",
  backgroundColor: "#cedccf",
  marginRight: "2px"
}


const DataTable = () => {
  const [students, setStudents] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState({});

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


  const AddStudent = (
    <span onClick={()=>{handleOpen("addModal")}}>
      <PlaylistAddIcon />
    </span>
  )
  const SearchBar = (
    <input type='text' placeholder='Search...' className='searchbar'
      onChange={(e) => {
        setQuery(e.target.value.toLowerCase().trim());
      }
      } />
  )

  const filterButton = (
    <span><FilterListIcon /></span>
  )

  const columns = [
    { key: "id", component: "Id" },
    { key: "name", component: "Name" },
    { key: "matricule", component: "Matricule" },
    { key: "age", component: "age" },
    { key: "gender", component: "Gender" },
    { key: "level", component: "Level" },
    { key: "addIcon", component: AddStudent }
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
        <td className='icon-td' >
          {<EditIcon sx={iconStyles} />}
          {<DeleteOutlineIcon sx={iconStyles} />}
        </td>
      </tr>)
  }

  return (
    <div>
      <table>
        <thead>
          <tr className='searchTr'>
            <td></td><td></td><td></td><td></td><td></td>
            <td>{SearchBar}</td>
            <td style={{ textAlign: "left" }}>{filterButton}</td>
          </tr>
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
          <tr>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td>
              <span className='paginate-span'>
                <KeyboardDoubleArrowLeftIcon />
              </span>
              <span className='paginate-span'>
                <KeyboardArrowLeftIcon />
              </span>
              <span className='paginate-span'>
                <KeyboardArrowRightIcon />
              </span>
              <span className='paginate-span'>
                <KeyboardDoubleArrowRightIcon />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataTable