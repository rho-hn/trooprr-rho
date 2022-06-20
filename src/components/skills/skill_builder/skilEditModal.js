import  { Modal, Button,Row} from "antd";
import React, { Component } from 'react';
import {connect} from "react-redux";
import {updateSkill} from "./skillBuilderActions";
import { withRouter } from "react-router-dom";



class EditSkillModal extends Component {
    constructor(props){
	    	super(props)
		    this.state = {
                name:this.props.skill.name,
                desc:this.props.skill.desc,
                updating:false,
                error:""
          
    };
  }
  

  onChange = (e) => {
    //   console.log(e.target.value)
    //   [e.target.name]
     this.setState({[e.target.name]: e.target.value});
  }



  onSubmit=()=>{
    let skill_id=this.props.skill._id;
    let wId= this.props.skill.workspace_id;

    let data={
        name:this.state.name,
        desc:this.state.desc, 
    }

    if(data.name.trim()){
        this.setState({updating:true ,error:""})
        this.props.updateSkill(wId,skill_id,data).then(res=>{
            this.props.modalToggle()
            this.setState({updating:false})
      
        })
    }else{

        this.setState({error:"Skill name is required"})
    }
 

}
    
  render() {
    //   console.log("State from setTriggerModal",this.state);
      const { isLoading} = this.state;
    return (
     <Modal
          title="Edit Skill"
          visible={this.props.visible}
        footer={null}
          confirmLoading={isLoading}
          onCancel={this.props.modalToggle}>

                 <div  style={{marginBottom:"10px" }}>

                   <div style={{ fontSize: "14px ",fontWeight: 700,marginBottom:"14px"}} >Name</div>
     <input type = "text" className = "cutsom_input" onChange={this.onChange} name="name" value={this.state.name} placeholder={"Enter skill name"}   autoComplete="off"/>
                 </div>
    <div  style={{marginBottom:"10px" }}>
     <div style={{ fontSize: "14px ",fontWeight: 700,marginBottom:"14px"}} >Skill Description</div>
    <textarea className = "custom_text_area" style = {{width:"100%"}} name={"desc"} onChange={this.onChange}  value={this.state.desc} placeholder={"Enter skill descreption"}/>
    </div>

       {this.state.error&& <div style={	{color:"rgb(152,0,0)",fontSize:" 14px"}}>{this.state.error}</div>}
        <Row type="flex" justify="end">
        <Button type="primary" onClick={this.onSubmit} loading={this.state.updating}>Update</Button>
        </Row>
        
      </Modal>
    );
  }
}




export default withRouter(connect(null, {updateSkill

 })(EditSkillModal)); 

