import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Modal, Spin, notification,Button,Checkbox } from 'antd';
import {withRouter} from 'react-router-dom';
import {getAllSlackUsers} from  "../../common/common_action"
import {getJiraUsers,addUserMapping,setJiraUsers,editUserMapping} from "../skills_action"
import {connect} from 'react-redux'
const { Option } = Select;
class UserMappingModal extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      selectedUserId:"",
      selectedJiraUserId:"",
      selectedJiraUserKey:"",
      loading:false,
      error:[],
      slackError:"",
      atlassianError:"",
      notify: true,
      
    }
  }
  
 
 componentDidMount(){
   
   if(this.props.isEdit){
     this.setState({selectedJiraUserId:this.props.mappeddata&&this.props.mappeddata.user_obj&&(this.props.mappeddata.user_obj.accountId||this.props.mappeddata.user_obj.name),selectedJiraUserKey:this.props.mappeddata&&this.props.mappeddata.user_obj&&(this.props.mappeddata.user_obj.key||this.props.mappeddata.user_obj.accountId),selectedUserId:this.props.mappeddata&&this.props.mappeddata.user_id&&this.props.mappeddata.user_id.user_id,loading:true})
   
  
     this.props.getJiraUsers(this.props.match.params.skill_id,this.props.mappeddata&&this.props.mappeddata.user_obj.displayName).then(res=>{
   this.setState({loading:false})
     })
   }
   this.props.getAllSlackUsers(this.props.match.params.wId)

 }
getUsers=()=>{
  return this.props.users.map(user=><Option key={user.user_id} value={user.user_id}>{(user.displayName || user.name || user.user_name || '') + " ("+user.email+")"}</Option>)
  //return this.props.users.map(user=><Option value={user.user_id}>{user.name || user.user_name || ''}</Option>)
}
sendNotification=(e)=>{
  this.setState({ notify : e.target.checked})
}

validate = () => {
  let slackError = "";
  let atlassianError = "";

  if(!this.state.selectedUserId){
    slackError = "Slack User cannot be empty"
  }
  if(!this.state.selectedJiraUserId){
    atlassianError = "Atlassian User cannot be empty"
  }


  if(slackError || atlassianError){
    this.setState({ slackError,atlassianError });
    return false;
  }

  return true;
}




onFormSubmit=(e)=>{
 e.preventDefault()
 const isvalid = this.validate();
 if(isvalid){
 let data=this.state;
if(this.props.isEdit){
  let errors=[]  
  let checkIsUserAlreadyExists=this.props.usermappings.find(usermapping=>(usermapping.user_id&&usermapping.user_id.user_id)===this.state.selectedUserId)  
  if(checkIsUserAlreadyExists&&checkIsUserAlreadyExists.user_id&&(this.props.mappeddata._id!==checkIsUserAlreadyExists._id))errors.push({type:"slack_user",text:`${checkIsUserAlreadyExists.user_id.displayName ||checkIsUserAlreadyExists.user_id.name} is already mapped.`})
 
  let checkJiraUserExists=this.props.usermappings.find((usermapping)=>usermapping.user_obj?(usermapping.user_obj.accountId||usermapping.user_obj.name)===this.state.selectedJiraUserId:false)
  if(checkJiraUserExists&&(this.props.mappeddata._id!==checkJiraUserExists._id))errors.push({type:"jira_user",text:`${ checkJiraUserExists.user_id.displayName||checkJiraUserExists.user_id.name} is already using this jira user`})
  this.setState({error:errors})
   data.skill_id=this.props.match.params.skill_id
   if(errors.length==0){
    this.props.editUserMapping(data,this.props.match.params.wId,this.props.mappeddata._id).then(res=>{
      if(res&&res.data&&res.data.userexists){
        notification.error({
          message: 'User Already exists.'
        });
        
      }
    })
    this.props.form.resetFields()
   
   if(!this.props.loading){
     this.props.onCreate()
   }
   }
 

 }else{
 let errors=[]  
 let checkIsUserAlreadyExists=this.props.usermappings.find(usermapping=>(usermapping.user_id&&usermapping.user_id.user_id)===this.state.selectedUserId)  
 if(checkIsUserAlreadyExists)errors.push({type:"slack_user",text:`${checkIsUserAlreadyExists.user_id.displayName ||checkIsUserAlreadyExists.user_id.name} is already mapped.`})

 let checkJiraUserExists=this.props.usermappings.find(usermapping=>((usermapping.user_obj&&usermapping.user_obj.accountId||usermapping.user_obj && usermapping.user_obj.name)===this.state.selectedJiraUserId))
 if(checkJiraUserExists&&checkJiraUserExists.user_id)errors.push({type:"jira_user",text:`${checkJiraUserExists.user_id.displayName ||checkJiraUserExists.user_id.name} is alredy using this jira user`})
 this.setState({error:errors})
 if(!checkIsUserAlreadyExists&&!checkJiraUserExists){
  // data.team=localStorage.getItem('teamId')
  data.team= this.props.team.id || ''
  data.currentUser=this.props.currentUser&&this.props.currentUser._id
 let tempUser= this.props.users.filter(user=>user && user.user_id===this.state.selectedUserId)
 data.jiraEmail=tempUser&& tempUser[0].email

 this.props.addUserMapping(data,this.props.match.params.wId,this.props.match.params.skill_id,"Jira").then(res=>{
 if(res.data.userexists){
   notification.error({
     message: 'User Already exists.'
   });
   
 }
   
 })
 this.props.form.resetFields()
 
 if(!this.props.loading){
   this.props.onCreate()
 }
 
}
 }
 
  }
}
// testFn=(e)=>{
//   let data=this.state
//   this.props.addUserMapping(data,this.props.match.params.wId,this.props.match.params.skill_id,"Jira").then(res=>{
//     if(res&&res.data&&res.data.userexists){
//       notification.error({
//         message: 'User Already exists.'
//       });
      
