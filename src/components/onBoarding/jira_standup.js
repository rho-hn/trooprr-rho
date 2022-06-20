import React, { Component} from "react";

import { connect } from "react-redux";
import { getTeamData} from '../skills/skills_action';
import { withRouter } from "react-router-dom";
import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Modal, Button, Result } from "antd";

class JiraStandup extends Component {


    constructor(props) {
        super(props);
             this.state = { 
                visible:true,
                assisant_name:"",
                step:"personalize",
                sId:"",
                lodaing:false
             }  
        
            
             
  }

  componentDidMount() {
    // this.props.SkillsAction(this.props.match.params.wId);

    if(!this.props.teamId.id){

      this.props.getTeamData(this.props.match.params.wId).then(res=>{
        // console.log("res=>",res.data.teamId);
        localStorage.setItem("teamId",res.data.teamId);
     })
     }
   
 }
 

 



  skip=()=>{
    this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.state.sId) 
  }



  render() {
    // console.log("team",this.props.teamId)
    return (
      <Modal
             
                footer={null}
                closable={true}
                width="40vw"
                style={{height:"50vh"}}
                onCancel={this.skip}
                visible={this.state.visible}
       
            >
           
    <Result
                icon={<CheckCircleOutlined />}
                status="success"
                title="Done"
                subTitle="Jira successfully Connected To Troopr Standups."
                extra={[
                    
                  <Button icon={<SlackOutlined />}   href={`https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.teamId.id}`}  type="primary" key="slack">
                    Create new Standup
                  </Button>
                
                ]}
              />

            </Modal>
    );
  }
}
const mapStateToProps = state => ({

  workspace: state.common_reducer.workspace,
  teamId:state.skills.team,
  user:state.auth.user,

});

export default withRouter( connect( mapStateToProps,{getTeamData})(JiraStandup))

