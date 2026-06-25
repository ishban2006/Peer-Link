import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar } from '@mui/material';

import '../styles/authentication.css'
import { AuthContext } from '../contexts/authContext';
import LeftGrid from '../components/leftGridAuth';

const defaultTheme = createTheme();

function Authentication() {

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formState, setFormState] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setError("");

        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }

        if (formState === 1 && !name) {
            setError("Please enter your name");
            return;
        }

        setLoading(true);

        try {
            if (formState === 1) {
                const res = await handleRegister(
                    name,
                    username,
                    password
                );

                setMessage(res);

                setName("");
                setUsername("");
                setPassword("");

                setOpen(true);

                // navigate("/home");
            }
            else {
                const res = await handleLogin(
                    username,
                    password
                );

                setMessage(res);
                setOpen(true);

                // navigate("/home");
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Something went wrong";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" className="authContainer">

                <CssBaseline />

                <LeftGrid />

                <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6} square>

                    <Box className="authBox">

                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: 'secondary.main'
                            }}
                        >
                            <LockOutlinedIcon />
                        </Avatar>

                        <div className="authToggle">
                            <Button fullWidth
                                variant={formState === 0 ? "contained" : "outlined"}
                                onClick={() => setFormState(0)}
                            >
                                Sign In
                            </Button>

                            <Button
                                fullWidth
                                variant={formState === 1 ? "contained" : "outlined"}
                                onClick={() => setFormState(1)}
                            >
                                Sign Up
                            </Button>
                        </div>

                        <Box component="form" noValidate className="authForm">
                            {formState === 1 && (
                                <TextField fullWidth margin="normal" label="Full Name" value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    } />
                            )}

                            <TextField fullWidth margin="normal" label="Username" value={username}
                                onChange={(e) => setUsername(e.target.value)} />

                            <TextField fullWidth margin="normal" label="Password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} />

                            {error && (
                                <p className='authError'>
                                    {error}
                                </p>
                            )}

                            <Button fullWidth disabled={loading} variant="contained" className="authButton"
                                onClick={handleAuth}>
                                    {
                                        loading ? "Please Wait..." : formState === 0
                                                 ? "Login" : "Register"
                                    }
                            </Button>

                        </Box>

                    </Box>
                </Grid>

            </Grid>

            <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
        </ThemeProvider>
    );
}

export default Authentication;