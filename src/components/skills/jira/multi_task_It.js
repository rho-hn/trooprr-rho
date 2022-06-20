import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import "antd/dist/antd.css";
import "./jira.css";
import { withRouter } from "react-router-dom";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button,Row, Col, Collapse, Modal , message , Alert ,Typography } from "antd";

const { Panel } = Collapse;
const { Text } = Typography;

function callback(key) {
}
class MultiTaskIt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          expandIconPosition: "left",
          hasPermission : false,
        };
    }

  async componentDidMount() {
    //get boolean about if permissions are revoked
    let data = {
      "user_id": this.props.user._id,
      "workspace_id" : this.props.workspace._id
    }
    let response = await axios.post(`/bot/haspermission/${data.workspace_id}/user/${data.user_id}`);
    // console.log("RESPONSE :",response);
    if (response) {
      if (response.data && response.data.success) {
        //SET HAS PERMISSIONS TRUE / FALSE DEPENDING ON THIS CALL
        this.setState({hasPermission : response.data.hasPermission});
      }
    }

  }
  //give permission
  givePermissionHandler = async ()=>{
    //get client id from backend and open the window with url :
    //URL = https://slack.com/oauth/v2/authorize?client_id={client id}&user_scope=im:write,im:history,reactions:read,chat:write&state=OA"
    let response = await axios.post('/bot/new_user_oauth');
    if (response) {
      if (response.data && response.data.success) {
      let baseurl =  "https://slack.com/oauth/v2/authorize?client_id="
      let client_id = response.data.client_id;
      // let scopes = "&user_scope=im:history,reactions:read,chat:write,im:read&state=OA"
      let scopes = "&user_scope=im:history,reactions:read,chat:write&state=OA"
      let url = baseurl + client_id + scopes;
        window.open(url,"_self"); //_self opens the url in current window
      }
    }
    
    //get current state about hasPermissions state and update
    let data = {
      "user_id": this.props.user._id,
      "workspace_id" : this.props.workspace._id
    }
    let res = await axios.post(`/bot/haspermission/${data.workspace_id}/user/${data.user_id}`);
    if (res) {
      if (res.data && res.data.success) {
        //SET HAS PERMISSIONS TRUE / FALSE DEPENDING ON THIS CALL
        this.setState({hasPermission : response.data.hasPermission},()=>{
          if(response.data.hasPermission){
            message.success("Permissions Given Successfully!")
          }
          // else{
          //   message.error("Permission Denied")
          // }
        });
        //message.success("Permissions Given Successfully!")
        
        }
    }
    
  }

  //ask for confirmation
  revokeTokenConfirm = async ()=>{
    Modal.confirm({
      title: "Revoke Permissions",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Are you sure you want revoke permissions?
        </p>
      ),
      onOk: () => this.revokeToken(),
      onCancel: () => {},
    });
  }

  //revoke
  revokeToken = async ()=>{
    let data = {
      "user_id": this.props.user._id,
      "workspace_id" : this.props.workspace._id
    }
    let response = await axios.post(`/bot/revoke_oauth/${data.workspace_id}/user/${data.user_id}`);
    if (response) {
      if (response.data && response.data.success) {
        //SET HAS PERMISSIONS FALSE DEPENDING ON THIS CALL
        this.setState({hasPermission : false })
        message.success("Permissions Revoked Successfully!")

      }else{
        //else show information to user that couldn't revoke token.
        Alert.success("Something went wrong!")

      }
    }
  }
  

  render() {
    let skill = this.props.skill
    let configureDmTaskit = (skill && skill.skill_metadata ? skill.skill_metadata.configureDmTaskit : skill.configureDmTaskit)
    return (
      <>
            <Collapse defaultActiveKey={["1"]} onChange={callback}>
              
            {  !this.state.hasPermission &&(
                <Panel
                className='collapse_with_action'
                header="Use Troopr in DM channels"
                key="2"
                extra={
                  <div onClick={e => e.stopPropagation()}>
                  <Button  onClick={this.givePermissionHandler}>Give permission</Button>
                {/* {configureDmTaskit ? (<Button  onClick={this.givePermissionHandler}>Give permission</Button>):
                (<Button disabled onClick={this.givePermissionHandler}>Give permission</Button>)} */}
                {/* dev */}
                {/* <Button target='_blank' href="https://slack.com/oauth/v2/authorize?client_id=453340678869.1789657168135&user_scope=im:write,im:history,reactions:read,chat:write&state=OA" onClick={this.btnClicked}>Give permission</Button> */}
                </div>}
                  
              >
                <Text type='secondary'>
                  Clicking on connect button will start the authorization process that will<br></br> allow you to use Troopr in DM channels. This process gives Troopr <br></br>necessary permissions to work in DM channels.
                </Text>
              </Panel>
              )}
            {  this.state.hasPermission &&(
              <Panel
                className='collapse_with_action'
                header="Use Troopr in DM channels"
                key="3"
                extra={
                  <div onClick={e => e.stopPropagation()}>
                  <Button  danger onClick={this.revokeTokenConfirm}>Revoke permission</Button>
                {/* {configureDmTaskit ? (<Button  danger onClick={this.revokeTokenConfirm}>Revoke permission</Button>):
                (<Button disabled danger onClick={this.revokeTokenConfirm}>Revoke permission</Button>)} */}
                </div>}
              >
                <div>
                <Text type='secondary'>
                  Disconnecting your Slack account will remove permissions necessary for Troopr to work in DM channels. 
                </Text>
                </div>
              </Panel>
              )}
            </Collapse>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.common_reducer.user,
    workspace: state.common_reducer.workspace,
  };
};

export default withRouter(connect(mapStateToProps, {})(MultiTaskIt));
// target='_blank' href="https://slack.com/api/auth.revoke?token=xoxp-1851848496467-1848558485813-1854839375685-50f263c32b4cc6bab52509686a9c99b5&test=true"
// btnClicked = ()=>{
  //     if(this.state.show_revoke){
  //       this.setState({show_revoke : false})
  //       localStorage.setItem('show_revoke', false);
  //     }else{
  //       this.setState({show_revoke : true})
  //       localStorage.setItem('show_revoke', true);
  //     }
  //     console.log(this.state.show_revoke)
  // } 

  // let teamId = localStorage.getItem("teamId")
