import React, { Component } from "react"
import blank from './resources/blankcard.png';
import { isAlias, isCommand } from './engine';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Alias from './pages/aliases.js';

//------------------------SPEECH RECOGNITION-----------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'

//------------------------COMPONENT-----------------------------

var mode = 1;
var tick = 0;
var loading = 0;
var deck = [];
var inHand = [0, 0, 0, 0];
var inCycle = [];
var playHistory = [];
var justPlayed = '';
var allCards;
var counting = false;
var buttonText = "Start";
class Speech extends Component {

  //TODO: fix repetition of cards that were just said 
  constructor(props) {
    super(props)
    this.state = {
      playerID: "",
      //TODO: change back
      seen: true,
      percentage: 0,
      isLoading: false,
      cardArray: require('./cards.json'),
      elixir: 5,
      elapsedTime: null,
      timeID: null,
      listening: false,
      aliases: {}
    }
    this.countUp = this.countUp.bind(this);
    this.startCounting = this.startCounting.bind(this);
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
    this.toggleSeen = this.toggleSeen.bind(this)
    this.addToAliases = this.addToAliases.bind(this)
    //TODO: ensure this is right
    allCards = this.state.cardArray;

  }

  toggleSeen() {
    this.setState({ seen: !this.state.seen });
  }

  addToAliases (cards){
    this.setState ({ aliases: cards });
  }

  reset(){

    mode = 1;
    loading = 0;
    deck = [];
    this.setState ({ aliases: {} });

    inHand = [0, 0, 0, 0];
    inCycle = [];
    playHistory = [];
    document.getElementById("justPlayed").src  = blank;
    counting = false;
    loading = 0;

    for (var i=0;i<4;i++)
      document.getElementById("myImg" + i).src = blank;

    clearInterval(this.state.timeID);
    if(this.state.listening){
      this.toggleListen();            
    }
    this.setState({ timeID: null });
    this.setState(({}) => ({ elapsedTime: 0 }));
    buttonText = 'Start Listening';
    this.tick = 0;

    this.setState(({ }) => ({ elixir: 5 }));
  }


  //string and one card
  isPlayable(card) {
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
    //if cycle length == 4 -> replace current card
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
    if (card.name[0] === "mirror") {
      newElixir -= playHistory.pop().elixir;
    }
    this.setState({ elixir: newElixir });
    //add to history
    playHistory.push(card);
    //change text color
    document.getElementById('interim').style.color = "#79ff12";
    //set image
    justPlayed = card.iconUrls.medium;
    document.getElementById("justPlayed").src = justPlayed;
  }

  checkAliases(str){
      for (const [key, value] of Object.entries(this.state.aliases)) {
        for (var i=0; i< value.length; i++){
          if (value[i]===str)
            return key;
        }
      }
      return null;
  }

  searchArr(str, arr) {
    var query = str.toLowerCase();
    var manualAddCheck = query.split(' ');

    if (query== "game over"){
      this.reset();
    }

    //check for manual add
    var command = isCommand(manualAddCheck, this.state.elixir);
    if (command >= 0) {
      this.setState(({  }) => ({ elixir: command }));
    }

    document.getElementById('interim').style.color = "black";

    //check the aliases first 
    var aliasCheck = this.checkAliases(query);
    if (this.checkAliases(str) != null){
      query = aliasCheck;
    }

    for (var i = 0; i < arr.length; i++) {
      if (isAlias(query, arr[i])) {

        var card = arr[i];
        //only add cards when deck < 8 and if not duplicate
        
        if (this.isPlayable(card)){
          if (deck.length < 8) {
            if (!deck.includes(card)) {
              deck.push(card);
            }
          }
            this.playCard(card);
        }
        
        break;
      }
    }
  }

  startCounting() {
    var timeID = setInterval(this.countUp, 100);
    this.setState({ timeID: timeID });
  }

