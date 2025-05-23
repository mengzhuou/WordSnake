import "./ClassicMode.css";

import { withFuncProps } from "../withFuncProps";
import { getLetterFromPreviousWord, getRandomStart, updateWordCloud, checkWordExist, checkMissingWordExist } from './FuncProps';
import { TextField, FormHelperText } from "@mui/material";
import React, { Component } from 'react';
import UnlimitedCountdownTimer from "./UnlimitedCountdownTimer";
import { collection, getDocs, DocumentData, addDoc } from 'firebase/firestore';
import db from "./firebase";
import WordAdditionModel from "../Menu/WordAdditionModel";

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
    errMessage: string;
    timeLeft: number;
    wordList: string[];
    history: string[];
    leaderBoardList: DocumentData[];
    timerInputLength: number;
    initialDataLoaded: boolean;
    dbErrorMessage: string;
    isError: boolean;
    showWordAdditionModel: boolean;
    time: Date;
  }
  

class UnlimitedMode extends Component<any, UnlimitedModeState> {
    inputRef: React.RefObject<HTMLInputElement>;
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
            storedInputValue: '', 
            errMessage: '', 
            timeLeft: 10, wordList: [], history: [], 
            leaderBoardList: [],
            timerInputLength: -1,
            initialDataLoaded: false,
            dbErrorMessage: "",
            isError: false,
            showWordAdditionModel: false,
            time: new Date()
        };
        this.menuNav = this.menuNav.bind(this);
        this.inputRef = React.createRef();
    }

    forceup = async (inputValue: string) => {
        if (this.state.history.includes(inputValue) || (this.state.storedInputValue === inputValue)) {
            this.setState({ errMessage: 'The word already exist. Please type another word.', inputValue: "", storedInputValue: "" })
        } else {
            const lastWord = this.state.wordList[this.state.wordList.length - 1]
            const lastLetter = lastWord[lastWord.length - 1]
            const isWordExist = await checkWordExist(inputValue);
            const missingWordExists = await checkMissingWordExist(inputValue);
            if (isWordExist || missingWordExists) {
                if (inputValue[0] === lastLetter) {
                    const words = await getLetterFromPreviousWord(inputValue);
                    let wordList = this.state.wordList.concat(inputValue);
                    const wordLength = inputValue.length;
                    await updateWordCloud(inputValue);
                    this.setState({
                        lastWord: lastWord,
                        errMessage: '',
                        firstWord: words,
                        ForceUpdateNow: false,
                        wordList: wordList,
                        timeLeft: this.state.timeLeft,
                        isTimerUpdated: true,
                        timerInputLength: wordLength
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

    
    handleWordAdditionModelOpen = () => {
        this.setState({ showWordAdditionModel: true })
    }
    
    handleWordAdditionModelClose = () => {
        this.setState({ showWordAdditionModel: false })
    }

    handleEndGame = () => {
        this.updateGameState(false, true)
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputString = event.target.value.trim();
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
            const isValid = /^[a-zA-Z' -]*$/.test(inputString); 
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
                const lowerInput = inputValue.toLowerCase();
                if (lowerInput.length === 1) {
                    if (inputValue === "a" || inputValue === "i" || inputValue === "o"){
                        this.setState({ storedInputValue: lowerInput, ForceUpdateNow: true, inputValue: "" })
                        this.forceup(lowerInput);
                    } 
                    else{
                        this.setState({
                            errMessage: 'This single letter does not form a word'
                        });
                    }
                } 
                else{
                    this.setState({ storedInputValue: lowerInput, ForceUpdateNow: true, inputValue: ""})
                    this.forceup(lowerInput);
                }
            }
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
                history: [],
                inputValue: '',
                showWords: true
            }, () => {
                this.inputRef.current?.focus();
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
                errMessage: "" ,
                showWords: false,
            })
        }
    }

    //since game over is true, player can save record
    handleGameOverLogic() {
        this.setState({ canbeSaved: true });
    }

    async loadInitialData() {  
        const leaderboardCollection = collection(db, "UnlimitedModeRank");
        const snapshot = await getDocs(leaderboardCollection);
        const sortedLeaderboard = snapshot.docs
                .map((doc) => doc.data())
                .sort((a, b) => b.Score - a.Score);;
        this.setState({ leaderBoardList: sortedLeaderboard, isError: false, initialDataLoaded: true });
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
                this.setState({ canbeSaved: false, initialDataLoaded: false }); // record is already saved
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
        // initialDataLoaded is set to false when game is over. So, when user toggle the ranking, the ranking data will be updated.
        if (!this.state.initialDataLoaded) {
            this.loadInitialData();
        }
        this.setState((prevState: any) => ({
            showRanking: !prevState.showRanking,
        }));
    };

    toggleSavedRecord = () => {
        this.handleNewRecord(this.state.history.length);
    };

    handleConfirmButtonClick = () => {
        const { inputValue } = this.state;
        if (inputValue.endsWith('\'') || inputValue.endsWith('-')) {
            this.setState({
                errMessage: 'Apostrophes and/or hyphens cannot be used in the ending of a word.'
            });
        } else {
            const lowerInput = inputValue.toLowerCase();
            if (lowerInput.length === 1) {
                if (inputValue === "a" || inputValue === "i" || inputValue === "o"){
                    this.setState({ storedInputValue: lowerInput, ForceUpdateNow: true, inputValue: "" })
                    this.forceup(lowerInput);
                } 
                else{
                    this.setState({
                        errMessage: 'This single letter does not form a word'
                    });
                }
            } 
            else{
                this.setState({ storedInputValue: lowerInput, ForceUpdateNow: true, inputValue: ""})
                this.forceup(lowerInput);
            }
        }
    }
    

    render() {
        const { firstWord, inputValue, errMessage, 
            isGameStarted, showWords, canbeSaved,
            timeLeft, isTimerUpdated, showRanking, leaderBoardList,
            isGameOver, history, timerInputLength,
            showWordAdditionModel, time
        } = this.state;
        const sortedWords = history.sort();

        const countdownTimer = (
            <UnlimitedCountdownTimer
              duration={timeLeft}
              wordLength={timerInputLength}
              onTimeUp={this.handleEndGame}
              isTimerUpdated={isTimerUpdated}
            />
        );

        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.reStart} hidden={isGameStarted ? false : true}>Restart</button>
                    <button className="topnavButton" onClick={this.handleShowWords} hidden={!isGameStarted}>{showWords ? 'Hide Words' : 'Show Words'}</button>
                    <button className="topnavButton" onClick={this.toggleRanking}>Rank</button>
                    <button className="topnavButton" onClick={this.toggleSavedRecord} hidden={!canbeSaved}>Save Score </button>
                    <button 
                        className="topnavButton" onClick={this.handleWordAdditionModelOpen}>Add A Word
                    </button>
                    {showWordAdditionModel && 
                        <WordAdditionModel
                            time={time}
                            onClose={this.handleWordAdditionModelClose}
                        />
                    }
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>
            
                <h1 className="wsTitle">Unlimited Mode</h1>
                {isGameStarted? (
                    countdownTimer
                ) : (
                    <button className="startGameButton" onClick={() => this.updateGameState(true, false)} hidden={isGameStarted ? true : false}>Start Game</button>
                )}

                <div className="textField">
                    <TextField
                        label={`Enter a word starts with '${firstWord}'`}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleEnterKeyDown}
                        style={{
                            display: isGameStarted ? 'block' : 'none',
                        }}
                        fullWidth={true}
                        autoFocus={true}
                        inputRef={this.inputRef}
                    />
                </div>
                <div>
                    <FormHelperText style={{ color: 'red', margin: '0px 10px 0px 20px' }}>
                        {errMessage}
                    </FormHelperText>
                </div>
                <button className="confirmButton" onClick={this.handleConfirmButtonClick} hidden={!isGameStarted}>Confirm</button>

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
                                <th>Score</th>
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