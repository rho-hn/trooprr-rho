


import React from 'react';
import { connect } from 'react-redux';

import { withRouter } from "react-router-dom";
import queryString from 'query-string';

import { getChannelList,getTeamData} from '../skills/skills_action';
import { getWorkspace} from "../common/common_action";
import axios from 'axios';
import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Button, Select, Modal, Alert, Result } from 'antd';
const { Option } = Select;
class TrooprDefaults extends React.Component {
	constructor(props) {
   super(props);
        this.state = {
        
        channel:{},
        loading:false,
        field_error:false,
        visible:true,
        view:"invite"
 }  
this.skip=this.skip.bind(this);
this.handleSubmit=    this.handleSubmit.bind(this);

     }



componentDidMount() {

  if(!this.props.workspace._id){
    this.props.getWorkspace(this.props.match.params.wId)
  }
 if(!this.props.teamId.id){

  this.props.getTeamData(this.props.match.params.wId).then(res=>{
    // console.log("res=>",res.data.teamId);
    localStorage.setItem("teamId",res.data.teamId);
 })
 }
    // this.props.getProject(this.props.match.params.skill_id);
    // this.props.getWorkspace(this.props.match.params.wId)
 /* getChannels only called once in sidenavbar_new */
//  this.props.getChannelList(this.props.match.params.wId);


    // this.props.SkillsAction(this.props.match.params.wId);
    const parsedQueryString = queryString.parse(window.location.search);
    if( parsedQueryString.view ){
      let  _obj={view:parsedQueryString.view}
      if(parsedQueryString.cName){
        _obj.channel={name:parsedQueryString.cName,id:parsedQueryString.cId}
      }
      this.setState(_obj) 
    }else{
      //  this.setState({ step:'personalize'})
    }

//  this.props.getProject(this.props.match.params.skill_id)
}
    
onChange(value,data,type){

        this.setState({[type]:{name:data.props.children,id:value}})
      
         
        
    
    }

    // handleChange(event) {

       
    //     this.setState({assisant_name: event.target.value});
    //   }
      handleSubmit() {
        // console.log(this.state)
        this.setState({loading:true,field_error:false})
        this.setState({loading:true})
        let data=this.state
    
        data.app="Troopr"
        data.skill_id=this.props.match.params.skill_id
        data.timeZone=this.props.workspace.timezone
        if(this.state.channel.id){
        axios.post("/bot/api/workspace/"+this.props.match.params.wId+"/setChannelDefault",data).then(res=>{
            this.setState({loading:false})
    if(res.data.success){
                // this.setState({view:"success"})
        //  this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id)
         this.changeStep("success")
    
    }else{
    
    }
    
    
        })
    }else{

        this.setState({loading:false,field_error:true})
        }
      }
    
    
      changeStep(step){
    


        let  path = window.location.pathname;
        let obj = {
          "title": step,
          "url": path + `?view=${step}`
        }
        if(step=="success"){
          obj.url=obj.url+"&cName="+this.state.channel.name+"&cId="+this.state.channel.id
        }
           window.history.pushState(obj, obj.title, obj.url);
       
       this.setState({view:step})
    }
    
    
    skip(){
        if(this.props.visible){
            this.setState({visible:false})
    }else{
        this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id)
     } }
render() {     const {}=this.props;	 
  return (
    <Modal
    title={this.state.view=="success"? "":"Invite Troopr to channel"}
    visible={this.state.visible}
  onCancel={this.skip}
  closable={this.state.view=="success"?true:false}
  footer={null}
  maskClosable={false}
  >
    {this.state.view=="success"? <Result
            icon={<CheckCircleOutlined />}
            status="success"
            title="Done"
            subTitle={"Troopr successfully invited to channel: "+this.state.channel.name}
            extra={[
              <Button icon={<SlackOutlined />} href={`https://slack.com/app_redirect?team=${this.props.teamId.id}&channel=${this.state.channel.id}`} type="primary" key="slack">
                Go to #({this.state.channel.name})
              </Button>,
              <br />
            ]}
          /> :<React.Fragment>
          
      <h4>

Invite Troopr to a channel where your project members are. This will automatically create a linked Troopr project with the channel members
    {/* <br/>
    1.Invite Troopr to the channel
    <br/>
    2.Allow members to create and update issues in the channel
    <br/>
    3.Update Notification for linked GitHub project <br/>
    4.Deliver Reports from linked GitHub project. */}
</h4>
<div className="flex_column" style={{marginBottom:25,marginTop:10}}>

<div className="form_group_label" > Select a channel </div>
<Select
           showSearch
           style={{ width: "100%" }}
           placeholder="Select a channel"
           optionFilterProp="children"
           onChange={(value,data)=>this.onChange(value,data,"channel")}
                             
           value={this.state.channel.id}
         
           filterOption={(input, option) =>
           option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
           }>
                 {this.props.channels.map((item)=>(<Option key={item.id } value={item.id}>

             {item.name}
             </Option>))}
                  </Select>
                  {this.state.field_error && !this.state.channel.id&&<span className="error_message">Channel is required</span> }

</div>




<Alert  style={{marginTop:30}} message="To invite Troopr to a private channel, type /invite @troopr in that channel or click on Add App" type="info" showIcon />
<div className="row_flex" style={{marginTop:20,justifyContent: "flex-end"}}>
                 <Button onClick={this.skip}>Skip</Button>
                 &nbsp; &nbsp; &nbsp;
                 <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit}>Invite</Button>
     </div>
          
          
                 </React.Fragment> }
        
</Modal>
  );
	 }
}
const mapStateToProps = state => {
return {
channels: state.skills.channels,
workspace: state.common_reducer.workspace,
teamId:state.skills.team,
}};

export default withRouter(connect(mapStateToProps, { 
    
  getChannelList,
  getWorkspace,
  getTeamData
})(TrooprDefaults));

// export default connect( null, { })(GitHubDefaults);