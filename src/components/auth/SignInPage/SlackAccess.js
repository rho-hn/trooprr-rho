import React from 'react';
import { connect }from 'react-redux';
import queryString from 'query-string';
import { slackAccess } from '../authActions';
import {withRouter} from 'react-router-dom';
import { message } from 'antd';

class SlackAccessAuth extends React.Component{
    

    componentDidMount() {
   
      // console.log("=======>slackaccess");
         
          var code=queryString.parse(this.props.location.search).code
          this.props.slackAccess(code).then((response) => {
               if (response.data.success) {
                  if(response.data.status==="approved"){
                  //    if(localStorage.url){
                  //      this.props.history.push('/')
                  //     //  this.props.history.push(localStorage.url);
                  //     //  localStorage.removeItem('url');
                  //    }else{
                  //      this.props.history.push('/');
                  //    }
                  // console.log(window.location.hostname)
                     
                  window.location.href= "https://"+ window.location.hostname
                  // this.props.history.push("/")
                   
                
               }else if(response.data.status==="team_unlinked"){
                  window.location="https://slack.com/oauth/v2/authorize?scope=bot,users.profile:read,commands,users:read,channels:read,groups:read,chat:write:bot&client_id=453340678869.480525138384&state=user_team_link"
                  
      
            }
          } else {  
                message.error('Something went wrong, please try again.')
                 this.setState({ errors: response.data.errors });
                 this.props.history.push('/troopr/access');
               }
             });
                   
                 
      };

    render(){
  
        return(
            <div>
                
            </div>
        );
    }
}

export default withRouter(connect(null,{slackAccess})(SlackAccessAuth));