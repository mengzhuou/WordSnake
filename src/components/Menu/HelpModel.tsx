import React from "react";
import "./Menu.css";

interface HelpModelProps {
  onClose: () => void;
}

class HelpModel extends React.Component<HelpModelProps> {
  render() {
    const { onClose } = this.props;
    return (
      <div className="HelpModelPopup">
        <button className="fbClose-btn" onClick={onClose}>
          X
        </button>
        <h1 className="helpTitle">HELP</h1>
        <div className="helpInstruction">
          <p>
            <b>
              Please ensure all word entries consist of a single word.
              Special characters permitted are apostrophes (') and hyphens (-).
            </b>
          </p>
          <p>
            1. <b>Definition Mode</b>: Enter a word to receive its definition.
          </p>
          <p>
            2. <b>Unlimited Mode</b>: Each word should start with the last letter of the preceding word.
            For example, "apple" -&gt; "egg" -&gt; "gear".
            
            <br />
            For each correct word you type, you'll
            receive some additional bonus time (seconds) on your countdown timer based on your
            word length:
            <br />
            Bonus = 3 if wordLength &#8805; 0 and wordLength &#8804; 5
            <br />
            Bonus = 6 if wordLength &#8805; 6 and wordLength &#8804; 10
            <br />
            Bonus = 15 if wordLength &#62; 10 and wordLength &#8804; 20
            <br />
            Bonus = 30 if wordLength &#62; 20
            <br />
          </p>
          <p>
            3. <b>Classic Mode</b>: Same rule in Unlimited Mode without bonus
            in the timer.
          </p>
          <p>
            4. <b>Add A Word</b>: If a word is not already in our dictionary, you can request to add it. 
          </p>
          <p>
            5. <b>Word Cloud</b>: This section showcases the words entered by all players in Classic/Unlimited Mode. The larger the font size, the more frequently the word has been used.
          </p>
          <p>
            6. <b>Feedback</b>: I'd love to hear your feedback! Please share your suggestions and let me know how much you're enjoying the game.
          </p>
        </div>
      </div>
    );
  }
}

export default HelpModel;
