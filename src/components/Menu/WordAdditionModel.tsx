import React, { Component } from "react";
import { collection, addDoc } from 'firebase/firestore';
import db from "../WordSnake/firebase";

interface WordAdditionProps {
    message: string,
    time: Date,
    onClose: () => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onSubmit: (event: React.FormEvent) => void 
}

class WordAdditionModel extends Component<WordAdditionProps> {
    constructor(props: WordAdditionProps) {
        super(props);
    }

    wordAdditionSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the form from submitting

        const { message, time, onClose } = this.props;

        if (!message) {
            alert("You can't submit an empty request. Please try again.");
            return;
        }

        const collectionRef = collection(db, "WordAdditionRequest");
        const adminFeedback = "No";
        const payload = {Word: message, Time: time, Admin: adminFeedback};
        try {
            await addDoc(collectionRef, payload);
            alert("Submit Successfully! Thank you " + String.fromCharCode(10084));
            onClose();
        } catch (error) {
            console.error("Error submitting word: ", error);
        }
    }

    render() {
        const { message, onClose, onChange } = this.props;

        return (
            <div className="fbpopup">
                <button className="fbClose-btn" onClick={onClose}>
                    X
                </button>

                <form className="fbform" onSubmit={this.wordAdditionSubmit}>
                    <h1 className="helpTitle">Add A Word</h1>
                    <p className="wordAdditionText">If the word does not exist in our dictionary, you may request for adding such word. The word will be available in all mode (Definition/Unlimited/Classic) once the admin approved it.</p>
                    <textarea className="wordAdditionTextArea" placeholder="Type a word..." value={message} onChange={onChange}></textarea>

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
