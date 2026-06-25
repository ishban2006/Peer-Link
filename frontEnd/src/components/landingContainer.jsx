import '../App.css'
import '../styles/landingContainer.css'
import { Link } from "react-router-dom";

export default function LandingMainContainer() {
    return (
        <>
            <div className="landingMainContainer">
                <div>
                    <h1><b><span>Connect</span> with your loved Ones</b></h1>

                    <p>Cover distance by PeerLink</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>

                <div>
                    <img src="/mobile.png" alt="" />
                </div>
            </div>
        </>
    );
}