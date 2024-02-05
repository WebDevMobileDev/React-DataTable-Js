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
import { Block } from '@mui/icons-material';

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
  const [studentToEdit, setStudentToEdit] = useState({ id: 0, name: "", matricule: "", level: 1, gender: "male", age: 15 });
  const [currentID, setCurrentId] = useState(0);
  const [open, setOpen] = useState('false');
  const [query, setQuery] = useState("")

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


  //function to delete and to edit a row of data 
  const onDeleteClick = (id) => {
    setCurrentId(id);
    console.log("deleting row with id: ", id)
    handleOpen("DeleteModal");
  }

  const onEditClick = (id) => {
    console.log(studentToEdit)
    setCurrentId(id);
    handleOpen("EditModal");
  }

  const handleEditRow = async (id) => {
    await fetch('http://localhost:8000/students/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: studentToEdit.name,
        matricule: studentToEdit.matricule,
        age: studentToEdit.age,
        dateOfBirth: studentToEdit.dateOfBirth,
        level: studentToEdit.level,
        gender: studentToEdit.gender,
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      console.log(data)
      alert("successsful")
      location.reload()
    }).catch(err => {
      console.log(err)
    })
  }

  const handleDeleteRow = async (id) => {
    const response = await fetch('http://localhost:8000/students/' + id, {
      method: "DELETE"
    });
    if (response.ok) {
      alert("student deleted");
      handleClose(); //close the modal 
      location.reload()
    } else {
      alert("could not delete student")
      handleClose()
    }
  }
  //adding a row
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

  const iconClicked = (e) => {
    const elmtId = (e.target);
    let parentId;
    let callback;

    if (elmtId.tagName === 'path') {
      parentId = elmtId.parentElement?.parentElement?.parentElement?.getAttribute("data-id")
      if (elmtId.parentElement?.getAttribute("data-testid") === "DeleteOutlineIcon") {
        callback = onDeleteClick
      } else {
        callback = onEditClick
      }
    } else if (elmtId.tagName === 'svg') {
      parentId = elmtId.parentElement?.parentElement?.getAttribute("data-id")
      if (elmtId.getAttribute("data-testid") === "DeleteOutlineIcon") {
        callback = onDeleteClick
      } else {
        callback = onEditClick
      }
    }

    if (parentId && callback) {
      const id = parentId;
      console.log("this is the id", id)
      let foundStudent
      students.forEach(student => {
        if (student.id == id) {
          foundStudent = student
        }
      })
      setStudentToEdit(foundStudent ? foundStudent : studentToEdit)
      callback(id)
    }
  }
  const createBodyTr = (student) => {
    return (
      <tr key={student.id} data-id={student.id}>
        <td><span>{student.id}</span></td>
        <td><span>{student.name}</span></td>
        <td><span>{student.matricule}</span></td>
        <td><span>{student.age}</span></td>
        <td><span>{student.gender}</span></td>
        <td><span>{student.level}</span></td>
        <td className='icon-td' onClick={(e) => {
          iconClicked(e)
        }
        }>
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
          {students && students.filter((student) => {
            if (student.name.toLowerCase().includes(query) || student.matricule.toLowerCase().includes(query))
              return student
          }).map(student => (
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

      {/* {the EditModal goes here} */}
      <Modal
        open={open === "EditModal"}
        onClose={handleClose}
        aria-labelledby="modal-modal-name"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-name" variant="h6" component="h2">
            Fill the form to edit the student record {currentID}
          </Typography>

          <form noValidate autoComplete='off'>
            <TextField label="name" value={studentToEdit?.name}
              variant='standard' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToEdit({
                  name: e.target.value,
                  matricule: studentToEdit.matricule,
                  age: studentToEdit.age,
                  level: studentToEdit.level,
                  gender: studentToEdit.gender
                })
              }}
            />

            <TextField label="matricule" value={studentToEdit?.matricule}
              variant='standard' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToEdit({
                  name: studentToEdit.name,
                  matricule: e.target.value,
                  age: studentToEdit.age,
                  level: studentToEdit.level,
                  gender: studentToEdit.gender
                })
              }}
            />

            <TextField label="age" value={studentToEdit?.age}
              variant='standard' type='number' sx={{ marginBottom: "10px", display: "block" }}
              onChange={(e) => {
                setStudentToEdit({
                  name: studentToEdit.name,
                  matricule: studentToEdit.matricule,
                  age: e.target.value,
                  level: studentToEdit.level,
                  gender: studentToEdit.gender,
                  dateOfBirth: studentToEdit.dateOfBirth
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
                    name: studentToEdit.name,
                    matricule: studentToEdit.matricule,
                    age: studentToEdit.age,
                    level: e.target.value,
                    gender: studentToEdit.gender,
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
                value={studentToEdit.gender}
                onChange={(e) => {
                  setStudentToEdit({
                    name: studentToEdit.name,
                    matricule: studentToEdit.matricule,
                    age: studentToEdit.age,
                    level: studentToEdit.level,
                    gender: e.target.value
                  })
                }}
                label="Age"
              >
                <MenuItem value={"male"}>male</MenuItem>
                <MenuItem value={"female"}>female</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ textAlign: "center", alignItems: "center" }}>
              <Button onClick={() => {
                handleEditRow(currentID)
              }} variant='contained' sx={{ marginRight: "10%" }}> save changes </Button>
              <Button variant='contained' onClick={() => { handleClose() }}>Cancel</Button>
            </Box>
          </form>

        </Box>
      </Modal>
      {/* {the DeleteModal goes here} */}
      <Modal
        open={open === "DeleteModal"}
        onClose={handleClose}
        aria-labelledby="modal-modal-name"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-name" variant="h6" component="h2" gutterBottom>
            Are you sure you want to remove this student
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button variant='contained'
              sx={{ marginRight: "30%" }}
              onClick={() => {
                handleDeleteRow(currentID)
              }}
            > Yes </Button>
            <Button variant='contained'
              onClick={() => {
                handleClose();
              }}
            > no </Button>
          </Box>
        </Box>
      </Modal>

    </div>
  )
}

export default DataTable