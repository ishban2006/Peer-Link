import '../App.css'
import './navbar.css'
import { Users } from "lucide-react";

function Navbar() {
    return (
        <>
            <nav>
                <div className='navHeader'>
                    <h2 className="logo">
                        <Users size={30} />
                        PeerLink
                    </h2>
                </div>

                <div className='navlist'>
                    <p onClick={() => {router("/aljk23")}} className='navlistText'>
                        Join as Guest
                    </p>

                    <p onClick={() => {router("/auth")}} className='navlistText'>
                        Register
                    </p>

                    <div onClick={() => {router("/auth")}} role='button' className='loginBtn'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;