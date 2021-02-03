import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import _uniqueId from 'lodash/uniqueId';
import { withRouter } from 'react-router-dom'
import { Container,Accordion, Row, Col, Button, Card, Modal,Form } from 'react-bootstrap'
import './TodoApp.css'
const { Octokit } = require("@octokit/core");

let id
const db = firebase.database()
const auth = firebase.auth()

class HomePage extends React.Component {
    state={ 
        newProject:false,
        ProjectName:'',
        data: [],
        Dsort:false,
        export:false,
        exportData:[],
        token:''
    }

    async componentDidMount() {
        id = auth.currentUser.uid
        

        try { 
           
            db.ref("Users/"+ id +'/projects/').on("value", snapshot => {
                let data = []
                if(snapshot.val()!==undefined || snapshot.val()!==null){
                    snapshot.forEach((snap) => {
                        data.push(snap.val())
                    })
                    this.setState({ data });
                }
            })
        }catch (error) {
            alert( error.message)
        }

    }

    addProject = () => {
        
        if( this.state.ProjectName !== ''){
            
            let proId = _uniqueId(this.state.ProjectName + '-' )
            let data = {
                Pname:this.state.ProjectName,
                date:new Date().valueOf(),
                todos:"",
                pId:proId
            }

            db.ref('/Users/' + id +'/projects/' + proId ).set({
                data
            })
            .then((doc) => { 
                this.setState({newProject:false, ProjectName:''})
                this.props.history.push(`/todos/${proId}`)
            })

        }
    } 

    deleteProject = async(pId) => {
        var r = await window.confirm("Confirm delete?");
        if (r === true) {
            let userRef = db.ref('/Users/' + id +'/projects/' + pId  )
            userRef.remove()
        } 
    }

    exportProject = async() => {
        // this.setState({ProjectName:this.state.ProjectName+".md"})
        let token
        await db.ref("Users/"+ id ).on("value", snapshot => {token=snapshot.val().token })
        const octokit = new Octokit({
            auth: token,
        })
        // console.log(this.state.ProjectName)

//                  const { headers } = await octokit.request('/')

//  console.log(`Scopes: ${headers['x-oauth-scopes']}`)
          let ProjectName = this.state.ProjectName+".md"
          let tempData = {
            ProjectName: {
content: `# ${ProjectName} <br />
**summary:** 3/4
- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request
                `,
              }
          }
          console.log(tempData)
          
        //   octokit
        //     .request("POST /gists", {
        //       files:  tempData ,
        //     })
        //     .then(console.log, console.log);
    }

    renderPerson = (itm, idx) => {
        return (
            <Accordion className="cursor" key={idx}>
                <Card className="shadow-sm ">
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        {itm.data.Pname}
                        <span style={{fontStyle:'italic'}} className="float-right">
                            {new Date(itm.data.date).toString().substr(0,21)}
                        </span>
                    </Accordion.Toggle>
            
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className="row" >
                            <Col onClick={()=> this.props.history.push(`/todos/${itm.data.pId}`)}>{itm.data.todos.length===1?itm.data.todos.length+' todo.':itm.data.todos.length+' todos.'}  &#9999;  </Col>
                            <Button variant="outline-light" 
                                style={{backgroundColor:"#ffdce0", color:"#24292e"}} 
                                onClick={()=>this.deleteProject(itm.data.pId)}>Delete
                            </Button> &nbsp;
                            <Button variant="outline-light" 
                                style={{backgroundColor:"#dcffe4", color:"#24292e"}}
                                onClick={()=>this.setState({export:true,ProjectName:itm.data.Pname,exportData:itm.data.todos})}>Export</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
    
    render() {
      return (
          <div  className="Home">
            <Container >
                <Row>
                    <Col>
                    <Row style={{padding:10,marginTop:50}}>
                        <Col lg={8} md={6} xs={12}>
                            <h1> Hi {auth.currentUser.displayName} </h1>
                            <Button onClick={()=> auth.signOut()} style={{bg:"#0366d6",borderRadius:50,marginTop:20}}>logout</Button>
                        </Col>
                        <Col lg={4} md={6} className="d-flex justify-content-center" xs={12}>
                            <Card  className=" text-center shadow rounded cursor"
                                style={{ 
                                    width: '80%', 
                                    marginTop:20,
                                }}
                                onClick={()=>this.setState({newProject:true})}>

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
                            <Form.Control type="txt" defaultValue={this.state.ProjectName} placeholder="Project name..." onChange={e => {this.setState({ ProjectName:e.target.value })}} />
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={()=>this.addProject()}>
                                Create
                            </Button>
                            </Modal.Footer>
                            </Modal>
      
                        </Col>
                    </Row>
                    <Row className="justify-content-center" style={{marginTop:30,padding:10}}>
                        <Col>
                            <Row style={{marginBottom:10}}>
                                <Col style={{fontSize:30}}  xs={6}><b>All Projects ({this.state.data.length})</b></Col> 
                                <Col>
                                    <span style={{fontSize:20,fontStyle:'italic',position:'absolute',bottom:0,right:0}}>Sortby: &nbsp;
                                    <span onClick={()=>this.setState({Dsort:false})} className="cursor">Name</span> | 
                                    <span onClick={()=>this.setState({Dsort:true})}  className="cursor">Date</span>&nbsp;</span>
                                </Col>
                            </Row>
                            <Row>
                                <FlatList
                                    list={this.state.data}
                                    style={{padding:10}}
                                    renderItem={this.renderPerson}
                                    renderWhenEmpty={() => <div style={{paddingTop:100}}>
                                        Project List is empty!
                                        </div>}
                                    displayRow
                                    sort={this.state.Dsort?{ by: [{key: "data.date"}] }:false}
                                />
                            </Row>

                            {/* Export popup */}
                            <Modal show={this.state.export} onHide={()=>this.setState({export:false})}  backdrop="static">
                            <Modal.Header closeButton>
                            <Modal.Title>Export as Gist</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div style={{padding:10}}><b>File Name: </b> <input type="txt" defaultValue={this.state.ProjectName} onChange={e => this.setState({ ProjectName:e.target.value })} /> .md
                                </div>
                            <Card>
                                <Card.Body>
                                <h2>{this.state.ProjectName}</h2>   
                                {this.state.exportData.length===0?<b>No todos to display.</b>:<>
                                <b>Summary:</b> {this.state.exportData.filter(itm => itm.status).length}/{this.state.exportData.length} todos completed.
                                <br/>
                                <h4>Pending</h4>
                                {
                                    this.state.exportData
                                    .filter(itm => !itm.status)
                                    .map((itm)=>{
                                               return <><input type="checkbox" checked={false}/> {itm.todo}<br/></>

                                       })
                                }
                                <br/>
                                <h4>completed</h4>
                                 {
                                       this.state.exportData
                                       .filter(itm => itm.status)
                                       .map((itm)=>{
                                                  return <><input type="checkbox" checked={true}/> {itm.todo}<br/></>
   
                                          })
                                }
                                </>}
                            </Card.Body>
                            </Card>

                                
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.setState({export:false})}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={()=>this.exportProject()}>
                                Save Changes
                            </Button>
                            </Modal.Footer>
                        </Modal>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </div>
      )
    }
}
export default withRouter(HomePage)