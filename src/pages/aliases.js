import React, { Component } from "react"
import blank from './../resources/blankcard.png';
// import { isAlias, isCommand } from './engine';

//------------------------SPEECH RECOGNITION-----------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'

//------------------------COMPONENT-----------------------------

var loading = 0;
var allCards;
var buttonText = "Start";


class Alias extends Component {

  constructor() {
    super()
    this.state = {
      cardArray: require('./../cards.json'),
      listening: false
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
    allCards = this.state.cardArray;

  }

  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        recognition.start()
      }
    } else {
      recognition.stop()
      recognition.onend = () => {
      }
    }
    recognition.onstart = () => {
    }
    let finalTranscript = ''
    recognition.onresult = event => {

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript = transcript + ' ';
        }
      }
       console.log(finalTranscript);
      document.getElementById('interim').innerHTML = finalTranscript

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1).join(' ');
      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
        recognition.stop()
        recognition.onend = () => {
          const finalText = transcriptArr.slice(0, -3).join(' ')

           document.getElementById('interim').innerHTML = finalText
        }
      }
    }
    //-----------------------------------------------------------------------
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
  }

  render() {
    const isLoading = this.state.isLoading;
    // const cardArray = this.state.cardArray;
    if (isLoading) return (<div>Loading ...</div>)
    return (
        
      <div style={{
        backgroundImage: 'url(' + require('./../resources/background2.jpg') + ')',
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        opacity: '1'
      }}>
        <div style={logo}>
          <div style={{ color: '#b7c3c7', fontFamily: 'Clashfont', fontSize: '40px' }}>Clash</div>
          <div style={{ color: 'gold', fontFamily: 'Clashfont', fontSize: '40px' }}>Counter</div>
        </div>
        
        <button type="button" style={button} onClick={this.props.action}>Save</button>
        <div style={container}>
          <div style={{
            height: "200px",
            width: "200px",
            fontFamily: 'Clashfont',
            color: 'fuchsia', fontSize: "40px",
            textShadow: '3.5px 3.5px 0.5em black',
            marginTop: "20px",
            marginBottom: "20px",
            verticalAlign: "baseline"
            // textAlign: "center"

          }}>
             

          </div>
 {/* The card that comes up each time */}
 <img id="myImg0" src={blank} alt="" width="173" height="206" style = {{marginBottom : "20px"}}  />
            <div id='interim' style={interim}></div>

          <button id='microphone-btn'
            style={button} onClick={() => {
              this.toggleListen();
              if (buttonText === "Start" || buttonText === 'Start Listening') {
                buttonText = "Stop Listening"
              } else if (buttonText === "Stop Listening") {
                buttonText = 'Start Listening'
              }

            }}>{buttonText}</button>

        </div>

      </div>
    )
  }
}

export default Alias

//-------------------------CSS------------------------------------

const styles = {
  row: {
    textAlign: "center",
    padding: "10px",
    margin: "auto",
    flexDirection: 'row',
    verticalAlign: 'middle'
  },
  logo: {
    verticalAlign: 'top',
    float: 'left',
    textShadow: '3px 3px 0.3em #f70f0f',
    margin: 'auto',
    padding: '20px',
    width: '200px',
    height: '150px',
    alignItems: 'center',
    textAlign: 'center',
  },
  timer: {
    verticalAlign: 'top',
    float: 'right',
    // verticalAlign: 'top',
    // float: 'left',
    fontSize: '35px',
    margin: '20px',
    borderRadius: '25px',
    border: '2px solid grey',
    padding: '20px',
    width: '200px',
    height: '100px',
    alignItems: 'center',
    textAlign: 'center',
  },
  container: {
    color: 'light blue',
    display: 'flex',
    backgroundSize: 'cover',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: "auto",
    marginRight: "auto"
  },
  button: {
    boxShadow: '0 0 8px grey, 0 0 5px black',
    fontFamily: 'Clashfont',
    verticalAlign: 'top',
    float: 'right',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 0%, rgba(252,176,69,1) 100%)',
    border: 'none',
    color: 'white',
    textAlign: 'center',
    fontSize: '28px',
    padding: '20px',
    width: '250px',
    transition: 'all 0.5s',
    cursor: 'pointer',
    marginTop: '30px',
  },
  interim: {
    color: 'black',
    opacity: '0.8',
    fontFamily: 'Clashfont',
    backgroundColor: 'grey',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '200px',
    marginTop: '0',
  },
}

const { row, logo, timer, container, button, interim } = styles