import React, { Component } from "react";
import { collection, addDoc } from 'firebase/firestore';
import db from "../WordSnake/firebase";

interface FeedbackModelProps {
    message: string,
    time: Date,
    onClose: () => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onSubmit: (event: React.FormEvent) => void 
}

class FeedbackModel extends Component<FeedbackModelProps> {
    constructor(props: FeedbackModelProps) {
        super(props);
    }

    fbSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the form from submitting

        const { message, time, onClose } = this.props;

        if (!message) {
            alert("You can't submit an empty message. Please try again.");
            return;
        }

        const collectionRef = collection(db, "Feedback");
        const adminFeedback = "No";
        const payload = {Comment: message, Time: time, Admin: adminFeedback};
        try {
            await addDoc(collectionRef, payload);
            alert("Submit Successfully! Thank you " + String.fromCharCode(10084));
            onClose();
        } catch (error) {
            console.error("Error submitting feedback: ", error);
        }
    }

    render() {
        const { message, onClose, onChange } = this.props;

        return (
            <div className="fbpopup">
                <button className="fbClose-btn" onClick={onClose}>
                    X
                </button>

                <form className="fbform" onSubmit={this.fbSubmit}>
                    <h1 className="helpTitle">FEEDBACK</h1>
                    <textarea className="feedbackTextArea" placeholder="Enter your feedback..."  value={message} onChange={onChange}></textarea>

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
