import { useState } from 'react' 
import './App.css'
import DataTable from './components/DataTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <DataTable/>
      </div>
    </>
  )
}

export default App
