import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Authentication from './pages/authentication';
import VideoMeet from './pages/videoMeet';
import { AuthProvider } from './contexts/authContext';

import './App.css'

function App() {
  return (
    <div className='App'>
        <AuthProvider>
          <Routes>
            <Route path='/home' element = {<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/:url' element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
    </div>
  )
}

export default App