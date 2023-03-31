import React, {Component} from 'react';
import {connect} from "react-redux";
import './App.css';
import './topmenu.css';
import './contact.css';
import './about.css';
import './loading.css';

import {ThreeShader2Channels} from './ThreeShader2Channels';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipHidden: false,
            rotateTooltipHidden: true,
            contactDialogVisible: false,
            aboutDialogVisible: false,
            loadingScreenVisible: true
        }

        this.tooltipTimer = null;
        this.anim = null;
    }

    componentDidMount() {

        // once component mounted, we load 3D scene
        this.anim = new ThreeShader2Channels();
        this.anim.setComponentRef(this);
        this.anim.entry();

        // add mouse/touch listeners
        addEventListener('mousedown', (event) => {
            this.mouseDownHandler(event, this)
        });

        addEventListener('touchstart', (event) => {
            this.mouseDownHandler(event, this)
        });

        this.rotateTooltipTimer();
    }


    /* start interval to check anim.bottleState every given period
    if this.anim.bottleState === 3 -> rotateTooltipHidden = false
    we show rotation tooltip on the screen */
    rotateTooltipTimer() {
        setInterval(() => {
            if (this.anim != null) {

                if (this.anim.bottleState === 3 && this.state.rotateTooltipHidden) {
                    this.setState(prevState => {
                        return {...prevState, rotateTooltipHidden: false}
                    })
                }

            }
        }, 300)
    }


    componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        removeEventListener('mousedown', this.mouseDownHandler);
    }


    // when fires starts timer when tooltip should appear again
    mouseDownHandler(event, componentRef) {
        componentRef.setState(prevState => {
            return {...prevState, tooltipHidden: true};
        });

        // Clear previously set timer
        if (componentRef.tooltipTimer != null) {
            clearTimeout(componentRef.tooltipTimer);
        }

        // Set new timer
        if (componentRef.anim.bottleState === 0) {
            componentRef.tooltipTimer = setTimeout(() => {
                componentRef.setState(prevState => {
                    return {...prevState, tooltipHidden: false};
                });
            }, 3000);
        }

    }

    mainDivClickHandler() {
        if ( this.state.contactDialogVisible || this.state.aboutDialogVisible ) {
            this.setState({
                ...this.state,
                contactDialogVisible: false,
                aboutDialogVisible: false
            });
        }
    }

    // fires when THREEJS loaded everything into canvas
    onCanvasReady() {
        console.log("onCanvasReady");
        this.setState({
            ...this.state,
            loadingScreenVisible: false
        })
    }

    render() {

        // If bottle moved to another state we set tooltip to hidden
        if (this.anim != null) {
            console.log(`bottleState = ${this.anim.bottleState}`);
            if (this.anim.bottleState > 0 && !this.state.tooltipHidden) {
                this.setState(prevState => {
                    return {...prevState, tooltipHidden: true}
                })
            }
        }


        let loadingScreenClass = "loading-screen ";
        if (!this.state.loadingScreenVisible) {
            loadingScreenClass += "loading-screen loading-screen-animated";
        }


        let aboutOpenLeft = '60%';
        if (window.screen.width <= 480) {
            // phone
            aboutOpenLeft = '15%';
        }
        else if (window.screen.width > 480 && window.screen.width <= 900) {
            // pad
            aboutOpenLeft = '35%';
        }

        let rotTooltip = "Rotate with mouse"
        if (window.screen.width <= 900) {
            rotTooltip = "Rotate with touch"
        }

        return (
            <div onClick={() => {this.mainDivClickHandler()}}>
                <canvas id={"c"}/>

                <ul className={"top-menu"}>
                    <li onClick={() => {
                        this.setState({
                            ...this.state,
                            contactDialogVisible: !this.state.contactDialogVisible
                        })
                    }} style={{opacity: this.state.aboutDialogVisible ? 0.0 : 1.0}}>Contact</li>
                    <li onClick={() => {
                        this.setState({
                            ...this.state,
                            aboutDialogVisible: !this.state.aboutDialogVisible
                        })
                    }}>About</li>
                </ul>

                <div style={{opacity: 1.0 - this.state.rotateTooltipHidden}}
                   className={"main-text"}>
                    <h2 className={"header"}>Try our new citrus drink</h2>
                    Full of taste, packed with energy and perfect to take along to office or gym.
                    <br/>
                    <br/>
                    <span className={"ingredients"}>
                        Ingredients:&nbsp;
                        <span style={{color: "#BF5747"}}>orange</span> juice,&nbsp;
                        <span style={{color: "#FFD280"}}>lemon</span> juice,&nbsp;
                        <span style={{color: "#00C3AA"}}>lime</span> juice,&nbsp;
                        <span style={{color: "#6ca8ff"}}>water</span>
                    </span>
                </div>

                <div className={"tooltip-container"}
                     style={{opacity: 1.0 - this.state.tooltipHidden}}>
                    <p className={"tooltip"}>Drag the cap to the right</p>
                    <div className={'animated-ball'}/>
                </div>

                <p className={"rotate-tooltip"}
                   style={{opacity: 1.0 - this.state.rotateTooltipHidden}}>{rotTooltip}</p>


                {/* --------- Contact dialog --------- */}
                <div className={"contact-dialog"}
                     onClick={(e) => {e.stopPropagation()}}
                     style={{opacity: this.state.contactDialogVisible ? 1.0 : 0.0}}>
                    <input type="email" id="email" placeholder={"email"}
                               size="30" required />

                    <input id={"submit"}
                           type={"submit"}
                           value={"Send"} onClick={() => {}}/>
                </div>


                {/* --------- About dialog --------- */}
                <div className={"about-dialog"}
                     onClick={(e) => {e.stopPropagation()}}
                     style={{left: this.state.aboutDialogVisible ? aboutOpenLeft : '100%'}}>

                    <div className={"about-content"}>
                        <p>Our company is producing and delivering the best quality drinks,
                            packed with flavour but consisting of natural ingredients,
                            carefully grown and collected from our own gardens.</p>
                        <br/>
                        <p>You can write us for further information using email below</p>
                        <br/>
                        <p className={"email"}>drinks@company.com</p>
                    </div>
                </div>

                {/*<p className={"demo-tooltip"}*/}
                {/*   style={{opacity: 1.0 - this.state.rotateTooltipHidden}}>*/}
                {/*    This page was made for demonstration purposes. Not a real product*/}
                {/*</p>*/}


                <div className={loadingScreenClass}>
                    <p>Loading...</p>
                </div>

            </div>
        );
    }
}

export default connect(
    state => ({
        storeData: state
    }),
    dispatch => ({})
)(App);