import { withFuncProps } from "../withFuncProps";
import {logout, getNumOfUsers, getSignupRank, isAdmin, addFeedback, requestForWordAddition} from '../../helpers/connector';
import React from "react";
import "./Menu.css";
import FeedbackModel from "./FeedbackModel";
import AdminFeedbackModel from "./AdminFeedbackModel";
import UserAddWordModel from "./UserAddWordModel";
import AdminAddWordModel from "./AdminAddWordModel";
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
            showUserAddWordModel: false,
            showAdminAddWordModel: false,
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

    pagelogout = ()=>{
        logout().then(()=>{
            this.props.navigate("/")
        }).catch(()=>(alert("logout error")));
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


    handleRequestForWordAddition = async (word: string) => {
        requestForWordAddition(word).then(()=>{
            alert("Request for adding the corresponding new word is sent")
            this.handleUserAddWordModelClose();
        });
      }

    handleUserAddWordModelOpen = () => {
        this.setState({ showUserAddWordModel: true })
    }
    handleUserAddWordModelClose = () => {
        this.setState({ showUserAddWordModel: false })
    }

    handleshowAdminAddWordModelOpen = () => {
        this.setState({ showAdminAddWordModel: true })
    }
    handleshowAdminAddWordModelClose = () => {
        this.setState({ showAdminAddWordModel: false })
    }

    handleHelpModelOpen = () => {
        this.setState({ showHelpModel: true })
    }
    handleHelpModelClose = () => {
        this.setState({ showHelpModel: false })
    }
    render(){
        const {totalUserNum, signupRank, admin, 
            showFeedbackModel, feedbackMessage, 
            rating, showAdminFeedbackModel, 
            showUserAddWordModel, showHelpModel,
            showAdminAddWordModel
        } = this.state;
        return (
            <div className="App">
                <div className="labelContainer">
                    {admin ? 
                        <p className="adminMenuLabel">ADMIN</p>
                        :
                        null
                    }
                    <p className="menuLabel">Registered Users : {totalUserNum}</p>
                    <p className="menuLabel">Your User ID : {signupRank}</p>

                    
                </div>
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
                        {admin?
                            (
                                <>
                                    <button 
                                        className="menuButton" onClick={this.handleshowAdminAddWordModelOpen}> Add Word
                                    </button>
                                    {showAdminAddWordModel && (
                                        <AdminAddWordModel
                                            onClose={this.handleshowAdminAddWordModelClose}
                                        />
                                    )}
                                </>
                            )
                            :
                            (
                                <>
                                    <button 
                                        className="menuButton" onClick={this.handleUserAddWordModelOpen}>Add Word
                                    </button>
                                    {showUserAddWordModel &&
                                        <UserAddWordModel
                                            onClose={this.handleUserAddWordModelClose}
                                            onSubmit={this.handleRequestForWordAddition}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>
                    <div className="buttonRow">
                        {admin? 
                            (
                                <>
                                    <button 
                                        className="menuButton" onClick={this.handleAdminFeedbackOpen}> Feedback
                                    </button>
                                    {showAdminFeedbackModel && (
                                        <AdminFeedbackModel
                                            onClose={this.handleAdminFeedbackClose}
                                        />
                                    )}
                                </>
                            )
                            :
                                <>
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
                                </>
                        }
                    </div>
                    <div className="buttonRow">
                        <button className="menuButton" onClick={this.pagelogout}>Logout</button>
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

            </div>
        );
    }
}


export default withFuncProps(Menu);