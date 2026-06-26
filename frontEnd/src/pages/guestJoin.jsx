import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/guestJoin.css";

export default function GuestJoin() {
    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");

    const createMeeting = () => {
        const code = Math.random().toString(36).substring(2, 10);
        navigate(`/${code}`);
    };

    const joinMeeting = () => {
        if (!meetingCode.trim()) {
            alert("Please enter a meeting code.");
            return;
        }
        navigate(`/${meetingCode.trim()}`);
    };

    return (
        <div className="guestContainer">

            <div className="guestCard">

                <h1>Join a Meeting</h1>

                <p className="guestSubtitle">
                Create a new meeting or join an existing one using a meeting code.
                </p>

                <Button variant="contained" fullWidth
                    onClick={createMeeting}>
                    Create New Meeting
                </Button>

                <p className="divider">OR</p>

                <TextField fullWidth label="Meeting Code" value={meetingCode}
                    onChange={(e)=>setMeetingCode(e.target.value)}
                />

                <Button sx={{marginTop:2}} fullWidth variant="outlined"
                    disabled={!meetingCode.trim()} onClick={joinMeeting}>
                    Join Meeting
                </Button>

            </div>
        </div>
    );
}