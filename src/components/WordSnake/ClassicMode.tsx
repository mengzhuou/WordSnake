import "./ClassicMode.css";
import { withFuncProps } from "../withFuncProps";
import { getLetterFromPreviousWord, getRandomStart } from './FuncProps'; 
import { TextField, FormHelperText } from "@mui/material";
import React, { Component } from 'react';
import CountdownTimer from "./CountdownTimer";
import { collection, onSnapshot, DocumentData, addDoc } from 'firebase/firestore';
import db from "./firebase";


interface ClassicModeState {
    isGameStarted: boolean;
    ForceUpdateNow: boolean;
    isGameOver: boolean;
    showWords: boolean;
    canbeSaved: boolean;
    showRanking: boolean;
    lastWord: string;
    lastLetter: string;
    firstWord: string;
    inputValue: string;
    storedInputValue: string;
    errMessage: string;
    wordList: string[];
    history: string[];
    leaderBoardList: DocumentData[];
    initialDataLoaded: boolean;
    dbErrorMessage: string;
    isError: boolean;
  }
  

class ClassicMode extends Component<any, ClassicModeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isGameStarted: false,
            ForceUpdateNow: false, 
            isGameOver: false, showWords: true, 
            canbeSaved: false,
            showRanking: false,
            lastWord:"", lastLetter: "", firstWord: "", 
            inputValue: '',
            storedInputValue: '', 
            errMessage: '', 
            wordList: [], history: [], 
            leaderBoardList: [],
            initialDataLoaded: false,
            dbErrorMessage: "",
            isError: false,
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
                    });
                    
                    let hisArr = this.state.history.concat(inputValue);
                    
                    this.setState({history: hisArr, lastLetter: lastLetter})
                } else {
                    this.setState({ errMessage: `The word must start with '${lastLetter}'`,  inputValue: "", storedInputValue: "" })
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
                history: [],
                inputValue: ''
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
        if (!this.state.initialDataLoaded) {
            this.loadInitialData();
        }
        onSnapshot(collection(db, "ClassicModeRank"), (snapshot) => {
            const sortedLeaderboard = snapshot.docs
            .map((doc) => doc.data() as DocumentData)
            .sort((a, b) => b.Score - a.Score);
            this.setState({ leaderBoardList: sortedLeaderboard });
        });
    }

    async loadInitialData() {  
        // leaderboard is the name of the database collection
        const leaderboardCollection = collection(db, "ClassicModeRank");
        const unsubscribe = onSnapshot(
          leaderboardCollection,
          (snapshot) => {
            const sortedLeaderboard = snapshot.docs
            .map((doc) => doc.data() as DocumentData)
            .sort((a, b) => b.Score - a.Score);

            this.setState({ leaderBoardList: sortedLeaderboard, isError: false, initialDataLoaded: true });
          },
          (error) => {
            const errorMes =
              "Oops, something is wrong with the server. Please come back tomorrow!";
            this.setState({ dbErrorMessage: errorMes, isError: true });
          }
        );
      }

    
    handleNewRecord = async (timerVal: number) => {
        const name = prompt(`(Want to save your score <${this.state.history.length} words> to the Leaderboard?) Enter your name.`);
        if (name !== null){
            const isNameValid = name.length === 0 || name.length >= 20;
            if (isNameValid){
                alert(`Please make sure: 0 < length of name < 20.`);
            } else{
                const collectionRef = collection(db, "ClassicModeRank");
                const payload = {Name: name, Score: timerVal};
                await addDoc(collectionRef, payload);
                this.setState({ canbeSaved: false, initialDataLoaded: false }); // record is already saved
            }
        }
    };
    
    //since game over is true, player can save record
    handleGameOverLogic() {
        this.setState({ canbeSaved: true });
    }

    handleShowWords = () => {
        this.setState({
            showWords: !this.state.showWords
        })
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
            showRanking, leaderBoardList,
            isGameOver, history, isError
        } = this.state;
        const wordListWithoutFirst = wordList.slice(1);
        const sortedWords = [...wordListWithoutFirst].sort();

        const countdownTimer = (
            <CountdownTimer
              duration={60}
              onTimeUp={this.handleEndGame}
            />
          );

        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.reStart} hidden={isGameStarted ? false : true}>Restart</button>
                    <button className="topnavButton" onClick={this.handleShowWords} hidden={!isGameStarted}>{showWords ? 'Hide Words' : 'Show Words'}</button>
                    <button className="topnavButton" onClick={this.toggleRanking}>Rank</button>
                    <button className="topnavButton" onClick={this.toggleSavedRecord} hidden={!canbeSaved}>Save Score </button>
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>
            
                <h1 className="wsTitle">Classic Word Snake</h1>
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
                            {!isError? (
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
                            ) : (
                                <div className="error-message">
                                    {this.state.dbErrorMessage}
                                </div>
                            )}
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


export default withFuncProps(ClassicMode);