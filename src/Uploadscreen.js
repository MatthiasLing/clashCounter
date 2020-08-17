// import React, { Component } from 'react';
// import './App.css';
// /*
// Screen:LoginScreen
// Loginscreen is the main screen which the user is shown on first visit to page and after
// hitting logout
// */
// import LoginScreen from './Loginscreen';
// /*
// Module:Material-UI
// Material-UI is used for designing ui of the app
// */
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import AppBar from 'material-ui/AppBar';
// import RaisedButton from 'material-ui/RaisedButton';
// import Drawer from 'material-ui/Drawer';
// import MenuItem from 'material-ui/MenuItem';
// import FontIcon from 'material-ui/FontIcon';
// import {blue500, red500, greenA200} from 'material-ui/styles/colors';
// /*
// Module:Dropzone
// Dropzone is used for local file selection
// */
// var apiBaseUrl = "http://localhost:8888/api/";
// /*
// Module:superagent
// superagent is used to handle post/get requests to server
// */

// // var request = require('superagent');

// class UploadScreen extends Component {
//   constructor(props){
//     super(props);
//     this.state={
//       role:'student',
//       filesPreview:[],
//       filesToBeSent:[],
//       draweropen:false,
//       printcount:10,
//       printingmessage:'',
//       printButtonDisabled:false
//     }
//   }
//   componentWillMount(){
//     // console.log("prop values",this.props.role);
//     var printcount;
//     //set upload limit based on user role
//     if(this.props.role){
//       if(this.props.role == 'student'){
//         printcount = 5;
//       }
//       else if(this.props.role == 'teacher'){
//         printcount =10;
//       }
//     }
//     this.setState({printcount,role:this.props.role});
//   }
//   /*
//   Function:handleCloseClick
//   Parameters: event,index
//   Usage:This fxn is used to remove file from filesPreview div
//   if user clicks close icon adjacent to selected file
//   */ 
//   handleCloseClick(event,index){
//     // console.log("filename",index);
//     var filesToBeSent=this.state.filesToBeSent;
//     filesToBeSent.splice(index,1);
//     // console.log("files",filesToBeSent);
//     var filesPreview=[];
//     for(var i in filesToBeSent){
//       filesPreview.push(<div>
//         {filesToBeSent[i][0].name}
//         <MuiThemeProvider>
//         <a href="#"><FontIcon
//           className="material-icons customstyle"
//           color={blue500}
//           onClick={(event) => this.handleCloseClick(event,i)}
//         >clear</FontIcon></a>
//         </MuiThemeProvider>
//         </div>
//       )
//     }
//     this.setState({filesToBeSent,filesPreview});
//   }
//   /*
//   Function:onDrop
//   Parameters: acceptedFiles, rejectedFiles
//   Usage:This fxn is default event handler of react drop-Dropzone
//   which is modified to update filesPreview div
//   */
//   onDrop(acceptedFiles, rejectedFiles) {
//     //   // console.log('Accepted files: ', acceptedFiles[0].name);
//     //   var filesToBeSent=this.state.filesToBeSent;
//     //   if(filesToBeSent.length < this.state.printcount){
//     //     filesToBeSent.push(acceptedFiles);
//     //     var filesPreview=[];
//     //     for(var i in filesToBeSent){
//     //       filesPreview.push(<div>
//     //         {filesToBeSent[i][0].name}
//     //         <MuiThemeProvider>
//     //         <a href="#"><FontIcon
//     //           className="material-icons customstyle"
//     //           color={blue500}
//     //           styles={{ top:10,}}
//     //           onClick={(event) => this.handleCloseClick(event,i)}
//     //         >clear</FontIcon></a>
//     //         </MuiThemeProvider>
//     //         </div>
//     //       )
//     //     }
//     //     this.setState({filesToBeSent,filesPreview});
//     //   }
//     //   else{
//     //     alert("You have reached the limit of printing files at a time")
//     //   }
//     console.log('onDrop');
//       // console.log('Rejected files: ', rejectedFiles);
// }
// /*
//   Function:handleClick
//   Parameters: event
//   Usage:This fxn is handler of submit button which is responsibel fo rhandling file uploads
//   to backend
// */
// handleClick(event){
//   // console.log("handleClick",event);
//   this.setState({printingmessage:"Please wait until your files are being printed",printButtonDisabled:true})
//   var self = this;
//   if(this.state.filesToBeSent.length>0){
//     var filesArray = this.state.filesToBeSent;
//     // var req = request.post(apiBaseUrl+'fileprint');
//     for(var i in filesArray){
//         // console.log("files",filesArray[i][0]);
//         // req.attach(filesArray[i][0].name,filesArray[i][0])
//     }
//     // req.end(function(err,res){
//     //   if(err){
//     //     console.log("error ocurred");
//     //   }
//     //   console.log("res",res);
//     //   self.setState({printingmessage:'',printButtonDisabled:false,filesToBeSent:[],filesPreview:[]});
//     //   alert("File printing completed")
//     //   // self.props.indexthis.switchPage();
//     // });
//   }
//   else{
//     alert("Please upload some files first");
//   }
// }
// /*
//   Function:toggleDrawer
//   Parameters: event
//   Usage:This fxn is used to toggle drawer state
//   */
// toggleDrawer(event){
//   // console.log("drawer click");
//   this.setState({draweropen: !this.state.draweropen})
// }
// /*
//   Function:toggleDrawer
//   Parameters: event
//   Usage:This fxn is used to close the drawer when user clicks anywhere on the 
//   main div
//   */
// handleDivClick(event){
//   // console.log("event",event);
//   if(this.state.draweropen){
//     this.setState({draweropen:false})
//   }
// }
// /*
//   Function:handleLogout
//   Parameters: event
//   Usage:This fxn is used to end user session and redirect the user back to login page
//   */
// handleLogout(event){
//   // console.log("logout event fired",this.props);
//   var loginPage =[];
//   loginPage.push(<LoginScreen appContext={this.props.appContext}/>);
//   this.props.appContext.setState({loginPage:loginPage,uploadScreen:[]})
// }
//   render() {
//     return (
//       <div className="App">
//           <div onClick={(event) => this.handleDivClick(event)}>
//           <center>
//           <div>
//             You can print upto {this.state.printcount} files at a time since you are {this.state.role}
//           </div>
//           <div>
//           Files to be printed are:
//           {this.state.filesPreview}
//           </div>
//           </center>
//           <div>
//           {this.state.printingmessage}
//           </div>
//       <MuiThemeProvider>
//            <RaisedButton disabled={this.state.printButtonDisabled} label="Print Files" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
//       </MuiThemeProvider>
//           </div>
//           </div>
//     );
//   }
// }

// const style = {
//   margin: 15,
// };

// export default UploadScreen;


import React, { Component } from "react"

//------------------------SPEECH RECOGNITION-----------------------------

//  var speechRecognition = SpeechRecognition() //|| webkitSpeechRecognition
//  var recognition = new SpeechRecognition()

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------

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

    console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript

    //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
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
        <button id='microphone-btn' style={button} onClick={this.toggleListen} />
        <div id='interim' style={interim}></div>
        <div id='final' style={final}></div>
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