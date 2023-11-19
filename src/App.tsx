import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import First from "./components/Signup/Signup";
import Second from "./components/Login/Login";
import Menu from "./components/Menu/Menu";
import Main from "./components/Main/Main";
import ClassicMode from "./components/WordSnake/ClassicMode";
import CountdownTimer from "./components/WordSnake/CountdownTimer";
import GameoverBoard from "./components/WordSnake/GameoverBoard";
import UnlimitedGameoverBoard from "./components/WordSnake/UnlimitedGameoverBoard";
import UnlimitedResultListFunc from "./components/WordSnake/UnlimitedResultListFunc";
import UnlimitedCountdownTimer from "./components/WordSnake/UnlimitedCountdownTimer";
import UnlimitedMode from "./components/WordSnake/UnlimitedMode";
import ResultListFunc from "./components/WordSnake/ResultListFunc";
import DefinitionMode from "./components/WordDefinition/DefinitionMode";

import React from "react";

class App extends React.Component<any,any>{
  constructor(props:any){
    super(props);
    this.state = {EventID: -1, arr:[]};
    this.getEventID = this.getEventID.bind(this);
    this.setEventID = this.setEventID.bind(this);
    this.setarr = this.setarr.bind(this);
    this.getarr = this.getarr.bind(this);

  }
  setEventID(id:number){
    this.setState({EventID: id});
  }
  getEventID(){
    return this.state.EventID;
  }

  setarr(arr:any[]){
    let tmp:any[] = [];
    for(let i in arr){
      tmp.push(arr[i]);
    }
    this.setState({arr:tmp});
  }
  getarr(){
    return this.state.arr;
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/first" element={<First />}/>
          <Route path="/second" element={<Second />}/>
          <Route path="/" element={<Main/>}/>
          <Route path="/Menu" element={<Menu/>}/>
          <Route path="/ClassicMode" element={<ClassicMode/>}/>
          <Route path="/GameoverBoard" element={<GameoverBoard/>}/>
          <Route path="/UnlimitedGameoverBoard" element={<UnlimitedGameoverBoard/>}/>
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
              onTimeUp={ ()=>console.log('Time is up!') }
              isTimerUpdated = {false}
            />
          }/>
          <Route path="/ResultListFunc" element={<ResultListFunc
              wordList={this.props.wordList}
          />}/>

          <Route path="/UnlimitedResultListFunc" element={<UnlimitedResultListFunc
              wordList={this.props.wordList}
          />}/>
          
          <Route path="/DefinitionMode" element={<DefinitionMode/>}/>
        </Routes>
      </Router>
    );
  }
}
  
export default App;
