import React from 'react';
import './App.css';
// import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import HomePage from "./pages/HomePage"
import firebase from './firebase'
// firebase.initializeApp({
//   apiKey: "AIzaSyBL0zV2DtcLdaqXa4sJoaE_iZfc5-rE4dg",
//   authDomain: "todos-cf72d.firebaseapp.com",
// })

class App extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      isSignedIn: false
    }
  }

  // uiConfig = {
  //   signInFlow: "popup",
  //   signInOptions: [
  //     // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //     // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //     // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //     firebase.auth.GithubAuthProvider.PROVIDER_ID,
  //     // firebase.auth.EmailAuthProvider.PROVIDER_ID
  //   ],
  //   callbacks: {
  //     signInSuccess: () => false
  //   }
  // }


  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      console.log("user", user)
    })
  }

  onLogIn = () => {
console.log(this.state.isLoading)
    this.setState({ isLoading:true })

    var provider = new firebase.auth.GithubAuthProvider();
 provider.addScope('gist');
 firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a GitHub Access Token.
   var token = result.credential.accessToken;
   console.log('token',token)
   // The signed-in user info.
   var user = result.user;
   console.log('user',user)

 }).catch(function(error) {
   console.log(error)
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // The email of the user's account used.
   var email = error.email;
   // The firebase.auth.AuthCredential type that was used.
   var credential = error.credential;
   if (errorCode === 'auth/account-exists-with-different-credential') {
     alert('You have signed up with a different provider for that email.');
     // Handle linking here if your app allows it.
   } else {
     console.error(error);
   }
 });




    setTimeout(() => {
      this.setState({ isLoading:false })
      
    }, 5000);

  }
  render() {
    if(this.state.isSignedIn)  
      return <HomePage/>
    else return(
      <Container fluid>
      <Row className="Login d-flex justify-content-center align-items-center ">
        <div
          className="loginBut"
          disabled={this.state.isLoading}
          onClick={()=>this.onLogIn()}
          >
            {this.state.isLoading ? 'Loading…' : 'Click to load'}
        </div>
      </Row>
      </Container>
    
    )
  }
}

export default App;

{/* <StyledFirebaseAuth
uiConfig={this.uiConfig}
firebaseAuth={firebase.auth()}
/> */}

{/* <Container fluid>
<Row className="Login d-flex justify-content-center align-items-center ">
  <div
    className="loginBut"
    disabled={this.state.isLoading}
    onClick={()=>this.onLogIn()}
    >
      {this.state.isLoading ? 'Loading…' : 'Click to load'}
  </div>
</Row>
</Container> */}