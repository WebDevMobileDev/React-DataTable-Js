import React, { useEffect, useState } from 'react'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './table.css'

const iconStyles = {
  borderRadius: "50%",
  padding: "2px",
  border: "none",
  backgroundColor: "#cedccf",
  marginRight: "2px"
}

//styles for the modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const DataTable = () => {
  //states
  const [students, setStudents] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState({ name: "", matricule: "", level: 1, gender: "male", age: 15 });
  const [open, setOpen] = useState('false');

  const handleOpen = (value) => setOpen(value);
  const handleClose = () => setOpen('false');

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

  //crud operations 
  const handleAddRow = async () => {
    await fetch('http://localhost:8000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: studentToAdd.name,
        matricule: studentToAdd.matricule,
        age: studentToAdd.age,
        level: studentToAdd.level,
        gender: studentToAdd.gender,
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      console.log(data)
      alert("student added")
      location.reload()
    }).catch(err => {
      console.log(err)
    }) 
  }


  //custom components
  const AddStudent = (
    <span onClick={() => { handleOpen("AddModal") }}>
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
  //table functions 
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


      {/* {the AddModal goes here} */}
      <Modal
        open={open === "AddModal"}
        onClose={handleClose}
        aria-labelledby="modal-modal-name"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-name" variant="h6" component="h2">
            Fill the form to add a new student
          </Typography>
          <form noValidate autoComplete='off'>
            <TextField label="name" value={studentToAdd.name} variant='standard' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToAdd({ 
                  name: e.target.value,
                  matricule: studentToAdd.matricule,
                  age: studentToAdd.age,
                  level: studentToAdd.level,
                  gender: studentToAdd.gender
                })
              }}
            />

            <TextField label="matricule" value={studentToAdd?.matricule}
              variant='standard' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToAdd({ 
                  name: studentToAdd.name,
                  matricule: e.target.value,
                  age: studentToAdd.age,
                  level: studentToAdd.level,
                  gender: studentToAdd.gender
                })
              }}
            />

            <TextField label="age" value={studentToAdd?.age}
              variant='standard' type='number' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToAdd({ 
                  name: studentToAdd.name,
                  matricule: studentToAdd.matricule,
                  age: parseInt(e.target.value),
                  level: studentToAdd.level,
                  gender: studentToAdd.gender
                })
              }}
            />

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "block", marginBottom: "30px" }}>
              <InputLabel id="demo-simple-select-standard-label">Level</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={studentToAdd.level}
                onChange={(e) => {
                  setStudentToAdd({ 
                    name: studentToAdd.name,
                    matricule: studentToAdd.matricule,
                    age: studentToAdd.age,
                    level: e.target.value,
                    gender: studentToAdd.gender,
                  })
                }}
                label="gender"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "block", marginBottom: "30px" }}>
              <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={studentToAdd.gender}
                onChange={(e) => {
                  setStudentToAdd({ 
                    name: studentToAdd.name,
                    matricule: studentToAdd.matricule,
                    age: studentToAdd.age,
                    level: studentToAdd.level,
                    gender: e.target.value,
                  })
                }}
                label="gender"
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ textAlign: "center", alignItems: "center" }}>
              <Button onClick={() => {
                handleAddRow()
              }} variant='contained' sx={{ marginRight: "10%" }}> Addstudent </Button>
              <Button variant='contained' onClick={() => { handleClose() }}>Cancel</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default DataTable