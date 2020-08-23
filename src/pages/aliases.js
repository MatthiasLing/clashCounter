import React, { Component } from "react"
import blank from './../resources/blankcard.png';
import './aliasStyle.css'

//------------------------SPEECH RECOGNITION-----------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = false;
recognition.interimResults = true
recognition.lang = 'en-US'

//------------------------COMPONENT-----------------------------

var id = '';
var buttonText = "Start";
var current = -1;
var aliasList = {};
var state = 0;
const AWS = require('aws-sdk');
let awsConfig = {
  "region": "us-east-1",
  "endpoint": "http://dynamodb.us-east-1.amazonaws.com/",
  "accessKeyId":,
  "secretAccessKey": ,
}
AWS.config.update(awsConfig);
let client = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

class Alias extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: "./../resources/blankcard.png",
      cardArray: require('./../cards.json'),
      listening: false,
      cards: [],
      playerAliases: {}
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }
  async componentDidMount() {
    id = '';
    this.setState({ url: blank, playerID: {}, cards: [], cardArray: require('./../cards.json').items });
  }

  componentWillUnmount(){
    this.setState({
      listening: false
    }, this.handleListen)
    recognition.stop()
    recognition.onend = () => {
    }
  }

  async getBasic(){
    aliasList = await this.fetchOnebyKey(id);
    this.props.addToAliases(aliasList);
  }
  fetchOnebyKey (id) {

    var params = {
      TableName: "userTable",
      Key: {
        "id": id
      }
    };

    return new Promise(function(resolve, reject) { 
      client.get(params, function (err, data) {
        if (err) {
          id = "ERROR"
          document.getElementById("fname").defaultValue = id;
          document.getElementById("fname").style.color = "red";
        } else {
          var output = JSON.stringify(data, null, 2);
          var output2 = JSON.parse(output)
    
          if (output2.Item == null){
          document.getElementById("fname").value = "No user found";
          document.getElementById("fname").style.color = "red";
          }else{
          document.getElementById("fname").defaultValue = id;
          document.getElementById("fname").style.color = "green";
          resolve(JSON.parse(output2.Item.aliases));
          }
        }
      })
      ;  
    });
  };

  async saveBasic(){
    var worked = await this.save(id, aliasList)
  }

  save = function (id, lst) {
    var params = {
      TableName: "userTable",
      Item: {
        id: id,
        aliases:
          JSON.stringify(lst)
      }
    };
    return new Promise(function(resolve, reject) {
      client.put(params, function (err, data) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
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
      document.getElementById('interim').innerHTML = finalTranscript

      if (current >= 0 && current < 99) {

        var trimmed = finalTranscript.toLowerCase().trim();
        var currName = this.state.cardArray[current].name[0];

        if (trimmed !== "") {
          if (aliasList[currName] == null) {
            aliasList[currName] = [trimmed];
          } else if (aliasList[currName].indexOf(trimmed) < 0) {
            aliasList[currName].push(trimmed)
          }
          state++;
          document.getElementById("saveButton").innerHTML = "Save Aliases"
        }
      }

      //-------------------------COMMANDS------------------------------------
      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1).join(' ');
      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
        recognition.stop()
        recognition.onend = () => {
        }
      }
    }
    //-----------------------------------------------------------------------
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
  }

  incrementView(amt) {
    current += amt;
    if (current === 99) {
      current = 0;
    } else if (current < 0) {
      current = 98;
    }
    this.setState({ url: this.state.cardArray[current].iconUrls.medium });
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
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        opacity: '1'
      }}>
        <div style={logo}>
          <div style={{ color: '#b7c3c7', fontFamily: 'Clashfont', fontSize: '40px' }}>Set</div>
          <div style={{ color: 'gold', fontFamily: 'Clashfont', fontSize: '40px' }}>Aliases</div>
        </div>
        <div class="column" style={topRight}>
          <input type="text" id="fname" class="form" style={playerID} 
            defaultValue={id} onChange ={(event)=>{
            document.getElementById("fname").style.color = "black";
            id = event.target.value;
            }} >
          </input>
          <button type="button" id = "saveButton" style={button} onClick={
            ()=>{
              if (state === 0){
                // this.fetchOnebyKey(id)
                this.getBasic();
              }else{
                this.saveBasic();
              }
              this.props.addToAliases(aliasList); 
            }
          } 
          >Get Aliases</button>
        </div>

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
          }}>

          </div>
          {/* The card that comes up each time */}
          <div class="row" display="flex">
            <div><a class="back" onClick={() => {
              this.incrementView(-1);
            }} >{'<'}</a></div>
            <img id="blank" src={this.state.url} alt="" width="173" height="206"/>
            <a class="next" 
              onClick={() => {
                this.incrementView(1);
            }}>{'>'}</a>
          </div>

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

          <button type="buttonBack" id = "saveButton" style={{
              color: "grey", backgroundColor: "gold", fontFamily: 'Clashfont', marginTop: "10px"
            }} onClick={
              () => {
                this.props.toggleSeen();
              }}
          >Back to Main Page</button>
        </div>
      </div>
    )
  }
}

export default Alias

//-------------------------CSS------------------------------------

const styles = {
  topRight: {
    verticalAlign: 'top',
    float: 'right',
  },
  playerID: {
    color: 'black',
    opacity: '0.8',
    fontFamily: 'Clashfont',
    border: '#ccc 2px solid',
    padding: '1em',
    margin: '1em',
    width: '200px',
    marginTop: '10',
    readOnly: 'false'
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
  container: {
    color: 'light blue',
    display: 'flex',
    backgroundSize: 'cover',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginRight: "auto"
  },
  button: {
    boxShadow: '0 0 8px grey, 0 0 5px black',
    fontFamily: 'Clashfont',
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
    marginTop: '10',
  },
}

const { topRight, playerID , logo, container, button, interim } = styles