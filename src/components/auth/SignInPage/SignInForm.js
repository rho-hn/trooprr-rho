import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import slack_logo from "../../../media/slack-1.svg";
import google_icon from "../../../media/google_icon.svg";
import Icon, { GoogleOutlined, SlackOutlined } from '@ant-design/icons';
import { Typography, Tooltip, Result, Button, Card } from "antd";
import { ThemeProvider, useTheme } from 'antd-theme';
import "../auth.css";

const TrooprSvg = () => (
  <svg
    // width="512px" height="512px" viewBox="0 0 512 512" 
    viewBox="0 0 512 512"
    width="1em" height="1em"
    fill="currentColor"
  >
    <g id="Circle" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <circle id="Oval" fill="#403294" cx="256" cy="256" r="256"></circle>
      <circle id="Oval-Copy" cx="256" cy="256" r="180"></circle>
      <g id="Group" transform="translate(127.000000, 127.000000)" fill-rule="nonzero">
        <circle id="Oval" fill="#FFFFFF" cx="32" cy="32" r="32"></circle>
        <circle id="Oval" fill="#FFFFFF" cx="129" cy="32" r="32"></circle>
        <circle id="Oval" fill="#FFFFFF" cx="226" cy="32" r="32"></circle>
        <circle id="Oval" fill="#000000" opacity="0.4" cx="32" cy="129" r="32"></circle>
        <circle id="Oval" fill="#FFFFFF" cx="129" cy="129" r="32"></circle>
        <circle id="Oval" fill="#000000" opacity="0.4" cx="226" cy="129" r="32"></circle>
        <circle id="Oval" fill="#000000" opacity="0.4" cx="32" cy="226" r="32"></circle>
        <circle id="Oval" fill="#FFFFFF" cx="129" cy="226" r="32"></circle>
        <circle id="Oval" fill="#000000" opacity="0.4" cx="226" cy="226" r="32"></circle>
      </g>
    </g>
  </svg>)
const TrooprIcon = props => <Icon component={TrooprSvg} {...props} />
const { Title } = Typography

const text = <span> Continue with slack to access troopr assistant in your slack
workspace.</span>;


const Theme = () => {
  const initialTheme = {
    name: 'default',
    variables: { 'primary-color': localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" }
  };
  const [theme, setTheme] = React.useState(initialTheme);
  return (
    <ThemeProvider
      theme={theme}
    >
    </ThemeProvider>
  );
};

class SignInForm extends Component {
  state = {
    isHelp: false,
    errors: {}
  };

  componentWillMount() {
    var token = queryString.parse(this.props.location.search).token;
    if (token) {
      localStorage.setItem("inviteToken", token);
    }
  }

  onSlackLogin = () => {
    window.location = `https://slack.com/oauth/v2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&user_scope=identity.basic,identity.team,identity.email&redirect_uri=${process.env.REACT_APP_URI}`
  }

  onGoogleLogin = () => {
    this.setState({ errors: {} });
    // console.log("calling /auth/google/login")
    axios.get("/auth/google/login").then(res => {
      // console.log("url:",res.data.authUrl)
      var url = res.data.authUrl;
      window.location = url;
    }).catch(err => {
      console.log("err getting google login url",err)
    })
  };

  helpClick = () => {
    this.setState({
      isHelp: !this.state.isHelp
    })
  };

  render() {

    return (
      <>
      <Theme />
      <div className="SignInFormContainer">
        <div className="sFormLogo"><TrooprIcon style={{ fontSize: '96px' }} /></div> 
        <div className="sFormTitle"><Title level={2}>Welcome to Troopr</Title></div> 
        <div className="sFormBox">
          <Card style={{width:400, margin:"0 auto"}}>
            {/* <Card hoverable size="small" onClick={this.onSlackLogin}>            */}
              <Button onClick={this.onSlackLogin} icon={<SlackOutlined />} type="primary" style={{width:"100%"}} size="large">Continue with Slack</Button>                          
            {/* </Card> */}
          {/* <div style={{padding:8}}/> */}
          {/* <Card hoverable size="small" onClick={this.onGoogleLogin}> */}
    {/* <Button onClick={this.onGoogleLogin} icon={<GoogleOutlined />} style={{width:"100%"}} size="large">Continue with Google</Button> */}
          {/* </Card> */}
          </Card></div> 
      </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    // newLoginFromGoogle:state.authReducer.newLogin,
    // newGoogleLoginToaster:state.authReducer.new
  };
}

export default withRouter(connect(mapStateToProps, null)(SignInForm));
