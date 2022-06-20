import React, { Component } from 'react'
import { Tooltip } from 'antd';
import SlackPng from "../../media/slacklo.png"
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {checkSlackLink,getTeamData} from "../skills/skills_action"
import "./footer.css"
 class Footer extends Component {
     constructor(props) {
         super(props)
     
         this.state = {
              
         }
     }
     componentDidMount(){
         this.props.checkSlackLink(localStorage.getItem("userCurrentWorkspaceId"));
         localStorage.setItem("app", "AE4FF42BA");

         this.props.getTeamData(localStorage.getItem("userCurrentWorkspaceId")).then(res=>{
            // console.log("res=>",res.data.teamId);
            localStorage.setItem("teamId",res.data.teamId);
         })
     }
     
     sendtoslack=()=>{
         const {assistant}= this.props;

         const app = localStorage.getItem('app');
        //  const teamId = assistant.id
        let teamId = localStorage.getItem("teamId");
         let url = '';
         if(app && teamId){
           url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
         }else{
           url = `https://slack.com`;
         }
          window.location.href = url;

     }
     
    render() {
        return (
            <div id="mybutton">
            <Tooltip placement="topLeft" title="Go to slack">
           <img onClick={this.sendtoslack} className='feedback' src={SlackPng} /> 
           </Tooltip>
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    
   return {assistant:state.skills.team}
   
}

export default withRouter(connect(mapStateToProps,{ checkSlackLink,getTeamData })(Footer));
