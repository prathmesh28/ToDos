import React from "react"
import firebase from '../firebase'
import FlatList from 'flatlist-react';
import _uniqueId from 'lodash/uniqueId';
import { Container,CardGroup, Row, Col, Button, Card, Modal,Form , Accordion} from 'react-bootstrap'
import {withRouter} from 'react-router-dom';
let id
let pId
class Todos extends React.Component {
  
    state={ 
       
        ProjectName:'',
        addTodo:'',
        data: [],
        readError: null,

    }


    componentDidMount() {
         pId = this.props.match.params.id

         this.setState({ readError: null });
         try {
           id = firebase.auth().currentUser.uid
   
           firebase.database().ref("Users/"+ id +'/' +pId + '/data/').on("value", snapshot => {
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
           
          
                  <Card.Body>
                  <label  for="checkid"  style={{fontSize:20,  display:'inline-block',verticalAlign:'middle'}}>

                     <input type="checkbox" 
                     id="checkid"
                 //    style="width:20px;height:20px;"
                     style={{marginInline:10,width:20,height:20}}  
                        checked={itm.status}
                         

                        onChange={(event)=>{
                            console.log(event.target.checked)
                            firebase.database().ref('/Users/' + id + '/' + pId +'/data/todos/'+idx ).update({
                                status:event.target.checked
                            })
                            .then((doc) => { 
                                console.log(doc)
                
                            })
                           

                        }} /> 
                          
             
                   
                        {itm.todo}
                </label>
                </Card.Body>
            </Card>

      
        )
      }

      addTodos = () =>{
        console.log('hi')
        if(this.state.addTodo!==''){
            console.log('iii')

            let id = firebase.auth().currentUser.uid

            let pId = this.props.match.params.id

            let proId = _uniqueId('Todos-' )
            
            let data = {
                todo:this.state.addTodo,
                Cdate:new Date().toString(),
                Udate:new Date().toString(),
                status:false,
                todoId:proId

            }
            console.log(data)

            let allTodos = this.state.data
            allTodos.push(data)
            console.log(allTodos)

            firebase.database().ref('/Users/' + id + '/' + pId +'/data/' ).update({
                todos:allTodos
            })
            .then((doc) => { 
                console.log(doc)
            this.setState({ addTodo:''})

            })

        }
    } 

    render() {
      return (
        <Container >
       
     
           <Row>
                <Col xs={2}>
                    <span style={{fontSize:100,color:'#36454F'}} 
                        onClick={()=> this.props.history.push('/home')}>
                    &#8592; </span>
                </Col>
                <Col className='my-auto'>
                    <span style={{fontSize:50,color:'#36454F',}} >{this.state.ProjectName} </span>
                </Col>
           </Row>
           <Row style={{padding:40}}>
               <Col xs={10}>
           <Form.Control type="txt" 
                            // onKeyDown = { (e) => {  
                            //     if (e.key === 'Enter') {
                            //         this.addTodos()
                            //     }
                                
                            // }} 
                            placeholder="New todo..."
                            defaultValue={this.state.addTodo} 
                            onChange={e => {this.setState({ addTodo:e.target.value })}} 
                            />
                            </Col>
                            <Col>
                  <Button variant="primary" onClick={()=>this.addTodos()}>
                       ADD
                    </Button> 
                    </Col>
           </Row>
           <Row style={{marginBottom:10}}>
                        <Col style={{fontSize:25}}  xs={6}><b>All Todos</b></Col>
                        
                        <Col><span style={{fontSize:18,fontStyle:'italic',position:'absolute',bottom:0,right:0}}>Sortby: Name | Date</span></Col>
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
                        
                      //  sortBy={["firstName", {key: "lastName", descending: true}]}
                     //   groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
                    />
               </Col>
           </Row>
           
           
               
    
  
        </Container>
      );
    }
}
export default  withRouter(Todos)