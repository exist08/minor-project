import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar'
import Mainbar from './Components/Mainbar'
import Home from './pages/Home'
import Attendence from './pages/Attendence'
import MyGrades from './pages/MyGrades'
import Assignments from './pages/Assignments'
import Schedule from './pages/Schedule'
import StudyMaterial from './pages/StudyMaterial'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <div className="my-dashboard flex w-full h-screen text-white">
        <Sidebar />
        <Mainbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/attendence" element={<Attendence />} />
            <Route path="/my-grades" element={<MyGrades />} />
            <Route path="/class-schedule" element={<Schedule/>} />
            <Route path="/study-material" element={<StudyMaterial/>} />
            <Route path="/assignments" element={<Assignments />} />
          </Routes>
        </Mainbar>
      </div>
    </Router>
    </>
  )
}

export default App
