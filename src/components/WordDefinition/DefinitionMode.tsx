import "./DefinitionMode.css";
import { withFuncProps } from "../withFuncProps";
import { TextField, FormHelperText } from "@mui/material";
import { missingWordDef, checkMissingWordExist } from '../WordSnake/FuncProps';

import React from "react";

class DefinitionMode extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state = {wordList:[], 
            inputValue: '', storedInputValue: '', errMessage: ''
        };
        this.forceup = this.forceup.bind(this);
        this.menuNav = this.menuNav.bind(this);
    }

    forceup = async () => {
        const { storedInputValue } = this.state;
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${storedInputValue}`);
            
            if (!response.ok) {
                throw new Error('The word does not exist. Please enter a valid word.');
            }
    
            const data = await response.json();
            const definitions = data.flatMap((entry: any) =>
            entry.meanings.map((meaning: any) =>
                meaning.definitions.map((definition: any) => definition.definition)
            )
        );
        this.setState({ errMessage: '', wordList: definitions });
        } catch (error: any) {
            const isMissingWord = await checkMissingWordExist(storedInputValue);
            if (isMissingWord) {
                const definition = await missingWordDef(storedInputValue);
                this.setState({ errMessage: '', wordList: [definition] });
            } else{
                console.error('Error fetching word definition:', error);
                this.setState({ errMessage: error.message || 'An error occurred while fetching word definition.' });
            }
        }
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
        if (event.key === "Enter"){
            const { inputValue } = this.state;
            if (inputValue.endsWith('\'') || inputValue.endsWith('-')) {
                this.setState({ 
                    errMessage: 'Apostrophes and/or hyphens cannot be used in the ending of a word.' 
                });
            } else {
                this.storeInputValue(this.state.inputValue).then(() => {
                    this.setState({ errMessage: "", inputValue: ""});
                    this.forceup();
                }); 
            }
        }
    }

    storeInputValue = async (inputValue: string) => {
        try {
            if (inputValue !== this.state.storedInputValue) {
                const lowerInput = inputValue.toLowerCase();
                this.setState({ storedInputValue: lowerInput })
            }
        } catch (error) {
            console.error(error)
        }
    }

    menuNav = () => {
        this.props.navigate("/")
    }

    componentDidMount(): void {
        this.setState({ errMessage: "",  inputValue: "", wordList: []})
    }
    
    render(){
        const { wordList, errMessage } = this.state;
        return (
            <div className="App">
                <div className="topnav">
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>    
                <h1 className="wsTitle">Word Definition</h1>
                <div>
                    <TextField
                        label = "Type a word for definition"
                        value = {this.state.inputValue}
                        onChange = {this.handleInputChange}
                        onKeyDown = {this.handleEnterKeyDown}
                    />
                </div>
                <div>
                    <FormHelperText style={{ color: 'red' }}>
                        {errMessage}
                    </FormHelperText>
                </div>
                {wordList.length > 0 && (
                    <div>
                        <ul>
                            {wordList.map((word: string) => (
                                <li key={word}>{word}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}


export default withFuncProps(DefinitionMode);