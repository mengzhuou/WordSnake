import React, { ChangeEvent } from "react";
import { isWordExist, isWordLegitimate, isWordForAdditionExist } from '../../helpers/connector';
import { TextField } from "@mui/material";
import "./Menu.css";

interface UserAddWordModelProps {
    onClose: () => void,
    onSubmit: (word: string) => void,
}

interface UserAddWordModelState {
    wordExist: boolean,
    word: string,
    errMessage: string,
    isWordLegitimate: boolean,
    wordSubmitted: boolean,
}

class UserAddWordModel extends React.Component<UserAddWordModelProps, UserAddWordModelState> {
  constructor(props: UserAddWordModelProps) {
    super(props);
    this.state = {
      wordExist: false,
      word: "",
      errMessage: "",
      isWordLegitimate: false,
      wordSubmitted: false,
    };
  }

  handleSearchValueChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputString = event.target.value;
    const isValid = /^[a-zA-Z'-]*$/.test(inputString);
    if (
      inputString.startsWith('-') || 
      inputString.startsWith('\''))
    {
        this.setState({ 
            errMessage: 'Apostrophes and/or hyphens cannot be used in the beginning of a word.' 
        });
    } 
    else if (
      inputString.endsWith('\'') || 
      inputString.endsWith('-'))
      {
        this.setState({ 
          errMessage: 'Apostrophes and/or hyphens cannot be used in the ending of a word.' 
        });
      }
    else if (isValid) {
        this.setState({
            word: inputString,
            errMessage: ""
        });
    } 
    else {
      this.setState({ errMessage: 'Special character(s) or number(s) are not accepted (except apostrophes, hyphens).' })
    }
    await this.checkWordExistence(inputString);
    await this.checkWordLegitimate(inputString);
    await this.checkWordSubmitted(inputString);
  }

  checkWordExistence = async (inputWord: string) => {
    const exist = await isWordExist(inputWord);
    this.setState({
      wordExist: exist,
    });
  }

  checkWordLegitimate = async (inputWord: string) => {
    const isWord = await isWordLegitimate(inputWord);
    this.setState({ isWordLegitimate: isWord })
  }

  checkWordSubmitted = async (inputWord: string) => {
    const isWord = await isWordForAdditionExist(inputWord);
    this.setState({ wordSubmitted: isWord })
  }
  render() {
    const { onClose, onSubmit } = this.props;
    const { wordExist, word, errMessage, isWordLegitimate, wordSubmitted } = this.state;

    return (
      <div className="addWordModelPopup">
        <button className="fbClose-btn" onClick={onClose}>
          X
        </button>
        <h1 className="helpTitle">Word Addition Request</h1>

        <form onSubmit={
          (event) => {event.preventDefault(); 
            console.log("isWordLegitimate", isWordLegitimate)
            if (!isWordLegitimate) {
              alert("The word is not legitimate, cannot submit.");
              return;
            }  
            if (wordExist) {
              alert("The word already exists in our database, cannot submit.");
              return;
            }  
            if (wordSubmitted){
              alert("Request for adding this word already submitted by you or others, cannot submit again.")
              return;
            }
            else{
              onSubmit(word);
            }
        }}>
        
            <div className="searchWord">
              <TextField
                  label={`Search word online: `}
                  value={word}
                  onChange={this.handleSearchValueChange}
              />
            </div>
            <div className="typedWord">
              {errMessage}
            </div>
            {word && (
              <div className="typedWord">
                  {wordExist ? "The word already exists in our database" : "The word does not exist in our database"}
              </div>
            )}
            <button type="submit" className="userAddWordModelSubmit">Submit</button>
        </form>
      </div>
    );
  }
}

export default UserAddWordModel;
