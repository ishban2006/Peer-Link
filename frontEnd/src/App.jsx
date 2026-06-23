import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import './App.css'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/home' element = {<LandingPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
