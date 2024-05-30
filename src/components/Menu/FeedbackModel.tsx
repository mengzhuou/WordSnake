import React, { Component } from "react";
import { collection, addDoc } from 'firebase/firestore';
import db from "../WordSnake/firebase";

interface FeedbackModelProps {
    name: string,
    email: string,
    message: string,
    time: Date,
    onClose: () => void,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onSubmit: (event: React.FormEvent) => void 
}

interface FeedbackModelState {
    name: string,
    email: string,
    message: string,
}

class FeedbackModel extends Component<FeedbackModelProps, FeedbackModelState> {
    constructor(props: FeedbackModelProps) {
        super(props);
        this.state = {
            name: this.props.name,
            email: this.props.email,
            message: this.props.message,
        };
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<FeedbackModelState, keyof FeedbackModelState>);
    }

    fbSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the form from submitting

        const { name, email, message } = this.state;
        const { time, onClose } = this.props;

        if (!message) {
            alert("You can't submit an empty message. Please try again.");
            return;
        }

        const collectionRef = collection(db, "Feedback");
        const adminFeedback = "No";
        const payload = { Name: name, Email: email, Comment: message, Time: time, Admin: adminFeedback };
        try {
            await addDoc(collectionRef, payload);
            alert("Submit Successfully! Thank you " + String.fromCharCode(10084));
            onClose();
        } catch (error) {
            console.error("Error submitting feedback: ", error);
        }
    }

    render() {
        const { onClose } = this.props;
        const { name, email, message } = this.state;

        return (
            <div className="fbpopup">
                <button className="fbClose-btn" onClick={onClose}>
                    X
                </button>

                <form className="fbform" onSubmit={this.fbSubmit}>
                    <h1 className="helpTitle">FEEDBACK</h1>
                    <p>Name: </p>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        placeholder="Enter your name"
                    />
                    <p>Email: Optional</p>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        placeholder="Enter your email"
                    />
                    <textarea
                        className="feedbackTextArea"
                        name="message"
                        placeholder="Enter your feedback..."
                        value={message}
                        onChange={this.handleChange}
                    ></textarea>

                    <div className="fbButtonRow">
                        <button type="submit" className="fbSubmitButton">Submit</button>
                        <button type="button" className="fbCancelButton" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FeedbackModel;
