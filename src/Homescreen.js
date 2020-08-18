import React, { Component } from "react"
import blank from './blankcard.png';

//------------------------SPEECH RECOGNITION-----------------------------

//  var speechRecognition = SpeechRecognition() //|| webkitSpeechRecognition
//  var recognition = new SpeechRecognition()

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------


var deck = [];
var inHand = [0, 0, 0, 0];
var inCycle = [];

let allCards = require('./cards.json');

function searchArr(str, arr) {
  var query = str.toLowerCase();

  for (var i = 0; i < arr.length; i++) {
    if (query === arr[i].name) {
      var card = arr[i];

      //only add cards when deck < 8 and if not duplicate
      if (deck.length < 8) {
        if (!deck.includes(card)) {
          deck.push(card);
        }
      }
      //if there's a full cycle
      //this for loop basically tells where to put the next card in queue
      if (inCycle.length == 4) {

        var index = inHand.indexOf(card);

        //the card is not the in the hand - then replace the first empty slot
        if (index < 0) {
          index = inHand.indexOf(0);
        }

        //TODO: handle error when card not in deck is said
        if (index >= 0) {
          inHand[index] = inCycle.pop();
          document.getElementById("myImg" + index.toString()).src = inHand[index].iconUrls.medium;
        }
      }

      if (inCycle.indexOf(card) < 0) {
        inCycle.splice(0, 0, card);
      }
      break;

    }
  }
}


class Speech extends Component {

  constructor() {
    super()
    this.state = {
      listening: false
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }

  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {

    // console.log('listening?', this.state.listening)
    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        // console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        // console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      //   console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          if (transcript.length > 0) {
            if (deck.length == 8) {
              searchArr(transcript, deck);
            } else {
              searchArr(transcript, allCards.items);
            }
          }
          //was a += before
          finalTranscript = transcript + ' ';
        }
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1).join(' ');

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
        recognition.stop()
        recognition.onend = () => {
          //   console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          //The Shit I added
          document.getElementById('final').innerHTML = finalText
        }
      }
    }

    //-----------------------------------------------------------------------

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
  }

  render() {
    return (
      <div style={container}>
        <button id='microphone-btn' style={button} onClick={this.toggleListen}>
          Start
        </button>
        <div id='interim' style={interim}></div>
        <div id='final' style={final}></div>
        <div class="row" display="flex">
          <img id="myImg0" src={blank} alt="" />
          <img id="myImg1" src={blank} alt="" />
          <img id="myImg2" src={blank} alt="" />
          <img id="myImg3" src={blank} alt="" />
        </div>

      </div>
    )
  }
}


export default Speech


//-------------------------CSS------------------------------------

const styles = {

  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '60px',
    height: '60px',
    background: 'lightblue',
    borderRadius: '50%',
    margin: '6em 0 2em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}

const { container, button, interim, final } = styles