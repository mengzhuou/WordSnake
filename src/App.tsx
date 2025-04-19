import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import ClassicMode from "./components/WordSnake/ClassicMode";
import CountdownTimer from "./components/WordSnake/CountdownTimer";
import UnlimitedCountdownTimer from "./components/WordSnake/UnlimitedCountdownTimer";
import UnlimitedMode from "./components/WordSnake/UnlimitedMode";
import DefinitionMode from "./components/WordDefinition/DefinitionMode";
import FuncProps from "./components/WordSnake/FuncProps";
import NotFound from "./components/NotFound";
import WordCloud from "./components/WordCloud";
import FooterNav from "./components/FooterNav";

import React from "react";

class App extends React.Component<any,any>{
  render() {
    return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Menu/>}/>
            <Route path="/ClassicMode" element={<ClassicMode/>}/>
            <Route path="/UnlimitedMode" element={<UnlimitedMode/>}/>
            <Route path="/CountdownTimer" element={
              <CountdownTimer
                duration={60}
                onTimeUp={ ()=>console.log('Time is up!') }
              />
            }/>
            <Route path="/UnlimitedCountdownTimer" element={
              <UnlimitedCountdownTimer
                duration={10}
                wordLength={-1}
                onTimeUp={ ()=>console.log('Time is up!') }
                isTimerUpdated = {false}
              />
            }/>
            <Route path="/DefinitionMode" element={<DefinitionMode/>}/>
            <Route path="/FuncProps" element={<FuncProps/>}/>
            <Route path="/WordCloud" element={<WordCloud/>}/>
            <Route path="/FooterNav" element={<FooterNav/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
          <FooterNav />
        </div>
      </Router>
    );
  }
}
  
export default App;