//     }
      
//     })

// }
onChange(val,name){
  this.setState({slackError:""})
  this.setState({atlassianError:""})
 this.setState({[name]:val,error:[]})
}
sendNotification=(e)=>{
  this.setState({ notify : e.target.checked})
}
onSearch=(val)=>{
this.props.getJiraUsers(this.props.match.params.skill_id,val)
}

componentWillUnmount(){
this.props.setJiraUsers([])
}
onCancel=()=>{
  this.setState({selectedJiraUserId:"",selectedUserId:"",selectedJiraser:"",error:[]})
  this.props.onCancel()
}

getJiraUserList=()=>{
  return this.props.jiraUsers.map(user=>{
  return <Option value={user.accountId  || user.name || user.displayName} key={user.key || user.accountId}>{user.displayName}</Option>})
  /*return this.props.jiraUsers.map(user=>{
    return <Option value={user.accountId || user.name}>{(user.displayName || '') + " ("+(user.email||" ")+")"}</Option>})
  return this.props.jiraUsers.map(user=>{
  return <Option value={user.accountId || user.name}>{user.displayName}</Option>})
  */
  /*
  return this.props.jiraUsers.map((user)=>{
    //console.info(user)
    let text=""
    let email=user.html.split("-")[1]
    if(email){
      email=email.slice(1)
    }
    //console.info("email :",email)
    if(user.displayName && email){
      text=user.displayName+" ("+email+")"
    }
    else if(user.displayName){
      //console.info(user.displayName)
      text=user.displayName
    }
    else if(email){
      text=email
    }
    else{
      text=""
    }
  //return <Option value={user.accountId || user.name}>{(user.displayName || '') + " ("+(user.email||" ")+")"}</Option>)
  return (<Option value={user.accountId || user.name}>{text}</Option>)
  })
  */

  //return this.props.jiraUsers.map(user=>return <Option value={user.accountId || user.name}>{(user.displayName || '') + " ("+(user.email||" ")+")"}</Option>
}
   render() {
       const { visible, onCancel,form } = this.props;
       let slackerror={}
        let jiraerror={}     
        if(this.state.error&&this.state.error.length>0){
         
          
   this.state.error.forEach(err=>{
     if(err.type=="slack_user"){
       slackerror.validateStatus="error"
       slackerror.help=err.text
     }
     else{
       jiraerror.help=err.text
    jiraerror.validateStatus= 'error'}
   })
        
        }
       const { getFieldDecorator } = form;
       return (
         <Modal
           visible={visible}
           title="Slack Jira User Mapping"
           okText={this.props.isEdit?"Update":"Create"}
           onCancel={this.onCancel}
          //  onOk={this.onFormSubmit}
           footer={[

            <Button
      
              key="submit"
              type="primary"
              onClick={this.onFormSubmit}
            >
              Create
                </Button>
          ]}
         >
       {this.state.loading?<div style={{textAlign:"center",borderRadius:"4px"}} >
    <Spin />
  </div>:    
           <Form layout="vertical" onSubmit={this.onFormSubmit} >
             <Form.Item  {...slackerror} className={localStorage.getItem('theme') == "dark" && "form_label_dark"} label="Slack User" >
               {getFieldDecorator('user', {
                 rules: [{ required: true, message: 'Select a slack user' }],
                 initialValue: this.state.selectedUserId
               })(<Select
                 showSearch
                 placeholder="Select a slack user"
                 optionFilterProp="children"
                 onChange={(val)=>this.onChange(val,"selectedUserId")}
                 // onSearch={onSearch}
                 showSearch={true}
                 filterOption={(input, option) =>{
                   return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                 }
                    
                 }
               >
   {this.getUsers()}
               </Select>,)}
               <div style = {{fontSize: 12,color: "red"}}>
                 {this.state.slackError}
               </div>
             </Form.Item>
             <Form.Item {...jiraerror} className={localStorage.getItem('theme') == "dark" && "form_label_dark"} label="Atlassian User" >
               {getFieldDecorator('description',
               {rules: [{ required: true, message: 'Select a Atlassian user' }],
               initialValue: this.state.selectedJiraUserId
              }, 
           
               )(<Select
               allowClear={true}

                 showSearch
                 placeholder="start typing to search for Jira users"
                 optionFilterProp="children"
                 onChange={(val,e)=>{
                   this.onChange(val,"selectedJiraUserId")
                   this.onChange(e&&e.key,'selectedJiraUserKey')
                  }}
                 onSearch={this.onSearch}
                 filterOption={(input, option) =>
                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                 }
                 notFoundContent={this.props.loading? <Spin size="small" /> : null}
               >
            {this.getJiraUserList()}
               </Select>)}
               <div style = {{fontSize: 12,color: "red"}}>
                 {this.state.atlassianError}
               </div>
             </Form.Item>
             {!this.props.isEdit && (
              <Form.Item >
              <Checkbox defaultChecked onChange={this.sendNotification}>Send notification to user</Checkbox>
              </Form.Item>
            )}
           </Form>
   }
         </Modal>
       );
     }
} 
const mapStateToProps=state=>{
  return{
  users:state.common_reducer.users,
  jiraUsers:state.skills.JiraUsers,
  loading:state.skills.loading,
  usermappings:state.skills.userMappingsWithUsers,
  currentSkillUser: state.skills.currentSkillUser,
  team: state.skills.team,
  currentUser: state.common_reducer.user,
  }
}
export default withRouter(connect(mapStateToProps,{getAllSlackUsers,getJiraUsers,addUserMapping,setJiraUsers,editUserMapping})(Form.create({ name: 'add_mapping' })(UserMappingModal)))