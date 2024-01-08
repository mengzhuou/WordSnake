import React, { Component, ChangeEvent } from "react";
import { collection, onSnapshot, DocumentData, addDoc } from 'firebase/firestore';
import db from "../WordSnake/firebase";

interface FeedbackModelProps {
    message: string,
    time: Date,
    onClose: () => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onSubmit: () => void
}

interface FeedbackModelState {
    initialDataLoaded: boolean,
    leaderBoardList: DocumentData[]
}

class FeedbackModel extends Component<FeedbackModelProps, FeedbackModelState> {
    constructor(props: FeedbackModelProps) {
        super(props);
        this.state = {
            initialDataLoaded: false,
            leaderBoardList: []
        };
    }

    fbSubmit = async () => {
        const collectionRef = collection(db, "Feedback");
        const { message, time } = this.props;
        const payload = {Comment: message, Time: time};
        try {
            await addDoc(collectionRef, payload);
            alert("Submit Successfully!");
            this.props.onClose();
        } catch (error) {
            console.error("Error submitting feedback: ", error);
        }
        
    }

    render() {
        const { message, onClose, onChange, onSubmit } = this.props;

        return (
            <div className="fbpopup">
                <button className="fbClose-btn" onClick={onClose}>
                    X
                </button>

                <form className="fbform" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                    <h1 className="helpTitle">FEEDBACK</h1>
                    <textarea value={message} onChange={onChange}></textarea>

                    <div className="buttonRow">
                        <button type="submit" className="fbSubmitButton" onClick={this.fbSubmit}>Submit</button>
                        <button className="fbSubmitButton" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FeedbackModel;
