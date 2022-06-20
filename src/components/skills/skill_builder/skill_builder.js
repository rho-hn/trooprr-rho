import React, { Component } from 'react';
import SkillBuilderHeader from '../navbar/skillbuilderHeader';
import { CopyOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Button, Row, message, Spin } from 'antd';
import Modal from "./createSkillModal/modal";
import EditModal from "./updateSkillModal/modal";
import "./skill_builder.css"
import {updateSkill,getAllSkillService,getCustomSKill,getCustomSKillNodes,getNodeOperation,deleteSkill} from "./skillBuilderActions"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


import SkillEditModal from "./skilEditModal.js"


class SkillBuilder extends Component {
	constructor(){
		super()
		this.state = {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      editNodeModal:false,
      currentNode:{},
      parent:{},
      createNodeIndex:"",
      skillName: '',
      editSkill:false,
      errNodeCount:0,
      loading:false
    }

    this.copyNodeKey=this.copyNodeKey.bind(this)
	}
 
componentDidMount() {
  this.setState({loading:true})
   let skill_id=this.props.match.params.skill_id;
   let wId= this.props.match.params.wId;
   let promiseArray=[]
   if(!this.props.skill||this.props.match.params.skill_id!==this.props.skill._id){
    promiseArray.push(this.props.getCustomSKill(wId,skill_id))
   }
 
   promiseArray.push(this.props.getCustomSKillNodes(wId,skill_id))

   Promise.all(promiseArray).then(data=>{
    this.setState({loading:false})

   })
}

openAddActionModal = (node,index) => {
   this.props.getAllSkillService().then(services=>{
     this.setState({
      parent:node,createNodeIndex: index+1,visible: true,
      });
    }
  )
};

closeAddActionModal = () => {
    this.setState({
      parent:{},
      createNodeIndex:"",
       visible: false,
    });
  };

getNodes = () => {
    let arr=[]  
    let errNodeCount=0
    let nodes=Array.from(this.props.skillNodes)
    let rootNodeIndex = nodes.findIndex(item => item.is_root)
    let index = rootNodeIndex
    // console.log(index)
    while(index > -1){
      // console.log(index)
      let node=nodes[index]
      // console.log(node)

      arr.push(node) 

      if(node.validation && node.validation.status=="inValid"){
        errNodeCount= errNodeCount+1
      }
     
       nodes.splice(index,1)
      index = nodes.findIndex(item => item.parent_id && item.parent_id.toString() === node._id.toString())
  }
  return{arr:arr,errNodeCount:errNodeCount}
  // console.log(arr)

}
  
editNodeModal = () => {
         this.setState({editNodeModal: !this.state.editNodeModal})
  }
    
