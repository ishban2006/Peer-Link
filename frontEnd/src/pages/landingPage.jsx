import '../App.css'
import Navbar from '../components/navbar';
import LandingMainContainer from '../components/landingContainer'

function LandingPage() {
  return (
    <div className="landingPageContainer">
      <Navbar />
      <LandingMainContainer />
    </div>
  );
}

export default LandingPage