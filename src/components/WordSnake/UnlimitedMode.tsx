import "./ClassicMode.css";

import { withFuncProps } from "../withFuncProps";
import { getLetterFromPreviousWord, getRandomStart } from './FuncProps'; 
import { TextField, FormHelperText } from "@mui/material";
import React, { Component } from 'react';
import UnlimitedCountdownTimer from "./UnlimitedCountdownTimer";
import { collection, onSnapshot, DocumentData, addDoc } from 'firebase/firestore';
import db from "./firebase";


interface UnlimitedModeState {
    isGameStarted: boolean;
    ForceUpdateNow: boolean;
    isGameOver: boolean;
    showWords: boolean;
    isTimerUpdated: boolean;
    canbeSaved: boolean;
    showRanking: boolean;
    lastWord: string;
    lastLetter: string;
    firstWord: string;
    inputValue: string;
    storedInputValue: string;
    inputValidString: string;
    errMessage: string;
    timeLeft: number;
    wordList: string[];
    history: string[];
    leaderBoardList: DocumentData[];
  }
  

class UnlimitedMode extends Component<any, UnlimitedModeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isGameStarted: false,
            ForceUpdateNow: false, 
            isGameOver: false, showWords: true, 
            isTimerUpdated: false,
            canbeSaved: false,
            showRanking: false,
            lastWord:"", lastLetter: "", firstWord: "", 
            inputValue: '',
            storedInputValue: '', inputValidString: '',
            errMessage: '', 
            timeLeft: 10, wordList: [], history: [], 
            leaderBoardList: [],
        };
        this.menuNav = this.menuNav.bind(this);
    }

    forceup = async (inputValue: string) => {
        if (this.state.wordList.includes(inputValue)) {
            this.setState({ errMessage: 'The word already exist. Please type another word.', inputValue: "", storedInputValue: "" })
        } else {
            const lastWord = this.state.wordList[this.state.wordList.length - 1]
            const lastLetter = lastWord[lastWord.length - 1]

            const isWordExist = await this.checkWordExist(inputValue);
            if (isWordExist){
                if (inputValue[0] === lastLetter) {
                    const words = await getLetterFromPreviousWord(inputValue);
                    let wordList = this.state.wordList.concat(inputValue);
                    this.setState({
                        lastWord: lastWord,
                        errMessage: '',
                        firstWord: words,
                        ForceUpdateNow: false,
                        wordList: wordList,
                        timeLeft: this.state.timeLeft,
                        isTimerUpdated: true
                    });
    
                    let hisArr = this.state.history.concat(inputValue);
                    
                    this.setState({history: hisArr, lastLetter: lastLetter})
                } else {
                    this.setState({ isTimerUpdated: false, errMessage: `The word must start with '${lastLetter}'`,  inputValue: "", storedInputValue: "" })
                }
            } else{
                this.setState({ errMessage: 'The word does not exist. Please enter a valid word.', inputValue: "", storedInputValue: "" });
            }
        }
    };

    checkWordExist = async (word: string): Promise<boolean> => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            return response.ok;
        } catch (error) {
            console.error('Error checking word existence:', error);
            return false;
        }
    };

    handleEndGame = () => {
        this.updateGameState(false, true)
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputString = event.target.value;
        if (
            inputString.startsWith('-') || 
            inputString.startsWith('\''))
        {
            this.setState({ 
                errMessage: 'Apostrophes and/or hyphens cannot be used in the beginning of a word.' 
            });
        } 
        else if (inputString === "") {
            this.setState({
                inputValue: "",
                errMessage: ""
            });
        } else {
            const isValid = /^[a-zA-Z'-]*$/.test(inputString);

            if (isValid) {
                this.setState({
                    inputValue: inputString,
                    errMessage: ""
                });
            } else {
                this.setState({ errMessage: 'Special character(s) or number(s) are not accepted (except apostrophes, hyphens).' })
            }
        }
    }

    handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const { inputValue } = this.state;
            if (inputValue.endsWith('\'') || inputValue.endsWith('-')) {
                this.setState({ 
                    errMessage: 'Apostrophes and/or hyphens cannot be used in the ending of a word.' 
                });
            } else {
                this.storeInputValue(this.state.inputValue).then(() => {
                    this.setState({ inputValue: "" });
                });
            }
        }
    }

    storeInputValue = async (inputValue: string) => {
        try {
            if (inputValue !== this.state.storedInputValue) {
                const lowerInput = inputValue.toLowerCase();
                this.setState({ storedInputValue: lowerInput, ForceUpdateNow: true })
                this.forceup(lowerInput);
            }
        } catch (error) {
            console.error(error)
        }
    }

    reStart = () => {
        window.location.reload();
    }

    menuNav = () => {
        this.props.navigate("/")
    }

    updateGameState = async (isGameStarted: boolean, isGameOver: boolean) => {
        if (isGameStarted) {
            const fWord = await getRandomStart();
            this.setState({ 
                isGameStarted: true, isGameOver: false, canbeSaved: false,
                wordList: this.state.wordList.concat(fWord), 
                firstWord: fWord, 
                lastLetter: fWord,
                history: []
            });
        }

        if (isGameOver) {
            const sortedWords = [...this.state.history].sort();
            this.setState({ 
                isGameStarted: false, 
                isGameOver: true, 
                canbeSaved: true,
                wordList: [], 
                history: sortedWords,
                errMessage: "" 
            })
            //call leaderboard
        }
    }

    componentDidMount() {
        onSnapshot(collection(db, "UnlimitedModeRank"), (snapshot) => {
            const sortedLeaderboard = snapshot.docs
            .map((doc) => doc.data() as DocumentData)
            .sort((a, b) => b.Score - a.Score);
            
            this.setState({ leaderBoardList: sortedLeaderboard });
        });
    }

    //since game over is true, player can save record
    handleGameOverLogic() {
        this.setState({ canbeSaved: true });
    }

    handleNewRecord = async (timerVal: number) => {
        const name = prompt(`(Want to save your score <${this.state.history.length} words> to the Leaderboard?) Enter your name.`);
        if (name !== null){
            const isNameValid = name.length === 0 || name.length >= 20;
            if (isNameValid){
                alert(`Please make sure: 0 < length of name < 20.`);
            } else{
                const collectionRef = collection(db, "UnlimitedModeRank");
                const payload = {Name: name, Score: timerVal};
                await addDoc(collectionRef, payload);
                this.setState({ canbeSaved: false }); // record is already saved
            }
        }
    };
    

    handleShowWords = () => {
        this.setState({
            showWords: !this.state.showWords
        })
    }

    componentDidUpdate(){
        if (this.state.isTimerUpdated === true) {
            this.setState({isTimerUpdated: false});
        }
    }

    toggleRanking = () => {
        this.setState((prevState: any) => ({
          showRanking: !prevState.showRanking,
        }));
    };

    toggleSavedRecord = () => {
        this.handleNewRecord(this.state.history.length);
    };

    render() {
        const { firstWord, inputValue, wordList, errMessage, 
            isGameStarted, showWords, canbeSaved,
            timeLeft, isTimerUpdated, showRanking, leaderBoardList,
            isGameOver, history
        } = this.state;
        const wordListWithoutFirst = wordList.slice(1);
        const sortedWords = [...wordListWithoutFirst].sort();

        const countdownTimer = (
            <UnlimitedCountdownTimer
              duration={timeLeft}
              onTimeUp={this.handleEndGame}
              isTimerUpdated ={isTimerUpdated}
            />
          );

        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.reStart} hidden={isGameStarted ? false : true}>Restart</button>
                    <button className="topnavButton" onClick={this.handleShowWords}>{showWords ? 'Hide Words' : 'Show Words'}</button>
                    <button className="topnavButton" onClick={this.toggleRanking}>Rank</button>
                    <button className="topnavButton" onClick={this.toggleSavedRecord} hidden={!canbeSaved}>Save Score </button>
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>
            
                <h1 className="wsTitle">Unlimited Word Snake</h1>
                {isGameStarted? (
                    countdownTimer
                ) : (
                    <button className="topnavButton" onClick={() => this.updateGameState(true, false)} hidden={isGameStarted ? true : false}>Start Game</button>
                )}

                <div>
                    <TextField
                        label={`Enter a word starts with '${firstWord}'`}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleEnterKeyDown}
                        style={{
                            display: isGameStarted ? 'block' : 'none',
                        }}
                    />
                </div>
                <div>
                    <FormHelperText style={{ color: 'red' }}>
                        {errMessage}
                    </FormHelperText>
                </div>

                {showWords && sortedWords.length > 0 && (
                    <div className="container">
                        {sortedWords.map((word: string, index: number) => (
                            <li key={index}>{word}</li>
                        ))}
                    </div>
                )}

                {showRanking && (
                    <div className="ranking-popup">
                        <div className="popup-content">
                        <button onClick={this.toggleRanking} className="close-btn">
                            X
                        </button>
                        <h2 className='leaderboardTitle'>Leaderboard</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score<span className="smallText">/sec</span></th>

                            </tr>
                            </thead>
                            <tbody>
                            {leaderBoardList.map((result, index) => (
                                <tr key={result.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{result.Name}</td>
                                    <td>{result.Score}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}

                {isGameOver && (
                    <div>
                        <p className="scoreStyle">Your Score: {history.length}</p>
                        {history.length === 0 ? (
                            '' 
                        ) : (
                            <div className="wordListStyle">
                                {Array.isArray(history) && history.map((word: string, index: number) => (
                                    <li key={index}>{word}</li>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        );
    }
}


export default withFuncProps(UnlimitedMode);