 editNode = (node,index) => {
        this.setState({currentNode:node,currentNodeIndex:index})
        this.props.getNodeOperation(node.workspace_Id,node.skill_id,node.operation).then(operation => {
        this.editNodeModal()
        })
     }

updateSkill=(data)=>{

  let skill_id=this.props.match.params.skill_id;
  let wId= this.props.match.params.wId;
  this.props.updateSkill(wId,skill_id,data).then(res=>{

      if(res.data.success){

      }else{



        if(typeof(res.data.error)=="string"){
          message.error(res.data.error)

        }else{
          message.error("Error updating skill")
        }
      }


  })
}

deleteCurrentSkill=()=>{
 let skill_id=this.props.match.params.skill_id;
  let wId= this.props.match.params.wId;
  this.props.deleteSkill(wId,skill_id).then(res=>{
      if(res.data.success){
          this.props.history.push(`/${wId}/workflow`)

      }



  })

}

copyNodeKey(id) {

  var elememt = document.getElementById(id);


  elememt.select();
  document.execCommand("Copy");
   
}

editSkillModal=()=>{
this.setState({editSkill:!this.state.editSkill})

}
	render() {
     let nodesInfo = this.getNodes()
    let  errNodeCount=nodesInfo.errNodeCount
    let nodes=nodesInfo.arr
     // let skillName = {(skillNodes.length) ? skillNodes.params.skillData.skillName : ''};
    // console.log(this.getNodes())
		return (
          <React.Fragment>     {this.state.loading? <div style={{height:"100vh",width:"100vw",display:"flex",alignItems:"center" ,justifyContent:"center"}}><Spin size="large" /></div>:
      <React.Fragment>
              
              <SkillBuilderHeader param1 = {this.props.skill.name}   data={[{name:this.props.skill.name,url:"/"+this.props.match.params.wId+"/skill/"+this.props.match.params.skill_id+"/skillbuilder"}] }   workspace_Id={this.props.match.params.wId} skill={this.props.skill} updateSkill={this.updateSkill} openSkillEditModal={this.editSkillModal} deleteSkill={this.deleteCurrentSkill}/>
                 <div className="skill_builder_container column_flex">
  {errNodeCount>0&&<div className="row_flex justify_center"><div className="nodes_error_info row_flex align_center"><WarningOutlined className="error_icon" />

  <div className="text">We found total {errNodeCount} error actions.</div></div></div>}
                    <div style={{display:'flex', justifyContent: 'center' ,flexFlow:"column" ,alignItems:"center", padding: '24px' } }>
                      {nodes.map((node,index) => {
                          return (
                            <div key={node._id} >


                        
                                        <Card className={"node_card_container " + (node.validation && node.validation.status=="inValid" ?"node_card_error":"")} 
                                       title={<Row className="column_flex node_title_container" ><div className="row_flex align_center"><div className="node_card_title">{node.name}</div>{node.validation && node.validation.status=="inValid"&& <div className="node_error_box">Error</div>}</div>
                                       <div className="node_card_sub_title row_flex align_center">

                                       <CopyOutlined
                                         onClick={()=>this.copyNodeKey(node.key)}
                                         style={{cursor:"pointer",marginRight:"4px",fontSize: "14px"}} />
                                           {/* <i className="material-icons" onClick={()=>this.copyNodeKey(node.key)} style={{cursor:"pointer",marginRight:"4px",fontSize: "14px"}}> file_copy </i> */}
                                            Key:
                                           <input type="text" id={node.key} className="copy_key" value={node.key} name="copy_key"  readOnly/>
                                          
                                            </div>
                                       </Row> }  
                                        extra={<Button    className="node_edit_btn" type="secondary" 
                                        onClick={()=>this.editNode(node,index)}>Edit</Button>}>
                                        <Row type="flex" justify="center">{node.desc} </Row>
                                        </Card>
                                    
                                      <Row  className="column_flex align_center justify_center"  >
                                           <div className="nodes_connection_line"></div>

                                  {index==(nodes.length-1)  ? <div className="add_node_btn column_flex align_center" onClick={()=>this.openAddActionModal(node,index)} 
                                > <PlusCircleOutlined style={{fontSize:"20px"}} />
                            
                           <div   style={{fontSize:"14px"}}>Add Action</div> </div>  : 
                             <PlusCircleOutlined
                               className="add_node_btn"
                               onClick={()=>this.openAddActionModal(node,index)} /> 
                                             
                                  }
                                {index!==(nodes.length-1) && 
                                           <div className="nodes_connection_line"></div>}
                                           </Row >
                              </div>
                          );
                          })
                        }
                    </div>
                    
                 </div>
                { this.state.editNodeModal && <EditModal visible = {this.state.editNodeModal} closeModal = {this.editNodeModal}  openModal = {this.openEditNodeModal}  currentNode = {this.state.currentNode} nodes = {nodes} currentNodeIndex = {this.state.currentNodeIndex}></EditModal>}
                { this.state.visible && <Modal visible = {this.state.visible} closeModal = {this.closeAddActionModal} nodes = {nodes}  openModal = {this.openAddActionModal}  parent = {this.state.parent}   createNodeIndex={this.state.createNodeIndex}></Modal>}

                  { this.state.editSkill && <SkillEditModal visible = {this.state.editSkill}   modalToggle = {this.editSkillModal}   skill={this.props.skill}/ >}
                  </React.Fragment>}</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
  //   console.log(state)
    return {
    skill:state.skill_builder.currentSkill,
    skillNodes:state.skill_builder.currentSkillNodes
  }};
export default withRouter(connect(mapStateToProps , {updateSkill,getAllSkillService,getCustomSKill,getCustomSKillNodes,getNodeOperation,deleteSkill})( SkillBuilder )); 
