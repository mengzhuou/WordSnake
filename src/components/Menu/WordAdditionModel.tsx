import React, { Component } from "react";
import { collection, addDoc } from 'firebase/firestore';
import db from "../WordSnake/firebase";
import { checkWordExist, checkMissingWordExist } from '../WordSnake/FuncProps';

interface WordAdditionProps {
    time: Date,
    onClose: () => void,
}

interface WordAdditionState {
    message: string;
}


class WordAdditionModel extends Component<WordAdditionProps, WordAdditionState> {
    constructor(props: WordAdditionProps) {
        super(props);
        this.state = {
            message: "",
        };
    }
    wordAdditionSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the form from submitting

        const { time, onClose } = this.props;
        const { message } = this.state;

        if (!message) {
            alert("You can't submit an empty request. Please try again.");
            return;
        }

        let lowercaseWord = message.toLowerCase();

        const isWordExist = await checkWordExist(lowercaseWord);
        const missingWordExists = await checkMissingWordExist(lowercaseWord);

        if (isWordExist || missingWordExists) {
            alert("You can't request for a word that exists in our dictionary.")
        }
        else{
            const collectionRef = collection(db, "WordAdditionRequest");
            const adminFeedback = "No";
            const payload = {Word: lowercaseWord, Time: time, Admin: adminFeedback};
            try {
                await addDoc(collectionRef, payload);
                alert("Submit Successfully! Thank you " + String.fromCharCode(10084));
                onClose();
            } catch (error) {
                console.error("Error submitting word: ", error);
            }
        }
    }

    wordAdditionMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log('called')
        let inputString = event.target.value.trim();
        if (
            inputString.startsWith('-') ||
            inputString.startsWith('\'')
        ) {
            alert('Apostrophes and/or hyphens cannot be used in the beginning of a word.');
        } else {
            const isValid = /^[a-zA-Z' -]*$/.test(inputString);
            if (isValid) {
                this.setState({
                    message: inputString
                });
            } else {
                alert('Special character(s) or number(s) are not accepted (except apostrophes, hyphens).');
            }
        }
    };

    render() {
        const { onClose } = this.props;
        const { message } = this.state;

        return (
            <div className="fbpopup">
                <button className="fbClose-btn" onClick={onClose}>
                    X
                </button>

                <form className="fbform" onSubmit={this.wordAdditionSubmit}>
                    <h1 className="helpTitle">Add A Word</h1>
                    <p className="wordAdditionText">If the word does not exist in our dictionary, you may request for adding such word. The word will be available in all mode (Definition/Unlimited/Classic) once the admin approved it.</p>
                    <textarea
                        className="wordAdditionTextArea" 
                        placeholder="Type a word..." 
                        name="message"
                        value={message} 
                        onChange={this.wordAdditionMessageChange}
                    ></textarea>

                    <div className="fbButtonRow">
                        <button type="submit" className="fbSubmitButton" onClick={this.wordAdditionSubmit}>Submit</button>
                        <button className="fbCancelButton" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default WordAdditionModel;
