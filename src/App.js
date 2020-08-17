import React, { Component } from 'react';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/98894
import './App.css';
import Loginscreen from './Loginscreen'
import Speech from './Homescreen'

class App extends Component {
  state = { }
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      uploadScreen:[]
    }
  }
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<Speech parentContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }
  render() {
    return (
      <div className="App">
        {this.state.loginPage}
        {this.state.uploadScreen}
      </div>
    );
  }
}
// const style = {
//   margin: 15,
// };
export default App;

// import React, { Component } from 'react';
// // import injectTapEventPlugin from 'react-tap-event-plugin';
// // Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/98894
// import './App.css';
// import Loginscreen from './Loginscreen'

// var id = 0;
// var url = '';

// var allCards = require('./cards.json');
// console.log(allCards);

// function update(){
//   url = allCards.items[id].iconUrls.medium;
//   document.getElementById("myImg").src = url;
//   id++;
// }

// class App extends Component {
//   state = { 
//     isLoading : false ,
//     cards : [],
//     current: []
//   }

//   //setState
//   render() {
//     const isLoading = this.state.isLoading;
//     const cards = this.state.cards;
//     var id = 0;
//     const deck = 
//       [
      
//           {
//             "name": "Knight",
//             "id": 26000000,
//             "maxLevel": 13,
//             "iconUrls": {
//               "medium": "https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png"
//             }
//           },
//           {
//             "name": "Archers",
//             "id": 26000001,
//             "maxLevel": 13,
//             "iconUrls": {
//               "medium": "https://api-assets.clashroyale.com/cards/300/W4Hmp8MTSdXANN8KdblbtHwtsbt0o749BbxNqmJYfA8.png"
//             }
//           },
//           {
//             "name": "Goblins",
//             "id": 26000002,
//             "maxLevel": 13,
//             "iconUrls": {
//               "medium": "https://api-assets.clashroyale.com/cards/300/X_DQUye_OaS3QN6VC9CPw05Fit7wvSm3XegXIXKP--0.png"
//             }
//           },

//       ]
//       //waiting for some result
//       if (isLoading)
//         return (<div>Loading ...</div>)
      
//       return (
//         <div className = "container border border-secondary rounded center">
//           <div className = "row">
//             <div className = "col-12">
//             <button id='microphone-btn' style={button} onClick={update} />
//             <img  id="myImg"
//       src= {url}
//       //{deck[0].iconUrls.medium}
//       // "https://api-assets.clashroyale.com/cards/300/X_DQUye_OaS3QN6VC9CPw05Fit7wvSm3XegXIXKP--0.png"
//       alt="new"
//       />
//             </div>

//           </div>

//         </div>
//       );

//   }
// }
// // const style = {
// //   margin: 15,
// // };
// export default App;

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center'
//   },
//   button: {
//     width: '60px',
//     height: '60px',
//     background: 'lightblue',
//     borderRadius: '50%',
//     margin: '6em 0 2em 0'
//   },
//   interim: {
//     color: 'gray',
//     border: '#ccc 1px solid',
//     padding: '1em',
//     margin: '1em',
//     width: '300px'
//   },
//   final: {
//     color: 'black',
//     border: '#ccc 1px solid',
//     padding: '1em',
//     margin: '1em',
//     width: '300px'
//   }
// }

// const { container, button, interim, final } = styles
  