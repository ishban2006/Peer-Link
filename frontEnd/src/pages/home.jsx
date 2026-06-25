import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'

import '../styles/home.css'
import '../styles/navbar.css'
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/authContext';
import { Users } from "lucide-react";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;

    const code = meetingCode.trim();
    await addToUserHistory(code);
    navigate(`/${code}`);
    }

    return (
        <>
            <div className="navBar">

                <div>
                    <h2 className="logo">
                        <Users size={30} />
                        PeerLink
                    </h2>
                </div>

                <div className="navBarRight">
                    <p onClick={
                        () => {
                            navigate("/history")
                        }
                    }>History</p>

                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }}>
                        Logout
                    </Button>
                </div>

            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h1>Premium Video Meetings.</h1>
                        <p>
                        Create or join secure meetings instantly with crystal-clear
                        video, screen sharing and real-time chat.
                        </p>

                        <div className="joinBox">

                            <TextField label="Meeting Code" variant="outlined"
                                onChange={(e)=>setMeetingCode(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.key==="Enter"){
                                        handleJoinVideoCall();
                                    }
                                }}
                            />

                            <Button className="joinBtn" variant="contained"
                                onClick={handleJoinVideoCall}>
                                Join
                            </Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img src="logo3.png" alt="Video Meeting" />
                </div>
            </div>
        </>
    );
}


export default withAuth(HomeComponent)