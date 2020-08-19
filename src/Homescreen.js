import React, { Component } from "react"
import blank from './blankcard.png';
//import Background from './background.jpg';


//------------------------SPEECH RECOGNITION-----------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------

var deck = [];
var inHand = [0, 0, 0, 0];
var inCycle = [];
var playHistory = [];
var counting = false;
let allCards = require('./cards.json');
var justPlayed = '';
class Speech extends Component {

  //TODO: fix repetition of cards that were just said 
  constructor() {
    super()
    this.state = {
      isLoading: true,
      cardArray : [],
      elixir: 5,
      elapsedTime: null,
      timeID: null,
      listening: false
    }
    this.countUp = this.countUp.bind(this);
    this.startCounting = this.startCounting.bind(this);
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }

  //string and one card
  isAlias(name, reference){    
    for (var i = 0; i<reference.name.length; i++){
      //reference.name is a list
      if (name === reference.name[i]){
        return true;
      }
    }
    return false;

  }
  isPlayable(card) {
    console.log(inCycle.indexOf(card));
    //can't play if too expensive
    if (card.elixir > this.state.elixir) {
      return false
    }
    //can't play if in cycle
    if (inCycle.indexOf(card) >= 0) {
      return false
    }
    //can't play if neither in hand nor if there's no space
    if (inHand.indexOf(card) < 0 && inHand.indexOf(0) < 0) {
      return false
    }
    return true;
  }

  playCard(card) {
    var index = -1;

    //check cycle length 
    //if cycle length == 4 -> replace current care
    if (inCycle.length === 4) {
      index = inHand.indexOf(card);
      if (index < 0) {
        index = inHand.indexOf(0);
      }
      inHand[index] = inCycle.pop();
      document.getElementById("myImg" + index.toString()).src = inHand[index].iconUrls.medium;
    }

    //splice into cycle
    inCycle.splice(0, 0, card);
    //subtract elixir
    var newElixir = this.state.elixir - card.elixir;
    this.setState({ elixir: newElixir });
    //add to history
    playHistory.push(card);
    //change text color
    document.getElementById('final').style.color = "lawngreen";
    //set image
    justPlayed = card.iconUrls.medium;
    document.getElementById("justPlayed").src = justPlayed;
  }


  //TODO: two skeletons in hand - don't replay cards
  searchArr(str, arr) {
    var query = str.toLowerCase();
    var manualAddCheck = query.split(' ');
    //check for manual add

    if (manualAddCheck[0] === '+' || manualAddCheck[0] === "plus"){
      //if it is a number
      if (!isNaN(+parseInt(manualAddCheck[1]))){
        this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + +parseInt(manualAddCheck[1])) }));
      }

    }

    if (manualAddCheck[0] === 'override' ){
      //if it is a number
      if (!isNaN(+parseInt(manualAddCheck[1]))){
        this.setState(({ elixir }) => ({ elixir: Math.min(10, +parseInt(manualAddCheck[1])) }));
      }

    }

    document.getElementById('final').style.color = "black";
    for (var i = 0; i < arr.length; i++) {
      if (this.isAlias(query, arr[i])) {

        var card = arr[i];
        //only add cards when deck < 8 and if not duplicate
        if (deck.length < 8) {
          if (!deck.includes(card)) {
            console.log("adding " + card.name[0] + " to deck");
            deck.push(card);
          }
        }
        if (this.isPlayable(card))
          this.playCard(card);
        break;
      }
    }
  }

  startCounting() {
    var timeID = setInterval(this.countUp, 100);
    this.setState({ timeID: timeID });
  }

  countUp() {

    //: elixir goes over 10 in double elixir mode
    var time = this.state.elapsedTime;

    if (time !== 0 && time >= 3000 && time % 9 === 0) {
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    }
    else if (time !== 0 && time >= 1200 && time % 14 === 0) {

      if (time === 1200) {
        this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
      }
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    } else if (time !== null && time !== 0 && time % 28 === 0) {
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    }



    this.setState(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }));

  }

  zeroPad(num) {
    if (num < 10) {
      return "0" + num.toString();
    }
    return num.toString();
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
            if (deck.length === 8) {
              this.searchArr(transcript, deck);
            } else {
              this.searchArr(transcript, allCards.items);
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
    const isLoading = this.state.isLoading;
    return (
      <div style={{
        backgroundImage: 'url(' + require('./background.jpg') + ')',
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        opacity: '1'
      }}>
        <div
          style={logo}
        >Clash Counter</div>
        <div style={container}>
          <div>{this.zeroPad(Math.floor(this.state.elapsedTime / 600)) + ":" + this.zeroPad(Math.floor((this.state.elapsedTime / 10) % 60))}</div>
          <img id="justPlayed" src={blank} alt="" width="69.25" height="82.5" />

          <button id='microphone-btn' style={button} onClick={() => {
            this.toggleListen();
            if (counting === false) {
              this.startCounting();
              counting = !counting;
            }
          }}>
            Start
        </button>
          <div style={{
            fontFamily: 'Clashfont',
            color: 'fuchsia', fontSize: "60px"
          }}>{this.state.elixir}</div>

          <div id='interim' style={interim}></div>
          <div id='final' style={final}></div>
          <div class="row" display="flex">
            <img id="myImg0" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg1" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg2" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg3" src={blank} alt="" width="138.5" height="165" />
          </div>

        </div>
      </div>

    )
  }
}

export default Speech

//-------------------------CSS------------------------------------

const styles = {
  logo: {
    margin: '10px',
    borderRadius: '25px',
    border: '10px solid #73AD21',
    padding: '20px',
    width: '200px',
    height: '150px',
    alignItems: 'center',
    textAlign: 'center',
  },

  // background: {
  //   color: 'blue',
  //   backgroundImage: `require(${Background})`,
  //   display: 'flex',
  //   backgroundSize: 'cover',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   textAlign: 'center'
  // },
  container: {
    color: 'blue',
    display: 'flex',
    backgroundSize: 'cover',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '60px',
    height: '60px',
    background: 'lightblue',
    borderRadius: '50%',
    margin: '1em 0 1em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    fontSize: '20px',
    color: 'black',
    backgroundColor: 'black',
    opacity: '0.9',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}

const { logo, container, button, interim, final } = styles