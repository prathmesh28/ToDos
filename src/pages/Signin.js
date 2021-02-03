import React from 'react';
// import './App.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import firebase from 'firebase'
import Firebase from '../firebase'


class Signin extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      isSignedIn: false
    }
  }



  componentDidMount = () => {
 
  }

  onLogIn = () => {
console.log(this.state.isLoading)
    this.setState({ isLoading:true })

    var provider = new firebase.auth.GithubAuthProvider();
 provider.addScope('gist');
 Firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a GitHub Access Token.
   var token = result.credential.accessToken;
   console.log('token check this:',token)
   

   firebase.database().ref('/Users/' + result.user.uid ).set({
    token:token
})
.then((doc) => { 
    console.log(doc)

})
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
    return(
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

export default Signin;

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