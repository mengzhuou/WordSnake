import React, { Component } from 'react';

import errImg from "./404.png";
import { withFuncProps } from "./withFuncProps";

interface NotFoundProps{
}

class NotFound extends Component<any, NotFoundProps>  {
    constructor(props: NotFoundProps) {
        super(props);
        this.menuNav = this.menuNav.bind(this);
    }

    menuNav = () => {
        this.props.navigate("/");
    }

    render() {
        return (
            <div>
                <div className="topnav">
                    <button className="topnavButton" onClick={this.menuNav}>Menu</button>
                </div>
                <img className="errImg" src={errImg} alt="Not Found"/>
            </div>
        );
    }
}

export default withFuncProps(NotFound);
