import React, { Component } from 'react';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/98894
import './App.css';
import Speech from './Homescreen'

class App extends Component {
  state = {}
  constructor(props) {
    super(props);
    this.state = {
      homePage: null,

    }
  }
  componentWillMount() {

    this.setState({
      homePage: <Speech parentContext={this} />
    })
  }
  render() {
    return (
      <div className="Speech">
        {this.state.homePage}
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
// import Timer from './gameTimer'

// class App extends Component {
//   state = { }
//   constructor(props){
//     super(props);
//     this.state={
//       homePage:null,

//     }
//   }
//   componentWillMount(){
//     // var pages =[];
//     //     pages.push(<Speech parentContext={this}/>);

//     this.setState({
//                   homePage:<Timer parentContext={this}/>
//                     })
//   }
//   render() {
//     return (
//       <div className="Speech">
//         {this.state.homePage}
//       </div>
//     );
//   }
// }
// // const style = {
// //   margin: 15,
// // };
// export default App;

