import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import { Container, Row, Col, Button, Card, Modal,Form } from 'react-bootstrap'

let people = []
// let people = [
//     {firstName: 'Elson', lastName: 'Correia', info: {age: 24}},
//     {firstName: 'John', lastName: 'Doe', info: {age: 18}},
//     {firstName: 'Jane', lastName: 'Doe', info: {age: 34}},
//     {firstName: 'Maria', lastName: 'Carvalho', info: {age: 22}},
//     {firstName: 'Kelly', lastName: 'Correia', info:{age: 23}},
//     {firstName: 'Don', lastName: 'Quichote', info: {age: 39}},
//     {firstName: 'Marcus', lastName: 'Correia', info: {age: 0}},
//     {firstName: 'Bruno', lastName: 'Gonzales', info: {age: 25}},
//     {firstName: 'Alonzo', lastName: 'Correia', info: {age: 44}}
//   ]

class HomePage extends React.Component {
    state={ newProject:false }

    componentDidMount() {
        console.log(firebase.auth())
    }

    renderPerson = (person, idx) => {
        return (
            <li key={idx}>
              <b>{person.firstName} {person.lastName}</b> (<span>{person.info.age}</span>)
            </li>
        );
      }

    render() {
      return (
        <Container>
            <Row>
                <Button onClick={()=> firebase.auth().signOut()}>logout</Button>
            </Row>
            <Row>
                <Col>
                <Row className="justify-content-center">
                    <Modal show={this.state.newProject} onHide={()=>this.setState({newProject:false})}>
                    <Modal.Header closeButton>
                    <Modal.Title>Enter Project Name</Modal.Title>
                    </Modal.Header>
                    <Form style={{paddingInline:50,padding:20}}>
                        <Form.Control type="txt"/>
                    </Form>
                    <Modal.Footer>
                  
                    <Button variant="primary" onClick={()=>this.setState({newProject:false})}>
                       Next
                    </Button>
                    </Modal.Footer>
                    </Modal>
    
                    <Card style={{ width: '18rem' }} className="text-center" onClick={()=>this.setState({newProject:true})}>
                        <Card.Body >
                            <Card.Title style={{ fontSize:100,color:'#36454F' }}>+</Card.Title>
                            <Card.Title>Create a new Project</Card.Title>
                        
                          
                        </Card.Body>
                    </Card>
      
                  
                </Row>
                <Row className="justify-content-center">
                  
                    <FlatList
                        list={people}
                        renderItem={this.renderPerson}
                        renderWhenEmpty={() => <div style={{paddingTop:100}}>
                            Project List is empty!
                            </div>}
                        sortBy={["firstName", {key: "lastName", descending: true}]}
                        groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
                    />
                   
                  
                </Row>
                </Col>
            </Row>
          
  
        </Container>
      );
    }
}
export default HomePage