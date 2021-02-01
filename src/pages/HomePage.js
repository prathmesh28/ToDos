import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import _uniqueId from 'lodash/uniqueId';

import { withRouter } from 'react-router-dom'
import { Container,Accordion, Row, Col, Button, Card, Modal,Form } from 'react-bootstrap'
import './Homepage.css'


class HomePage extends React.Component {
    state={ 
        newProject:false,
        ProjectName:'',
        data: null,
        readError: null,
    }


    async componentDidMount() {
        console.log(firebase.auth().currentUser)

        this.setState({ readError: null });
        try {
          let id = firebase.auth().currentUser.uid
  
          firebase.database().ref("Users/"+ id).on("value", snapshot => {
            let data = [];
            snapshot.forEach((snap) => {
              data.push(snap.val());
            });
            this.setState({ data });
          });
        } catch (error) {
          this.setState({ readError: error.message });
        }
      }

    addProject = () =>{
        console.log('hi')
        if(this.state.ProjectName!==''){
            console.log('iii')
            let id = firebase.auth().currentUser.uid
            let proId = _uniqueId(this.state.ProjectName + '-' )
            let data = {
                Pname:this.state.ProjectName,
                date:new Date().toString(),
                todos:"",
                pId:proId

            }
            console.log(data)

            firebase.database().ref('/Users/' + id + '/' + proId ).set({
                data
            })
            .then((doc) => { 
                console.log(doc)
            this.setState({newProject:false, ProjectName:''})
               this.props.history.push(`/todos/${proId}`)

            })

        }
    } 

    renderPerson = (itm, idx) => {
        return (
           
            <Accordion>
            <Card>
             
                <Accordion.Toggle as={Card.Header} eventKey="0">
                {itm.data.Pname} <span style={{fontStyle:'italic'}} className="float-right">{itm.data.date.substr(0,21)}</span>
                </Accordion.Toggle>
            
              <Accordion.Collapse eventKey="0">
                <Card.Body onClick={()=> this.props.history.push(`/todos/${itm.data.pId}`)}>{itm.data.pId}Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
            </Accordion>

           
        );
      }
    
    render() {
      return (
        <Container>
            {/* <Row>
                <Button onClick={()=> firebase.auth().signOut()}>logout</Button>
            </Row> */}
            <div style={{height:100}}></div>
            <Row>
                <Col>
                <Row>
                    <Col>
                   <h1> Hi {firebase.auth().currentUser.displayName} </h1>
                    </Col>
                    <Col  xs={4}>
                  
                    
    
                    <Card 
                        style={{ 
                            width: '18rem', 
                            marginRight:20
                        }} 
                        className="Card text-center "  onClick={()=>this.setState({newProject:true})}>
                        <Card.Body >
                            <Card.Title style={{ fontSize:100,color:'#36454F' }}>+</Card.Title>
                            <Card.Title>Create a new Project</Card.Title>
                        
                          
                        </Card.Body>
                    </Card>

                    <Modal show={this.state.newProject} onHide={()=>this.setState({newProject:false, ProjectName:''})}>
                    <Modal.Header closeButton>
                    <Modal.Title>Enter Project Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control type="txt" 
                            // onKeyDown = { (e) => {  
                            //     if (e.key === 'Enter') {
                            //         this.addProject()
                            //     }
                                
                            // }} 
                            defaultValue={this.state.ProjectName} onChange={e => {this.setState({ ProjectName:e.target.value })}} />
                    </Modal.Body>
                    <Modal.Footer>
                  
                
                    <Button variant="primary" onClick={()=>this.addProject()}>
                       Next
                    </Button>
                    </Modal.Footer>
                    </Modal>
      
                    </Col>
                </Row>
                <Row className="justify-content-center" style={{marginTop:30}}>
                    
                    <Col>
                    <Row style={{marginBottom:10}}>
                        <Col style={{fontSize:30}}  xs={6}><b>All Projects</b></Col>
                        
                        <Col><span style={{fontSize:20,fontStyle:'italic',position:'absolute',bottom:0,right:0}}>Sortby: Name | Date</span></Col>
                    </Row>
                    <Row>
                    <FlatList
                        list={this.state.data}
                        style={{marginTop:20}}
                        renderItem={this.renderPerson}
                        renderWhenEmpty={() => <div style={{paddingTop:100}}>
                            Project List is empty!
                            </div>}
                        displayRow
                        
                      //  sortBy={["firstName", {key: "lastName", descending: true}]}
                     //   groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
                    />
                   </Row>
                  </Col>
                </Row>
                </Col>
            </Row>
          
  
        </Container>
      );
    }
}
export default withRouter(HomePage)