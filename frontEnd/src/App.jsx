import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Authentication from './pages/authentication';
import HomeComponent from './pages/home';
import VideoMeet from './pages/videoMeet';
import History from './pages/history';
import { AuthProvider } from './contexts/authContext';

import './App.css'

function App() {
  return (
    <div className='App'>
        <AuthProvider>
          <Routes>
            <Route path='/' element = {<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/home' element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
            <Route path='/:url' element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
    </div>
  )
}

export default App