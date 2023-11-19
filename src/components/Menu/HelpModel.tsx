import React from "react";
import "./Menu.css";

interface HelpModelProps {
  onClose: () => void
}

class HelpModel extends React.Component<HelpModelProps> {
  render() {
    const { onClose } = this.props;
    return (
        <div className="HelpModelPopup">
            <button className="fbClose-btn" onClick={onClose}>X</button>
            <h1 className="helpTitle">HELP</h1>
            <div className="helpInstruction">
                <p><b>Please ensure all word entries consist of a single word. Special characters permitted 
                    are apostrophes (') and hyphens (-).</b></p>
                <p>1. <b>Definition Mode</b>: Enter a word to receive its definition.</p>
                <p>2. <b>Unlimited Mode</b>: For each correct word you type, 
                    you'll receive an additional 5 seconds on your countdown timer. 
                    Just remember, each word should start with the last letter of the preceding word. 
                    For example, "apple" -{'>'} "egg" -{'>'} "gear".</p>
                <p>3. <b>Classic Mode</b>: Like in Unlimited Mode, every word you type should begin with the last letter 
                    of the word before it. For instance, "apple" -{'>'} "egg" -{'>'} "gear".</p>
                <p>4. <b>Add Word</b>: Think we're missing a legitimate word in our database? Submit it to 
                    our administrator for review and approval.</p>
                <p>5. <b>Feedback</b>: We'd love to hear from you! Share your suggestions and let us know 
                    how much you're enjoying the game.</p>
            </div>
        </div>
        );
    }
}

export default HelpModel;
