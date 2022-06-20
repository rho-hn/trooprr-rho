import React,{useState,useEffect}from 'react'
import {Input, Button,Modal,Popconfirm, message} from 'antd';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {updateCardSkills,deleteCardSkill} from "./skill_builder/steps/CardActions"
const { TextArea } = Input;

const EditSkill = (props) => {
  
    const [skillName,setSkillName]=useState({name:"",desc:""})
useEffect(()=>{
setSkillName({name:props.cardInfo.name,desc:props.cardInfo.desc})

},[])
   
const onChange=(e)=>{
    const {name, value} = e.target
setSkillName({...skillName,[name]:value})
}
const onSubmit=()=>{
// console.log(skillName);
let data={}
data._id=props.cardInfo._id
data.name=skillName.name
data.desc=skillName.desc
data.EditOnly=true
props.updateCardSkills(data).then(res=>{
    props.closeModal()
}).catch(e=>{
    props.closeModal()
    console.error(e)
})


}
const onDelete=()=>{
    // console.log("comming");
    
props.deleteCardSkill(props.cardInfo._id).then(res=>{
    props.closeModal();
    message.success('Report deleted');

}).catch(e=>{
    // console.log(e);
    console.error(e)
    
})


}

function cancel(e) {
    // console.log(e);
    // message.error('Click on No');
  }

    return (
        
 <Modal
 title="Edit Report"
 visible={props.visible}
 footer={null}
onCancel={props.closeModal}
 >
 
     <label>Report Name</label>
     <Input required
                      name="name"
                      placeholder="Report Name"
                      onChange={onChange}
                  defaultValue={props.cardInfo.name}
                
                />
      <br/>
      <br/>
      <label htmlFor="">Description</label>
      <br/>
    <TextArea required
                name="desc"
                placeholder="Report Description"
            onChange={onChange}
            defaultValue={props.cardInfo.desc}
           
          />
    
          <div style={{ marginBottom: 2 ,display:"flex",justifyContent:"space-between",marginTop:"24px" }}>
                            <Popconfirm
                        title="Are you sure you want to delete this report permanently?"
                        onConfirm={onDelete}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <Button type="danger"  style={{marginLeft:"10px"}}>
                    Delete
                    </Button>
                    </Popconfirm>

                    <Button  type="primary" onClick={onSubmit}>
                      Update
                    </Button>
                </div>
     
      </Modal>
    )
}

export default withRouter(
    connect(null, {
        updateCardSkills,deleteCardSkill
    })(EditSkill)
  );

