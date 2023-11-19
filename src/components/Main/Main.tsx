import { useNavigate } from 'react-router-dom';
import "./Main.css";
import wordSnakeImage from "../../components/Images/wordsnake.png"

  
function Main() {
  const navigate = useNavigate();
  const gotToFirstComp = () => {
  
    // This will navigate to first component
    navigate('/menu'); 
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={wordSnakeImage} alt="wordsname img" className='imgWS'/>
        <button className="WelcomePageButton" onClick={gotToFirstComp}>Sign Up </button>
      </header>
    </div>
  );
}
  
export default Main;