import React, { Component } from "react"
import blank from './../resources/blankcard.png';
import { EditorBorderTop } from "material-ui/svg-icons";
// import { isAlias, isCommand } from './engine';

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
var allCards = require('./../cards.json')

const AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com/",
    "accessKeyId": "<Your key here>",
    "secretAccessKey": '<Your key here>',
}
AWS.config.update(awsConfig);
let client = new AWS.DynamoDB.DocumentClient({region : 'us-east-1'});


class Alias extends Component {

  fetchOnebyKey = function(id){
    var params = {
        TableName: "userTable",
        Key: {
            "id" : id.toString()
        }
    };
    client.get(params, function(err,data){
        if (err){
            // callback(err,null);
            console.log("FAIL")
        }else{
            // callback(null, data.Items);
            console.log(JSON.stringify(data,null,2));
        }
    });
}

save = function(id, values){

  var params = {
      TableName: "userTable",
      // Key: {
      //     "id" : "test123abc"
      // },
      Item: {
        id : id,
        aliases:
        JSON.stringify(aliasList)}
  };

  client.put(params, function(err,data){
      if (err){
          // callback(err,null);
          console.log("FAIL")
          console.log(JSON.stringify(err,null,2));

      }else{
          // callback(null, data.Items);
          console.log(JSON.stringify(data,null,2));
      }
  });
}

  constructor(props) {
    super(props)
    this.state = {
      url: "./../resources/blankcard.png",
      cardArray: require('./../cards.json'),
      listening: false,
      cards : []
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)

  }
  async componentDidMount(){
    id = '';
    this.setState({url: blank, cards: [], cardArray: require('./../cards.json').items});
  }

  // async changeState(){
  //   const response = await fetch('https://e9mvbloutj.execute-api.us-east-1.amazonaws.com/dev');
  //   const body = await response.json();
  //   console.log(body);
  //   this.setState({cards: body, isLoading: false});
  // }

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

      //finaltranscript is the one we want 
      if (current >=0 && current < 99){

        var trimmed = finalTranscript.toLowerCase().trim();
        var currName = this.state.cardArray[current].name[0];

        if(trimmed != ""){
          if (aliasList[currName] == null){
            aliasList[currName] = [trimmed];
          }else if (aliasList[currName].indexOf(trimmed) < 0){
            aliasList[currName].push(trimmed)
          }

          
          // if(this.state.cards[currName] == null){
          //   this.state.cards[currName] = [];
          // }
        
          // if (this.state.cards[currName].indexOf(trimmed)<0){
          //   this.state.cards[currName].push(trimmed)
          // }
          console.log(aliasList)
        }
        
        // this.state.cards[allCards.items[current].name].push(finalTranscript);
        // console.log(this.state.cards[current]);
      }

      //-------------------------COMMANDS------------------------------------
 
      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1).join(' ');
      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
        recognition.stop()
        recognition.onend = () => {
          const finalText = transcriptArr.slice(0, -3).join(' ')

          //  document.getElementById('interim').innerHTML = finalText
        }
      }
    }
    //-----------------------------------------------------------------------
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
  }

  incrementView(amt){
    id = "LingDynasty";
    current += amt;
      if (current === 99){
        current = 0;
      }else if (current < 0){
        current = 98;
      }
      this.setState({url: this.state.cardArray[current].iconUrls.medium});
      console.log(current)
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
          <div style={{ color: '#b7c3c7', fontFamily: 'Clashfont', fontSize: '40px' }}>Set</div>
          <div style={{ color: 'gold', fontFamily: 'Clashfont', fontSize: '40px' }}>Aliases</div>
        </div>
        
        <button type="button" style={button} onClick={ async() => {
          if (true)
            // await this.changeState();}
            console.log(id);
            this.save("LingDynasty", this.state.cards);
            this.fetchOnebyKey(id);
        }
          // this.props.toggleSeen()
          }>Save</button>



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
 <div class="row" display="flex">
 <button type ="button" onClick= {()=>{
   this.incrementView(-1);

 }}>{"<"}</button>

 <img id="blank" src={this.state.url} alt="" width="173" height="206" style = {{marginBottom : "20px"}}  />
 <button type ="button" onClick={() => {
   this.incrementView(1);
   //console.log(this.state.cards);
 }} >{">"}</button>
  </div>
 

            <div id='interim' style={interim}>
            </div>

          <button id='microphone-btn'
            style={button} onClick={() => {
              // this.props.addToAliases("{esfesfsefes");
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
  a : {
    textDecoration: "none",
    display: "inline-block",
    padding: "8px 16px",
  },
  
  // a:hover :{
  //   backgroundColor: "#ddd",
  //   color: "black"
  // },
  
  previous :{
    backgroundColor: "#f1f1f1",
    color: "black"
  },
  
  next : {
    backgroundColor: "#4CAF50",
    color: "white"
  },
  
  round : {
    borderRadius: "50%"
  },
  form:{
    verticalAlign: 'top',
    float: 'right',
  },
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

const { form, row, logo, timer, container, button, interim } = styles