  countUp() {
    this.setState(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }));
    var time = this.state.elapsedTime;
    if (this.state.elixir !== 10) {
      tick++;
    } else {
      tick = 0;
    }

    if (time !== 0 && time >= 3000 && tick % 9 === 0) {
      mode = 3;
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    }
    else if (time !== 0 && time >= 1200 && tick % 14 === 0) {
      mode = 2;
      if (time === 1200) {
        this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
      }
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    } else if (time !== null && time !== 0 && tick % 28 === 0) {
      this.setState(({ elixir }) => ({ elixir: Math.min(10, elixir + 1) }));
    }

    if (mode === 1) {
      if (tick === 28) {
        tick = 0;

      } else {
        loading = ((tick % 28) / 28) * 100;

      }
    } else if (mode === 2) {
      if (tick === 14) {
        tick = 0;
      } else {
        loading = 100 * ((this.state.elapsedTime % 14) / 14);
      }

    } else {
      if (tick === 9) {
        tick = 0;
      } else {
        loading = 100 * ((this.state.elapsedTime % 9) / 9);
      }
    }
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
          if (transcript.length > 0) {
            if (deck.length === 8) {
              this.searchArr(transcript, deck);
            } else {
              this.searchArr(transcript, allCards.items);
            }
          }
          finalTranscript = transcript + ' ';
        }
      }

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
    if (this.state.seen === false) {
      return <Alias 
      toggleSeen = {this.toggleSeen}
      addToAliases = {this.addToAliases}
      aliases = {this.state.aliases}
        />
    }

    return (
      <div style={{
        backgroundImage: 'url(' + require('./resources/background.jpg') + ')',
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        opacity: '1'
      }}>
        <div style={logo}>
          <div style={{ color: '#b7c3c7', fontFamily: 'Clashfont', fontSize: '40px' }}>Clash</div>
          <div style={{ color: 'gold', fontFamily: 'Clashfont', fontSize: '40px' }}>Counter</div>
        </div>
        
        <div style={timer}>
          {this.zeroPad(Math.floor(this.state.elapsedTime / 600))
            + ":" + this.zeroPad(Math.floor((this.state.elapsedTime / 10) % 60))}</div>
        <div style={container}>
          <div style={{
            height: 220,
            width: 220,
            fontFamily: 'Clashfont',
            color: 'fuchsia', fontSize: "40px",
            textShadow: '3.5px 3.5px 0.5em black',
            marginTop: "50px",
            marginBottom: "20px",
          }}>
            <CircularProgressbar
              value={this.state.elixir === 10 ? 100 : loading}
              text={this.state.elixir}
              styles={buildStyles({
                pathTransitionDuration: 0,
                backgroundColor: "#A8A860",
                margin: "auto",
                textSize: '40px',
                textColor: "fuchsia",
                pathColor: "fuchsia",
                trailColor: "darkgray",
              })}
            />
          </div>
          <div class="row" style={row} display="flex">
            <img id="justPlayed" src={blank} alt="" width="69.25" height="82.5" margin="auto" />
            <div id='interim' style={interim}></div>
          </div>

          <div class="row" display="flex">
            <img id="myImg0" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg1" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg2" src={blank} alt="" width="138.5" height="165" />
            <img id="myImg3" src={blank} alt="" width="138.5" height="165" />
          </div>

          <button id='microphone-btn'
            style={button} onClick={() => {
              this.toggleListen();
              if (buttonText === "Start" || buttonText === 'Start Listening') {
                buttonText = "Stop Listening"
              } else if (buttonText === "Stop Listening") {
                buttonText = 'Start Listening'
              }
              if (counting === false) {
                this.startCounting();
                counting = !counting;
              }
            }}>{buttonText}</button>
          <button onClick={() => {
            if(this.state.listening){
              this.toggleListen();            
            }
            this.toggleSeen();
          }}
            style={{
              color: "grey", backgroundColor: "gold", fontFamily: 'Clashfont', marginTop: "10px"
            }}
          >Set Aliases</button>
        </div>
      </div>
    )
  }
}

export default Speech

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
    textAlign: 'center'
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
    color: 'gray',
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