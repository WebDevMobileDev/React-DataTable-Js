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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './table.css'
import { Block } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

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

  const columns = [
    { key: "id", component: "Id" },
    { key: "name", component: "Name" },
    { key: "matricule", component: "Matricule" },
    { key: "age", component: "Age" },
    { key: "gender", component: "Gender" },
    { key: "level", component: "Level" }
  ]

  const adjustedColumns = [...columns, { key: "actions", component: " " }];

  const colsToDisplay = adjustedColumns.map((col) => {
    return { ...col, selected: true }
  })

  //states-------------------------------------------------------
  const [students, setStudents] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState({ name: "", matricule: "", level: 1, gender: "male", age: 15 });
  const [studentToEdit, setStudentToEdit] = useState({ id: 0, name: "", matricule: "", level: 1, gender: "male", age: 15 });
  const [currentID, setCurrentId] = useState(0);
  const [open, setOpen] = useState('false');
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState({ key: "id", order: 'asc' });
  const [pageIndex, setPageIndex] = useState(1);
  const [numOfRecords, setNumOfRecords] = useState(5);
  const [dataLength, setDataLength] = useState(1)
  const [searchedData, setSearchedData] = useState([])

  const handleOpen = (value) => setOpen(value);
  const handleClose = () => setOpen('false');


  const [tableColumns, setTableColumns] = useState(colsToDisplay) //selected and non-selected columns
  const [tableColumnsDisplaying, setTableColumnsDisplaying] = useState(colsToDisplay) //keep track of selected cols 



  //states for the column menu 
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };



  const setNewTableColumnsDisplaying = (cols) => {
    setTableColumnsDisplaying(cols.filter(col => { return col.selected === true }))
  }
  //function that removes all the columns with select field of false so that in the createHeader and createTr we don't get these columns 
  const handleChangeColCheckbox = (event) => {

    console.log(event.target);
    console.log(tableColumns);
    const newTableColumns = tableColumns.map(col => {
      return col.key == event.target.name ? { ...col, selected: !col.selected } : col
    })
    //setting the table columns to keep keeping track of the selected and non selected rows
    setTableColumns(newTableColumns)
    setNewTableColumnsDisplaying(newTableColumns)

  };

  // handling resizing of the table 
  useEffect(() => {
    window.onload = function () {
      const resizableColumns = document.querySelectorAll('th, td');

      let startX;
      let startWidth;

      resizableColumns.forEach(column => {
        column.addEventListener('mousemove', function (event) {
          const rect = this.getBoundingClientRect();
          const offset = 8; // Adjust this value as needed

          // if (event.pageX < rect.left + offset || event.pageX > rect.right - offset) {
          if (event.pageX > rect.right - offset) {
            this.style.cursor = 'col-resize';
          } else {
            this.style.cursor = 'auto';
          }
        });

        column.addEventListener('mousedown', function (event) {
          const rect = this.getBoundingClientRect();
          const offset = 8; // Adjust this value as needed

          if (event.pageX > rect.right - offset) {
            startX = event.pageX;
            startWidth = this.offsetWidth;
            const columnToResize = this;

            function cellResize(event) {
              const width = startWidth + (event.pageX - startX);
              columnToResize.style.width = width + 'px';
            }

            document.addEventListener('mousemove', cellResize);

            document.addEventListener('mouseup', function removeEventListener() {
              document.removeEventListener('mousemove', cellResize);
              document.removeEventListener('mouseup', removeEventListener);
            });
          }
        });
      });
    };
  })


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
  }, [query])


  //function to delete and to edit a row of data------------------
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
    fetch('http://localhost:8000/students/' + id, {
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
      handleClose()
      let s = students.find(student => student.id === data.id)
      console.log(s)
      let i = students.indexOf(s);
      students.splice(i, 1, data);
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


  //custom components---------------------------------------------
  const AddButton = (
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

  const sortButton = (
    <span onClick={() => handleOpen("SortModal")}><FilterListIcon /></span>
  )

  const columnView = (
    <div>
      <Button
        id="basic-button"
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleClickMenu}
        sx={{ color: "white" }}
      >
        <ViewColumnIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <FormGroup>
            {tableColumns.map(col => (
              <FormControlLabel
                key={col.key}
                label={col.key}
                control={
                  <Checkbox checked={col.selected} name={col.key} onChange={handleChangeColCheckbox} />
                } />
            ))
            }
          </FormGroup>
        </MenuItem>
        {/* <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem> */}
      </Menu>
    </div>
  )



  //table functions-----------------------------------------------

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

  const searchFunction = (dataList, query) => {
    return dataList.filter((student) => {
      if (student.name.toLowerCase().includes(query) || student.matricule.toLowerCase().includes(query))
        return student
    })
  }

  useEffect(() => {
    setSearchedData(searchFunction(students, query))
    setDataLength(searchedData.length) 
  }, [students, query])

  const SortByKey = (array) => {
    switch (sortKey.order) {
      case "asc":
        return array.sort((a, b) => {
          if (sortKey.key === 'name' || sortKey.key === "matricule" || sortKey.key === "gender") {
            return a[sortKey.key].localeCompare(b[sortKey.key]);
          }
          else if (sortKey.key === "id") {
            return a.id - b.id;
          }
          else if (sortKey.key === "age") {
            return a.age - b.age;
          } else {
            return a.level - b.level
          }
        });
      case "dsc":
        return array.sort((a, b) => {
          if (sortKey.key === 'name' || sortKey.key === "matricule" || sortKey.key === "gender") {
            return b[sortKey.key].localeCompare(a[sortKey.key]);
          }
          else if (sortKey.key === "id") {
            return b.id - a.id;
          }
          else if (sortKey.key === "age") {
            return b.age - a.age;
          } else {
            return b.level - a.level
          }
        });
    }
  }

  //function for pagination---------------------------------------
  const paginate = (dataList) => {
    return dataList.slice((pageIndex - 1) * numOfRecords, ((pageIndex - 1) * numOfRecords) + numOfRecords)
  }

  //rendering functions-------------------------------------------
  const createBodyTr = (student) => {
    let List = [];
    tableColumnsDisplaying.forEach(({ key, component }, index) => {
      if (key === "actions") {
        List.push(<td key={index} className='icon-td' onClick={(e) => { iconClicked(e) }}>
          {<EditIcon className='noLink' sx={iconStyles} />}
          {<DeleteOutlineIcon className='noLink' sx={iconStyles} />}
        </td>)
      } else {
        List.push(<td key={index}><span>{student[key]}</span></td>)
      }

      // return (
      //   <tr key={student.id} data-id={student.id}>
      //     <td><span>{student.id}</span></td>
      //     <td><span>{student.name}</span></td>
      //     <td><span>{student.matricule}</span></td>
      //     <td><span>{student.age}</span></td>
      //     <td><span>{student.gender}</span></td>
      //     <td><span>{student.level}</span></td>
      //     <td className='icon-td' onClick={(e) => {
      //       iconClicked(e)
      //     }
      //     }>
      //       {<EditIcon sx={iconStyles} />}
      //       {<DeleteOutlineIcon sx={iconStyles} />}
      //     </td>
      //   </tr>)
    })
    return <tr key={student["id"]} data-id={student["id"]}>{List}</tr>
  }


  const createTableFooterRow = () => {
    return (
      <div  className='footer-div'> 
        <span>
            <span style={{ border: "1px solid black", borderRadius: "5px", padding: "8px" }}>{`page ${pageIndex} of ${Math.ceil(dataLength / numOfRecords)}`}</span>
          </span>

        <span>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "inline", marginBottom: "30px" }}>
              {/* <InputLabel id="demo-simple-select-standard-label">{"rows"}</InputLabel> */}
              <span>rows: </span>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={numOfRecords.toString()}
                onChange={(e) => {
                  setNumOfRecords(parseInt(e.target.value))
                }}
                label="rows"
              >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
        </span>

        <span>
          <span className='paginate-span' onClick={() => {
            setPageIndex(1)
          }}>
            <KeyboardDoubleArrowLeftIcon />
          </span>
          <span className='paginate-span' onClick={() => {
            pageIndex === 1 ? setPageIndex(1) : (setPageIndex(pageIndex - 1));
          }}>
            <KeyboardArrowLeftIcon />
          </span>
          <span className='paginate-span' onClick={() => {
            pageIndex === Math.ceil(dataLength / numOfRecords) ? setPageIndex(Math.ceil(dataLength / numOfRecords)) : (setPageIndex(pageIndex + 1));
          }}>
            <KeyboardArrowRightIcon />
          </span>
          <span className='paginate-span' onClick={() => {
            setPageIndex(Math.ceil(dataLength / numOfRecords))
          }}>
            <KeyboardDoubleArrowRightIcon />
          </span>
        </span>
      </div>
    )
  }

  const createTableHeaderComponentsRow = () => {
    return (
      <div className='header-div'>
        {columnView}
        {<span style={{ padding: "0px 5px" }}>{sortButton}</span>}
        {<span>{AddButton}</span>}
        {<span>{SearchBar}</span>}
      </div>
    )
  }

  const createHeaderTr = (column) => {
    return <th key={column.key}>
      {column.key}
    </th>
  }

  return (
    <div className='main'>
      <section className='header-section'>
        {createTableHeaderComponentsRow()}
      </section>
      <section className='outer-wrapper'>
        <div className='scroll-wrapper'>
          <table>
            <thead>
              <tr>
                {tableColumnsDisplaying.map((column) => (
                  createHeaderTr(column)
                ))}
              </tr>
            </thead>
            <tbody>
              {students && paginate(SortByKey(searchedData)).map(student => (
                createBodyTr(student)
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className='footer-section'>
        {createTableFooterRow()}
      </section>


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
      {/* the sorting modal goes here */}
      <Modal
        open={open === "SortModal"}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sort by:
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "name", order: sortKey.order })
                    handleClose()
                  }}>
                    <ListItemText primary="Name" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "matricule", order: sortKey.order })
                    handleClose()
                  }}>
                    <ListItemText primary="Matricule" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
            <Divider />
            <nav aria-label="secondary mailbox folders">
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "age", order: sortKey.order })
                    handleClose()
                  }}>
                    <ListItemText primary="Age" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "level", order: sortKey.order })
                    handleClose()
                  }}>
                    <ListItemText primary="Level" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "gender", order: sortKey.order })
                    handleClose()
                  }}>
                    <ListItemText primary="Gender" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
            <Divider />
            <nav aria-label="tetiary mailbox folders">
              <List>
                <ListItem disablePadding>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "block" }}>
                    <span style={{ marginRight: "8px" }}>Order:</span>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={sortKey.order}
                      onChange={(e) => {
                        let oldKey = sortKey.key
                        setSortKey({ key: oldKey, order: e.target.value })
                      }}
                      label="Age"
                    >
                      <MenuItem value={"asc"}>asc</MenuItem>
                      <MenuItem value={"dsc"}>dsc</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    setSortKey({ key: "id", order: "asc" })
                    handleClose()
                  }}>
                    <ListItemText primary="Disable" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default DataTable