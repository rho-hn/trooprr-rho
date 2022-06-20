import React, { Component } from 'react';
import { Layout, ConfigProvider, Empty } from "antd";
import { connect } from "react-redux";

import './App.css';
import './components/skills/skills.css';
import Routes from './routes/routes';
import { withRouter } from "react-router-dom"


import { ThemeProvider, useTheme } from 'antd-theme';

const Theme = () => {
  const initialTheme = {
    name: localStorage.getItem("theme"),
    // variables: { "primary-color": "#664af0" }
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

const customizeRenderEmpty = () => (
  <Empty image={"https://app.troopr.io/logo/empty_undraw.svg"} />
);

// function App(props) {
class App extends Component {
  // let workspaceId = window.location.href.split("/")[4];
  // if(workspaceId){
  //   localStorage.setItem("userCurrentWorkspaceId", workspaceId);

  // }

  componentDidMount = () => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.REACT_APP_TROOPR_CHAT_BOT_ID;

    (function() {
      var d = document;
      var s = d.createElement("script");

      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    window.CRISP_READY_TRIGGER = function() {
      var token = localStorage.getItem('token');
      if (!!token) {
        var tokenBase64 = token.split(".")[1];
        var tokenBase64_1 = tokenBase64.replace("-", "+").replace("_", "/");
        var t = JSON.parse(window.atob(tokenBase64_1))
        var parsedToken = JSON.parse(window.atob(tokenBase64_1));
        
        window.$crisp.push(["set", "user:email", [parsedToken.email]]);
        window.$crisp.push(["set", "user:nickname", [parsedToken.name]]);
        window.$crisp.push(['do', 'chat:hide']);

        window.$crisp.push(["on", "message:received", function() {
          window.$crisp.push(['do', 'chat:show']);
          window.$crisp.push(['do', 'chat:open']);
        }])

        window.$crisp.push(["on", "message:sent", function() {
          window.$crisp.push(["do", "chat:show"]);
          window.$crisp.push(['do', 'chat:open']);
        }])

        window.$crisp.push(["on", "chat:closed", function() {
          window.$crisp.push(['do', 'chat:hide']);
        }])

      }
    }
  }

  constructor(props) {
    super(props)
    //record user activity..
    // props.history.listen((location, action) => {
    //   let getToken = jwt.decode(localStorage.getItem("token"))
    //   let userInfo = getToken && getToken._id;
    //   let workspaceId = props.match.params.wId;
    //   if (!workspaceId) { workspaceId = localStorage.getItem("userCurrentWorkspaceId") }

    //   userInfo && workspaceId && location && location.pathname && sendUserActivity(workspaceId, userInfo, location.pathname)

    // });
  }

  render() {
    return (
      <div className={localStorage.getItem("theme") == "dark" ? "dark" : "default" }>
        <Theme />
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Layout style={{ minHeight: '100vh' }}>
            {/* Load the app only after we have workspace info */}
            {(this.props.workspace &&  Object.keys(this.props.workspace).length>0) && <Routes />}
            {/* <Routes /> */}
          </Layout>
        </ConfigProvider>
      </div>
    )
  }
}

function mapStateToProps(store) {
  // console.log("workspace:", JSON.stringify(store.common_reducer.workspace))
  // console.log("user_now:", JSON.stringify(store.common_reducer.user))
  return {
    workspace: store.common_reducer.workspace,
    skills: store.skills.skills
    // user_now: store.common_reducer.user,
    // isAuthenticated: store.auth.isAuthenticated
  }
}

export default withRouter(connect(mapStateToProps, {
  // getProfileinfo, 
  // getWorkspace
})(App))