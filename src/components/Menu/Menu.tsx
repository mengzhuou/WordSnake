import { withFuncProps } from "../withFuncProps";
import React from "react";
import "./Menu.css";
import FeedbackModel from "./FeedbackModel";
import WordAdditionModel from "./WordAdditionModel";
import HelpModel from "./HelpModel";


class Menu extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state = {
            showFeedbackModel: false,
            showWordAdditionModel: false,
            showHelpModel: false,
            time: new Date(),
            feedbackMessage: "",
            wordAdditionMessage: "",
        }
        this.defModeNav = this.defModeNav.bind(this);
        this.classicModeNav = this.classicModeNav.bind(this);
    }

    defModeNav = () => {
        this.props.navigate("/DefinitionMode")
    }
    classicModeNav = () => {
        this.props.navigate("/ClassicMode")
    }
    unlimitedModeNav = () => {
        this.props.navigate("/UnlimitedMode")
    }
    wordCloudNav = () => {
        this.props.navigate("/WordCloud")
    }
    
    handleFeedbackModelOpen = () => {
        this.setState({ showFeedbackModel: true })
    }
    
    handleFeedbackModelClose = () => {
        this.setState({ showFeedbackModel: false, feedbackMessage: "" })
    }
    
    handleFeedbackMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ feedbackMessage: event.target.value });
    }
    
    handleFeedbackSubmit = () => {
        this.handleFeedbackModelClose();
    }
    handleWordAdditionModelOpen = () => {
        this.setState({ showWordAdditionModel: true })
    }
    
    handleWordAdditionModelClose = () => {
        this.setState({ showWordAdditionModel: false, wordAdditionMessage: "" })
    }
    
    handleWordAdditionMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ wordAdditionMessage: event.target.value });
    }
    
    handleWordAdditionSubmit = () => {
        this.handleWordAdditionModelClose();
    }

    handleHelpModelOpen = () => {
        this.setState({ showHelpModel: true })
    }
    handleHelpModelClose = () => {
        this.setState({ showHelpModel: false })
    }
    render(){
        const {
            showFeedbackModel, feedbackMessage,
            showWordAdditionModel, wordAdditionMessage, 
            time,
            showHelpModel
        } = this.state;
        return (
            <div className="App">
                <p className="wsMenuTitle">Word Snake</p>
                
                <div className="buttonContainer">
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.defModeNav}>Definition Mode</button>
                    </div>
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.unlimitedModeNav}>Unlimited Mode</button>
                    </div>
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.classicModeNav}>Classic Mode</button>
                    </div>
                    <div className="buttonRow">
                        <button 
                            className="menuButton" onClick={this.handleWordAdditionModelOpen}>Add A Word
                        </button>
                        {showWordAdditionModel && 
                            <WordAdditionModel
                                message={wordAdditionMessage}
                                time={time}
                                onClose={this.handleWordAdditionModelClose}
                                onChange={this.handleWordAdditionMessageChange}
                                onSubmit={this.handleWordAdditionSubmit}
                            />
                        }
                    </div>
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.wordCloudNav}>Word Cloud</button>
                    </div>
                    <div className="buttonRow">
                        <button 
                            className="menuButton" onClick={this.handleFeedbackModelOpen}>Feedback
                        </button>
                        {showFeedbackModel && 
                            <FeedbackModel
                                message={feedbackMessage}
                                time={time}
                                onClose={this.handleFeedbackModelClose}
                                onChange={this.handleFeedbackMessageChange}
                                onSubmit={this.handleFeedbackSubmit}
                            />
                        }
                    </div>
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.handleHelpModelOpen}>Help</button>
                        {showHelpModel &&
                            <HelpModel
                                onClose={this.handleHelpModelClose}
                            />
                        }
                    </div>
                </div>

                <footer>
                    <div className="footer-text">
                        Designed with &#10084; by 
                    </div>
                    <div className="footer-find-me">
                        <a href="https://mengzhuou.github.io/">Mengzhu Ou</a>
                    </div>
                </footer>
            </div>
        );
    }
}


export default withFuncProps(Menu);