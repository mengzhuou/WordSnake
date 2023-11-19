import "./GameoverBoard.css";

import { withFuncProps } from "../withFuncProps";
import { collection, onSnapshot, DocumentData, addDoc } from 'firebase/firestore';
import db from "./firebase";
import React from "react";

class UnlimitedGameoverBoard extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            wordList: this.props.wordList,
            leaderBoardList: [],
        };
        this.menuNav = this.menuNav.bind(this);
    }


    reStart = () => {
        this.props.navigate("/UnlimitedMode")
    }

    menuNav = () => {
        this.props.navigate("/")
    }

    leaderBoard = async () => {
          onSnapshot(collection(db, "Leaderboard"), (snapshot) => {
            const sortedLeaderboard = snapshot.docs
            .map((doc) => doc.data() as DocumentData)
            .sort((a, b) => a.Score - b.Score);
            
            this.setState({ leaderBoardList: sortedLeaderboard });
          });
    };
    
    componentDidMount(): void {
        this.leaderBoard();
    }

    handleNewRecord = async (timerVal: number) => {
        const name = prompt(`(Want to save your score <${this.state.timerRecord} seconds> to the Leaderboard?) Enter your name.`);
        if (name !== null){
          const collectionRef = collection(db, "Leaderboard");
          const payload = {Name: name, Score: timerVal};
          await addDoc(collectionRef, payload);
          this.setState({ canbeSaved: false }); // record is already saved
        }
      };
    render() {
        const { wordList, leaderBoardList } = this.state;
        const sortedWords = [...wordList].sort();
        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.reStart}>Restart</button>
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>
                <p className="goTitle">Unlimited Mode Game Over</p>
                <p className="scoreStyle">Your Score: {wordList.length}</p>

                <h1 className="leaderBoardTitle">Leader Board</h1>
                <div className="leaderBoard">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderBoardList.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item[0]}</td>
                                    <td>{item[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="wordListStyle">
                    {Array.isArray(sortedWords) && sortedWords.map((word: string, index: number) => (
                        <li key={index}>{word}</li>
                    ))}
                </div>
            </div>
        );
    }
}


export default withFuncProps(UnlimitedGameoverBoard);