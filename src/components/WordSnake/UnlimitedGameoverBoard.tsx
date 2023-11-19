import "./GameoverBoard.css";

import { withFuncProps } from "../withFuncProps";
import { logout, updateUnlimitedBestScore, getUnlimitedLeaderBoard } from '../../helpers/connector';
import React from "react";

class UnlimitedGameoverBoard extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            bestScore: -1,
            wordList: this.props.wordList,
            leaderBoardList: [],
        };
        this.menuNav = this.menuNav.bind(this);
        this.bestScore = this.bestScore.bind(this);
    }


    reStart = () => {
        this.props.navigate("/UnlimitedMode")
    }

    menuNav = () => {
        this.props.navigate("/menu")
    }

    pagelogout = () => {
        logout().then(() => {
            this.props.navigate("/")
        }).catch(() => (alert("logout error")));
    }

    bestScore = async() => {
        const { wordList } = this.state;

        updateUnlimitedBestScore(wordList.length).then((response) => {
            this.setState({ bestScore: response })
        })
        .catch((error) => {
            console.log("Error when fetching data.")
        });
    }

    leaderBoard = async () => {
        getUnlimitedLeaderBoard()
          .then((response) => {
            this.setState({ leaderBoardList: response });
          })
          .catch((error) => {
            console.log("Error loading leaderboard data.");
          });
    };
    
    componentDidMount(): void {
        this.bestScore();
        this.leaderBoard();

        let counter = 0;
        const maxUpdates = 2; 
        this.componentDidUpdate = (prevProps: Readonly<any>, prevState: Readonly<any>) => {
            if (prevState.leaderBoardList !== this.state.leaderBoardList && counter < maxUpdates) {
                this.leaderBoard();
                counter++;
            }
        }
    }
    render() {
        const { wordList, bestScore, leaderBoardList } = this.state;
        const sortedWords = [...wordList].sort();
        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.reStart}>Restart</button>
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                    <button className="topnavButton" onClick={this.pagelogout}>Logout</button>
                </div>
                <p className="goTitle">Unlimited Mode Game Over</p>
                <p className="scoreStyle">Your Score: {wordList.length}</p>
                <p className="scoreStyle">Your Best Score: {bestScore}</p>

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