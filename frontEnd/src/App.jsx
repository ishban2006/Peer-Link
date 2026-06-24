import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Authentication from './pages/authentication';
import './App.css'
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <div className='App'>
        <AuthProvider>
          <Routes>
            <Route path='/home' element = {<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
          </Routes>
        </AuthProvider>
    </div>
  )
}

export default App