import { Button, TextField } from "@mui/material";
import '../styles/lobby.css'

export default function Lobby({
    username,
    setUsername,
    connect,
    localVideoref
}) {
    return (
        
        <div className="lobbyContainer">

            <div className="lobbyCard">

                <div className="lobbyLeft">

                    <h1>Ready to Join?</h1>

                    <p>
                        Check your camera and microphone before
                        entering the meeting.
                    </p>

                    <TextField
                        fullWidth
                        label="Display Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        className="joinMeetingBtn"
                        onClick={connect}
                    >
                        Join Meeting
                    </Button>

                </div>

                <div className="lobbyRight">

                    <div className="previewCard">

                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            playsInline
                        />

                        <div className="previewLabel">
                            Camera Preview
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}