import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Structure from './Structure'



function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Structure/>}  />
        </Routes>

    </BrowserRouter>
  )
}

export default App
