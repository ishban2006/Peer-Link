import '../App.css'
import '../styles/navbar.css'
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <>
            <nav>
                <div className='navHeader'>
                    <h2 className="logo">
                        <Users size={30} />
                        PeerLink
                    </h2>
                </div>

                <div className="navlist">
                    <p className="navlistText"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/guest");
                        }}
                    >
                        Join as Guest
                    </p> 

                    <p className="navlistText"
                        onClick={() => navigate("/auth")}
                    >
                        Register
                    </p>

                    <div role="button" className="loginBtn"
                        onClick={() => navigate("/auth")}    
                    >
                        <p>Login</p>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;