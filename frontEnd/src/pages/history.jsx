import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import '../styles/history.css';

import { IconButton } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])

    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }
        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    }

    return (
        <div className="historyPage">

            <div className="historyNavbar">

                <div className="historyTitle">
                    Meeting History
                </div>

                <IconButton
                    className="homeBtn"
                    onClick={() => routeTo("/home")}
                >
                    <HomeIcon />
                </IconButton>

            </div>

            <div className="historyContainer">

                {meetings.length ? (

                    meetings.map((meeting, index) => (

                        <Card
                            key={index}
                            className="historyCard"
                            elevation={4}
                        >
                            <CardContent>

                                <Typography className="meetingCode">
                                    {meeting.meetingCode}
                                </Typography>

                                <Typography className="meetingDate">
                                    {formatDate(meeting.date)}
                                </Typography>

                                <Button
                                    variant="contained"
                                    className="joinAgainBtn"
                                    onClick={() => routeTo(`/${meeting.meetingCode}`)}
                                >
                                    Join Again
                                </Button>

                            </CardContent>

                        </Card>

                    ))

                ) : (

                    <div className="emptyHistory">

                        <h2>No Meetings Yet</h2>

                        <p>
                            Your previous meetings will appear here.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}