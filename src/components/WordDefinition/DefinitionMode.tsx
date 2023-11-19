import "./DefinitionMode.css";
import { withFuncProps } from "../withFuncProps";
import {logout, getWordAndDef} from '../../helpers/connector';
import { TextField, FormHelperText } from "@mui/material";
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
        try{
            const { storedInputValue } = this.state;
            const content = await getWordAndDef(storedInputValue);
            const words = content.map((word: String) => word.replace(/,/g, ", "));
            this.setState({ errMessage: "", wordList: words });
        } catch (error){
            console.error("Error fetching word in the database:", error);
            this.setState({ errMessage: 'The word does not exist. Please enter a valid word.' });
        }
        
    }

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
        this.props.navigate("/menu")
    }

    pagelogout = ()=>{
        logout().then(()=>{
            this.props.navigate("/")
        }).catch(()=>(alert("logout error")));
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
                    <button className="topnavButton" onClick={this.pagelogout}>Logout</button>
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