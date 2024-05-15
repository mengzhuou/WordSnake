import React, { Component, ChangeEvent } from "react";
import { collection, DocumentData, addDoc } from 'firebase/firestore';
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
        const { message, time } = this.props;
        
        const collectionRef = collection(db, "Feedback");
        const adminFeedback = "No";
        const payload = {Comment: message, Time: time, Admin: adminFeedback};
        try {
            await addDoc(collectionRef, payload);
            alert("Submit Successfully! Thank you " + String.fromCharCode(10084));
            // this.setState({message: ""})
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

                    <div className="fbButtonRow">
                        <button type="submit" className="fbSubmitButton" onClick={this.fbSubmit}>Submit</button>
                        <button className="fbCancelButton" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FeedbackModel;
