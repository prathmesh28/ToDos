import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import _uniqueId from 'lodash/uniqueId';
import { Container, Row, Col, Button, Card, Modal,Form ,OverlayTrigger,Tooltip,Spinner} from 'react-bootstrap'
import {withRouter} from 'react-router-dom';
import TimeAgo from 'react-timeago'
import './TodoApp.css'

let id
let pId
const db = firebase.database()
const auth = firebase.auth()

class Todos extends React.Component {
  
    state={ 
        ProjectName:'',
        addTodo:'',
        data: [],
        readError: null,
        edit:false,
        todoid:null,
        editName:'',
        loading:false
    }

    async componentDidMount () {
        this.setState({loading:true,readError: null})
        pId = this.props.match.params.id
         
        try {
            id = auth.currentUser.uid
   
            db.ref("Users/"+ id +'/projects/' +pId + '/data/').on("value", snapshot => {

                this.setState({ProjectName:snapshot.val().Pname,data:snapshot.val().todos})
               
            })
        } catch (error) {
           this.setState({ readError: error.message,loading:false });
        }
        this.setState({loading:false})
    }

  
    renderPerson = (itm, idx) => {
        return (
            <Card>
                <Card.Header style={{display:'flex',justifyContent:'space-between'}}>
                    <input type="checkbox" 
                    id="checkid"
                    style={{
                        margin:10,
                        width:20,height:20
                    }}  
                    checked={itm.status}
                    onChange={(event)=>{

                        db.ref('/Users/' + id +'/projects/' + pId +'/data/todos/'+idx ).update({
                            status:event.target.checked
                        })
                        .then((doc) => { 
                            // console.log(doc)
            
                        })
                    }} /> 

                    <Button variant="light" 
                        style={{color:"#e12a3a",backgroundColor:'transparent',fontSize:20}} 
                        onClick={async() => {
                            var r = await window.confirm("Confirm delete?");
                            if (r === true) {
                                let allTodos =[]
                                allTodos = this.state.data
                                allTodos.splice(idx, 1)

                                db.ref('/Users/' + id +'/projects/' + pId +'/data/' ).update({
                                    todos:allTodos
                                })
                                .then((doc) => { 
                                    // console.log(doc)
                                })
                                
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
                        <label style={{fontSize:20,  display:'inline-block',verticalAlign:'middle'}}>
                            {itm.todo}
                        </label>
                    </Card.Body>

                </OverlayTrigger>

                <small className="text-muted ">&nbsp; Last updated <TimeAgo date={itm.Udate}  /></small>

                <Card.Footer>
                    <Row>
                        <Col style={{textAlign:'center'}} className="cursor"
                            onClick={()=>this.setState({edit:true,todoid:idx,addTodo:itm.todo,editName:'todo'})}>	&#9999;
                        </Col>
                    </Row>
                </Card.Footer>
            
            </Card>
        )
    }

    addTodos = () =>{

        if(this.state.addTodo!==''){

            id = auth.currentUser.uid

            pId = this.props.match.params.id

            let proId = _uniqueId(new Date().valueOf()+'-' )
            
            let data = {
                todo:this.state.addTodo,
                Cdate:new Date().toString(),
                Udate:new Date().toString(),
                status:false,
                todoId:proId

            }

            let allTodos =[]
            if(this.state.data){
                allTodos = this.state.data
            }
            allTodos.push(data)

            this.setState({ addTodo:''})

            db.ref('/Users/' + id +'/projects/' + pId +'/data/' ).update({
                todos:allTodos
            })
            .then((doc) => { 
                // console.log(doc)
           })
        }
    } 
  

    render() {
        if(this.state.loading)
            return <Spinner animation="border"  />
        else return (
            <div className="Home">
                <Container >
                   <Row>
                        <Col lg={2} md={4} s={12}>
                            <span className="cursor" style={{fontSize:"10vw",color:'#36454F'}} 
                                onClick={()=> this.props.history.push('/home')}>
                                &#8592; 
                            </span>
                        </Col>
                        <Col md={8} className='my-auto'>
                            <span style={{fontSize:50,color:'#36454F',}} >{this.state.ProjectName} </span>
                            <span onClick={()=>this.setState({edit:true,addTodo:this.state.ProjectName,editName:'Project name'})} >&#9999;</span>
                        </Col>
                    </Row>
                    <Row style={{padding:40}}>
                        <Col xs={12} md={10}>
                            <Form.Control as="textarea" rows={1}
                                style={{display:this.state.edit?'none':'block',marginBottom:10}}
                                placeholder="New todo..."
                                defaultValue={this.state.addTodo} 
                                onChange={e => {this.setState({ addTodo:e.target.value })}} 
                                value={this.state.addTodo} 
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" onClick={()=>this.addTodos()}>
                                ADD
                            </Button> 
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10}}>
                        <Col style={{fontSize:25}}  ><b>All Todos </b></Col>    
                    </Row>
                    {/* ({this.state.data.length}) */}
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
                    <Button variant="primary" 
                        onClick={()=>{
                        db.ref('/Users/' + id +'/projects/' + pId +'/data/todos/'+this.state.todoid ).update({
                            todo:this.state.addTodo,
                            Udate:new Date().toString()
                        })
                        .then((doc) => { 
                            // console.log(doc)
                            this.setState({edit:false,addTodo:''})
                        })
                    }}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        )
    }
}
export default  withRouter(Todos)