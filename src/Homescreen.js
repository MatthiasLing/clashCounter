import React, { Component } from "react"

//------------------------SPEECH RECOGNITION-----------------------------

//  var speechRecognition = SpeechRecognition() //|| webkitSpeechRecognition
//  var recognition = new SpeechRecognition()

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------


var id = 0;
var url = '';
var deck = [];
var inHand = [0,0,0,0];
var inCycle = [];

var allCards = require('./cards.json');

function searchCards(str){

    //basic preprocessing
    var query = str.toLowerCase();
    // console.log("query: " + query);

    for (var i = 0 ; i< allCards.items.length; i++){
      
        if(query === allCards.items[i].name){
            
            //changes display
            url = allCards.items[i].iconUrls.medium;
            document.getElementById("myImg").src = url;

            //add card to deck if not in there yet
            if (!deck.includes(allCards.items[i]) ){

                //not yet 8 cards in deck
                if (deck.length < 8) {
                    deck.push(allCards.items[i]);
                }
            }
                //if there's a full cycle
                //this for loop basically tells where to put the next card in queue
                if (inCycle.length == 4){
                    
                    var index = inHand.indexOf(allCards.items[i])[0];

                    //the card is not the in the hand - then replace the first empty slot
                    if (index < 0){
                        index = inHand.indexOf(0)[0];
                    }
                    

                    inHand[index] = inCycle.pop();
                    console.log("index:")
                    console.log(inHand[index]);
                                     
                }
                console.log("splicing:")
                console.log(allCards.items[i]);
                //don't add duplicates
                if (inCycle.indexOf(allCards.items[i][0])<0){
                    inCycle.splice(0,0, allCards.items[i]);  
                }
                console.log(inCycle); 


                // console.log("in Hand: ");
                // console.log(inHand);
                // console.log("in cycle:");
                // console.log(inCycle);
            break;
        } 
    }
    console.log(deck);
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
        
        if (event.results[i].isFinal){ 
            if (transcript.length > 0){
                searchCards(transcript);
              }
            finalTranscript += transcript + ' ';}
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript

    //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1).join(' ');

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
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
        <img  id="myImg" 
      src= {url}
    //   style="width:138.5; height: 165px;"
      alt="new"
      />
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