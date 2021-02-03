import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import _uniqueId from 'lodash/uniqueId';
import { Container,CardGroup, Row, Col, Button, Card, Modal,Form , Accordion,OverlayTrigger,Tooltip} from 'react-bootstrap'
import {withRouter} from 'react-router-dom';
import TimeAgo from 'react-timeago'
import './TodoApp.css'

const { Octokit } = require("@octokit/core");
let id
let pId

// const octokit = new Octokit({
//             auth: "b9b2095745dd781e86c4c5bfce33e64b39ae95a0",
//           });


class Todos extends React.Component {
  
    state={ 
       
        ProjectName:'',
        addTodo:'',
        data: null,
        readError: null,
        edit:false,
        todoid:null,
        export:false,
        fileName:'',
        editName:''

    }


    async componentDidMount () {
        console.log(firebase.auth())

//          const { headers } = await octokit.request('/')

//  console.log(`Scopes: ${headers['x-oauth-scopes']}`)
          
//           octokit
//             .request("POST /gists", {
//               files: {
//                 "newqweasdtest.txt": {
//                   content: "testfirstexample",
//                 },
//               },
//             })
//             .then(console.log, console.log);




         pId = this.props.match.params.id

         this.setState({ readError: null });
         try {
           id = firebase.auth().currentUser.uid
   
           firebase.database().ref("Users/"+ id +'/projects/' +pId + '/data/').on("value", snapshot => {
            this.setState({ProjectName:snapshot.val().Pname})

            if(snapshot.val())
                this.setState({ data:snapshot.val().todos })
           });
         } catch (error) {
           this.setState({ readError: error.message });
         }
    }

    renderPerson = (itm, idx) => {
        return (
           
    
                <Card>
                    <Card.Header style={{display:'flex',justifyContent:'space-between'}}>
                    <input type="checkbox" 
                     id="checkid"
                     style={{
                    //     verticalAlign:'middle',
                        // alignSelf:'center',
                         //marginInline:10,
                         margin:10,
                         width:20,height:20}}  
                        checked={itm.status}
                         

                        onChange={(event)=>{
                            console.log(event.target.checked)
                            firebase.database().ref('/Users/' + id +'/projects/' + pId +'/data/todos/'+idx ).update({
                                status:event.target.checked
                            })
                            .then((doc) => { 
                                console.log(doc)
                
                            })
                           

                        }} /> 
                        {/* <Button variant="light" size="sm">edit</Button> */}
                        <Button variant="light" style={{color:"#e12a3a",backgroundColor:'transparent',fontSize:20}} 
                            onClick={async() => {
                                var r = await window.confirm("Confirm delete?");
                                if (r === true) {
                                  let userRef = firebase.database().ref('/Users/' + id +'/projects/' + pId +'/data/todos/'+idx )
                                  userRef.remove()
                                  console.log(userRef)
                                }

                              }}>
                                  	&#10007;  
                        </Button>

                    </Card.Header>
           
                    <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            overlay={ (props) => <Tooltip id="button-tooltip" {...props}>
               Created on {itm.Cdate.substr(0,21)}
            </Tooltip>
            }
          >
                  <Card.Body>
                  <label   style={{fontSize:20,  display:'inline-block',verticalAlign:'middle'}}>

                        {itm.todo}
                </label>
                </Card.Body>

                </OverlayTrigger>

                <small className="text-muted ">&nbsp; Last updated <TimeAgo date={itm.Udate}  /></small>

                <Card.Footer>
                    <Row>
                    <Col style={{textAlign:'center'}} onClick={()=>this.setState({edit:true,todoid:idx,addTodo:itm.todo,editName:'todo'})}>	&#9999;</Col>
                    {/* <Col style={{textAlign:'center'}} onClick={()=>this.setState({export:true})}>Export</Col> */}
                    </Row>
                </Card.Footer>
              
            </Card>
      
        )
      }

      addTodos = () =>{
        console.log('hi')
        if(this.state.addTodo!==''){
            console.log('iii')

            id = firebase.auth().currentUser.uid

             pId = this.props.match.params.id

            let proId = _uniqueId('Todos-' )
            
            let data = {
                todo:this.state.addTodo,
                Cdate:new Date().toString(),
                Udate:new Date().toString(),
                status:false,
                todoId:proId

            }
            this.setState({ addTodo:''})
            console.log(data)
            let allTodos =[]
            if(this.state.data){
                allTodos = this.state.data
            }
            allTodos.push(data)
         

            firebase.database().ref('/Users/' + id +'/projects/' + pId +'/data/' ).update({
                todos:allTodos
            })
            .then((doc) => { 
                console.log(doc)
            

           })

        }
    } 
  

    render() {
      return (
          <div className="Home">
        <Container >
       
     
           <Row>
                <Col xs={2}>
                    <span style={{fontSize:100,color:'#36454F'}} 
                        onClick={()=> this.props.history.push('/home')}>
                    &#8592; </span>
                </Col>
                <Col className='my-auto'>
                    <span style={{fontSize:50,color:'#36454F',}} >{this.state.ProjectName} </span>
                    <span onClick={()=>this.setState({edit:true,addTodo:this.state.ProjectName,editName:'Project name'})} >&#9999;</span>
                </Col>
           </Row>
           <Row style={{padding:40}}>
               <Col xs={10}>
               <Form.Control as="textarea" rows={1}
                          
                            style={{display:this.state.edit?'none':'block'}}
                            placeholder="New todo..."
                            defaultValue={this.state.addTodo} 
                            onChange={e => {this.setState({ addTodo:e.target.value })}} 
                            value={this.state.addTodo} 
                            />
                            </Col>
                            <Col>
                  <Button variant="primary" onClick={()=>this.addTodos()}>
                       ADD
                    </Button> 
                    </Col>
           </Row>
           <Row style={{marginBottom:10}}>
                        <Col style={{fontSize:25}}  ><b>All Todos</b></Col>
                        
            </Row>
               
           <Row style={{paddingTop:20,paddingBottom:80}}>
               <Col>
               <FlatList
                    list={this.state.data}
                    
                    renderItem={this.renderPerson}
                    renderWhenEmpty={() => <div style={{paddingTop:100}}>
                        Project List is empty!
                        </div>}
                    displayGrid
                />
               </Col>
           </Row>
           
           
               
    

           <Modal show={this.state.edit} onHide={()=>this.setState({edit:false})}  backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit {this.state.editName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Control as="textarea" rows={1}
                            // onKeyDown = { (e) => {  
                            //     if (e.key === 'Enter') {
                            //         this.addTodos()
                            //     }
                                
                            // }} 
                            
                            placeholder={"Edit " + this.state.editName + " ..."}
                            defaultValue={this.state.addTodo} 
                            onChange={e => {this.setState({ addTodo:e.target.value })}} 
                            value={this.state.addTodo} 
                            />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>this.setState({edit:false})}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
               firebase.database().ref('/Users/' + id +'/projects/' + pId +'/data/todos/'+this.state.todoid ).update({
                todo:this.state.addTodo,
                Udate:new Date().toString()
            })
            .then((doc) => { 
                console.log(doc)
                this.setState({edit:false,addTodo:''})
            

           })
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>






      
  
        </Container>
        </div>
      );
    }
}
export default  withRouter(Todos)