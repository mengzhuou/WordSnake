import { withFuncProps } from "../withFuncProps";
import { getNumOfUsers, getSignupRank, isAdmin, addFeedback} from '../../helpers/connector';
import React from "react";
import "./Menu.css";
import FeedbackModel from "./FeedbackModel";
import HelpModel from "./HelpModel";


class Menu extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state = {
            totalUserNum: -1,
            signupRank: -1,
            admin: false,
            showFeedbackModel: false,
            showAdminFeedbackModel: false,
            showHelpModel: false,
            feedbackMessage: "",
            rating: 5,
            adminFeedbackMessages: [],
        }
        this.defModeNav = this.defModeNav.bind(this);
        this.classicModeNav = this.classicModeNav.bind(this);
    }

    componentDidMount() {
        this.displayUserNum();
        this.displayUserSignupRank();
        this.displayAdmin();
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
    displayUserNum = async () => {
        const num = await getNumOfUsers();
        this.setState({ totalUserNum: num })
    }

    displayUserSignupRank = async () => {
        const num = await getSignupRank();
        this.setState({ signupRank: num })
    }
    
    displayAdmin = async () => {
        const isAdminTrue = await isAdmin();
        this.setState({ admin: isAdminTrue })
    }
    
    handleFeedbackModelOpen = () => {
        this.setState({ showFeedbackModel: true })
    }
    
    handleFeedbackModelClose = () => {
        this.setState({ showFeedbackModel: false })
    }
    
    handleFeedbackMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ feedbackMessage: event.target.value });
    }
    
    handleRatingChange = (rating: number) => {
        this.setState({ rating: rating });
    }
    
    handleAdminFeedbackOpen = () => {
        this.setState({ showAdminFeedbackModel: true })
    }
    
    handleAdminFeedbackClose = () => {
        this.setState({ showAdminFeedbackModel: false })
    }
    
    handleFeedbackSubmit = () => {
        const { feedbackMessage, rating } = this.state;
        
        addFeedback(feedbackMessage, rating).then(() => {
            this.setState({ feedbackMessage: "", rating: 5 })
            alert("Feedback is sent")
            this.handleFeedbackModelClose();
        }).catch((error: Error) => {
            console.error("Error submitting feedback: ", error);
        })
    }

    handleHelpModelOpen = () => {
        this.setState({ showHelpModel: true })
    }
    handleHelpModelClose = () => {
        this.setState({ showHelpModel: false })
    }
    render(){
        const {admin, 
            showFeedbackModel, feedbackMessage, 
            rating, showAdminFeedbackModel, 
            showHelpModel
            
        } = this.state;
        return (
            <div className="App">
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
                            className="menuButton" onClick={this.handleFeedbackModelOpen}>Feedback
                        </button>
                        {showFeedbackModel && 
                            <FeedbackModel
                                message={feedbackMessage}
                                rating={rating}
                                onClose={this.handleFeedbackModelClose}
                                onChange={this.handleFeedbackMessageChange}
                                onRatingChange={this.handleRatingChange}
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