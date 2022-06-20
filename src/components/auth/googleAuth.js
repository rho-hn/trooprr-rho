import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { login } from './authActions';

class GoogleAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      gmail_login_status: false,
      messages: [],

    }
  }

  componentDidMount() {
    // console.log("mounting Google Auth")
    let timezone = window.Intl.DateTimeFormat().resolvedOptions().timeZone;
    var token = localStorage.inviteToken
    var code = queryString.parse(this.props.location.search).code
    this.props.login(code, token, timezone).then((response) => {
      // console.log("Google Auth login response:", JSON.stringify(response.data))
      if (response.data.success) {
        // console.log(response);
        if (localStorage.inviteToken) {

          localStorage.removeItem('inviteToken');
        }
        if (response.data.status === "approved") {
          // console.log("approved response..")
          if(response.data.type === "user_signup"){
            // console.log("user_signup response..")
            // this.props.history.push("/create-team");
            // this.props.history.push("/")
            window.location.href = '/'
          }else{
            // console.log("user_login") //"type": "user_login",
            if (localStorage.url) {     
              // console.log("this.props.history.push localStorage.url", localStorage.url)         
              // this.props.history.push(localStorage.url);
              window.location.href = localStorage.url
              localStorage.removeItem('url');              
            } else {
              // console.log("this.props.history.push")
              // this.props.history.push('/');
              window.location.href = '/'
            }
          }         
        } else if (response.data.status === "pending") {
          this.props.history.push('/troopr/pendingApproval');

        }
          else if (response.data.status === "rejected") {
          this.props.history.push('/troopr/rejected');

        }
        else if (response.data.status === "IncompleteDetails" || response.data.status === "pre_approved") {
          this.props.history.push('/troopr/userDetails?email=' + response.data.email);

        } else if (response.data.status === "team_unlinked") {
          window.location = "https://slack.com/oauth/authorize?scope=channels:history,channels:join,channels:read,chat:write,commands,files:read,groups:history,groups:read,im:history,im:write,mpim:history,usergroups:read,users:read,users:read.email,im:read,mpim:read&client_id=453340678869.480525138384"


        }
      }      
      else {
        console.error("error ", response.data.errors)
        this.setState({ errors: response.data.errors });
        this.props.history.push('/troopr/access');
      }
    });




  };


  render() {

    return (<div></div>)
  }
}


function mapStateToProps(state) {
  return {
    token: state.auth.token

  };
}

export default connect(mapStateToProps, { login })(GoogleAuth);
