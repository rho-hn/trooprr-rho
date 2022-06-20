import React, { Component } from "react";
import { getOauthTokensForUsers } from "./components/jiraoauth/jiraoauth.action";
import { getOauthTokensForCloudUsers } from "./components/jiraoauth/jiraOAuthCloud.action";

export default class JiraLogins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }
  componentDidMount() {
    const {
      queryString: { jira_type },
      workspace_id,
    } = this.props;
    if (jira_type === "cloud")
      getOauthTokensForCloudUsers(workspace_id).then((url) => {
        if (url) window.open(url, "_self");
        else this.setState({ error: true });
      });
    else if (jira_type === "server")
      getOauthTokensForUsers(workspace_id).then((url) => {
        if (url) window.open(url, "_self");
        else this.setState({ error: true });
      });
    else this.setState({ error: true });
  }

  render() {
    return (
      <div style={{ width: "100vw", height: "100vh" }} className='d-flex flex-column justify-content-center align-items-center'>
        {!this.state.error ? (
          <>
            <div className='loader' /> <div style={{ fontSize: "24px", fontWeight: "500" }}>Redirecting to jira</div>
          </>
        ) : (
          "Some error occurred, Please try again."
        )}
      </div>
    );
  }
}
