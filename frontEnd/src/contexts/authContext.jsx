import axios from 'axios';
import { createContext, useState } from "react";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8080/user"
});

export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);

    const handleRegister = async (name, username, password) => {
        try {
            const request = await client.post('/register', {
                name,
                username,
                password
            });

            if (request.status === 201) {
                localStorage.setItem("token", request.data.token);
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const request = await client.post('/login', {
                username,
                password
            });

            if (request.status === 200) {
                localStorage.setItem("token", request.data.token);
                return "Login Successful";
            }
        } catch (err) {
            throw err;
        }
    };

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};