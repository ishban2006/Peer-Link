import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';

function LeftGrid() {
    return (
                <Grid
                    size={{ xs: 0, sm: 4, md: 7 }}
                    className="authLeft"
                >
                    <div className="leftOverlay">

                        <div className="brand">

                            <img src="/logo3.png" alt="PeerLink" />

                            <h1>PeerLink</h1>

                        </div>

                        <h2>
                            Connect. Collaborate.
                            <br />
                            Meet Instantly.
                        </h2>

                        <p>
                            Secure HD video meetings with screen sharing,
                            real-time chat and seamless collaboration.
                        </p>

                        <div className="features">

                            <div className="feature">
                                🎥 HD Video Meetings
                            </div>

                            <div className="feature">
                                🖥 Screen Sharing
                            </div>

                            <div className="feature">
                                💬 Live Chat
                            </div>

                            <div className="feature">
                                🔒 Secure Authentication
                            </div>

                        </div>

                    </div>
                </Grid>
    );
}

export default LeftGrid;