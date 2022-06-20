import React, { Component } from 'react'
import "./jiraoauth.css"

import DomainUrl from "./domainurl.jsx"
import ApplicationUrl from "./ApplicationUrl"
import LinkApplication from "./LinkApplication"
// import { getRSAKeyPair, validateDomainUrl, getOauthTokens } from "./jiraoauth.action"
import { getRSAKeyPairForCloud, validateDomainUrl, getOauthTokensForCloud } from "./jiraOAuthCloud.action"
import CreateIncomingLink from "./CreateIncomingLink"
import { withRouter } from "react-router-dom";
import { Button, message, Layout, Steps, Modal } from "antd"
import { connect } from 'react-redux'
import { nextStep, addDomainURL, addKeysAndSession } from './jiraOAuthActions'
import { setDriftState } from "../auth/authActions";
import { sendMessageOnchat } from 'utils/utils'
import queryString from 'query-string'
import {validURL} from '../../utils/utils'
const uuidv4 = require("uuid/v4");
const { Step } = Steps;
const { Content } = Layout

class JiraOAuthCloud extends Component {

  constructor() {
    super();
    this.state = {
      current: 0,
      domainurl: "",
      publicKey: "",
      loading: false,
      sessionid: "",
      showError: false,
      error: {},
      consumerkey: "troopr",
      isVerified: false,
      parsedQueryString : {}
    }
  }


  addUrl = (domainurl) => {
    this.setState({ domainurl, isVerified: false })
  }

  SaveConnection = async () => {
    // this.setState({loading:true})
    let data = await getOauthTokensForCloud(this.props.match.params.wId, this.state.sessionid)
    //  this.setState({loading:false})
    if (data && data.url) {
      Modal.confirm({
        title: 'You will now be directed to the Jira consent page, click “Allow” to complete your Jira connection setup.',
        okText: 'Proceed',
        cancelButtonProps : {
          style:{display : 'none'}
        },
        maskClosable : true,
        onOk: () => window.location.assign(data.url),
        okType: 'primary'
      })
      // window.location.assign(url);
    }
    else {
      // message.error(
      //   <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", textAlign: "left" }}>
      //     <div className="save-connection">
      //       <div style={{ marginBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>Error Connecting Your Jira Instance</div>
      //       <div style={{ marginBottom: "10px" }}>Make sure you provided a valid site URL</div>
      //       <div style={{ marginBottom: "10px" }}>If you can't connect after providing valid site URL also Open your firewall for us </div>
      //     </div>
      //   </div>,
      //   5
      // );

      Modal.error({
        title : 'Could not connect to your Jira',
        content : (
          <div style={{ maxHeight: 350, overflow: "auto", display: "flex", flexDirection: "column" }}>
            Troopr could not connect to your Jira. Please make sure the application link configuration is accurate and complete and try again. <br />
            {data && data.error && 
            <>
            <br />
            Error Details: <br />
            {data.error}
            </>
            }
          </div>
        )
      })

      this.setState({ current: 0 });
    }
  }

  componentDidMount() {
    this.setState({
      isVerified: false
    })

    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({parsedQueryString})
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isVerified && !this.state.isVerified && prevState.isVerified !== this.state.isVerified) {
      this.setState({
        isVerified: false
      })
    }
  }

  next = async () => {
    const {domainurl} = this.state
    if (parseInt(this.props.match.params.current) == 2) {
      this.setState({ loading: true })
      let info = await getRSAKeyPairForCloud(this.props.match.params.wId, this.props.oAuth.domainURL,/* sub_skill */ this.state.parsedQueryString.sub_skill)
      let data = { publicKey: info.publicKey, consumerkey: info.consumerkey, sessionid: info.sessionid }
      this.props.addKeysAndSession(data).then(() => this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/3${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`))
      this.setState((prevState) => ({ current: prevState.current + 1, publicKey: info.publicKey, consumerkey: info.consumerkey, loading: false, sessionid: info.sessionid }))
    }
    else if (parseInt(this.props.match.params.current) == 3) {
      // this.props.history.push(`/${this.props.match.params.wId}/jiraoauth/${this.props.match.params.skill_id}/saveconnection`,{sessionid:this.state.sessionid})
      this.SaveConnection()
    }
    else {
      if (parseInt(this.props.match.params.current) == 0) {
        if (!this.state.domainurl) {
          message.error("Enter a Valid Jira site URL")
        }
        else {

          const goToNextPage = async () => {
            this.setState({ loading: true, showError: false })
            // let validUrlInfo = await validateDomainUrl(this.props.match.params.wId, this.state.domainurl)
            let validUrlInfo = await this.verify()
            if (validUrlInfo) {
              let { instanceInfo } = validUrlInfo;
              this.setState((prevState) => ({ current: prevState.current + 1, loading: false }))
              this.props.addDomainURL(this.state.domainurl, instanceInfo).then(() => {
                this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/1${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
              })
  
            }
          }

          if(validURL(domainurl) && !domainurl.includes('atlassian.net')){
            Modal.confirm({
              title: 'It appears that you are connecting to a Jira Server/DC site, click "Proceed" to continue to connect to Jira Server/DC. Click "Cancel" to continue to connect to Jira Cloud site.',
              okText: 'Proceed',
              // maskClosable : true,
              keyboard : false,
              onOk: () => this.goToServerOauth(),
              onCancel : () => goToNextPage(),
              okType: 'danger'
            })
            
          } else goToNextPage()

        }

        return;
      } else {  // Current Step is 1
        this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/2${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
      }

    }
  }

  goToServerOauth = () => {
    this.props.history.push(`/${this.props.match.params.wId}/jiraoauthServer/${this.props.match.params.skill_id}/0${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
  }

  openChatWindow = (msg) => {

    sendMessageOnchat(msg);
  };

  previous = () => {

    if (!this.state.domainurl) {
      return message.error("Enter a Valid Jira site URL")
    }

    this.setState((prevState) => ({ current: prevState.current - 1 }))
    let current = parseInt(this.props.match.params.current)
    if (current === 1) {
      this.setState({ isVerified: false })
    }
    this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/${current - 1}${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
  }

  verify = async () => {
    this.setState({ loading: true })
    if (!this.state.domainurl) {
      this.setState({ loading: false })
      return message.error("Enter a Valid Jira site URL")
    }
    let validUrlInfo = await validateDomainUrl(this.props.match.params.wId, this.state.domainurl);
    if (validUrlInfo && validUrlInfo.instanceInfo) {
      message.success("Jira URL successfully verified.")
      this.setState({
        loading: false,
        isVerified: true,
        showError: false,
        instanceInfo: validUrlInfo.instanceInfo,
        domainurl: validUrlInfo.instanceInfo.baseUrl
      })
      return validUrlInfo
    } else if (!validUrlInfo || !validUrlInfo.instanceInfo) {
      localStorage.setItem("TROOPR_DRIFT_APP_MESSAGE", "Query on Jira connection")
      this.openChatWindow("Query on Jira connection")
      this.setState({
        loading: false,
        showError: true,
        error : validUrlInfo.error
      })
    }
  }

  render() {
    const { loading, parsedQueryString } = this.state;
    let { current } = this.props.match.params;
    current = parseInt(current);

    if (current === 1 || current === 2 || current === 3) {
      // Confirm redux has domainURL. Else send to 0 step
      if (!this.props.oAuth.domainURL) {
        if(parsedQueryString && parsedQueryString.sub_skill){
          this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/0${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
          return <></>
        }else return <></>
      }
    }
    if (current === 3) {
      // Confirm redux has RSA keys
      if (!this.props.oAuth.consumerkey) {
        if(parsedQueryString && parsedQueryString.sub_skill){
          this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/0${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
          return <></>
        }else return <></>
      }
    }
    if (current !== 0 && current > 3) {
      if(parsedQueryString && parsedQueryString.sub_skill){
        this.props.history.push(`/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/0${this.state.parsedQueryString.sub_skill  ? '?sub_skill=' + this.state.parsedQueryString.sub_skill : ''}`)
        return <></>
      }else return <></>
    }

    const steps = [
      {
        title: "Jira URL",
        content: (
          <DomainUrl domainURL={this.state.domainurl} isVerified={this.state.isVerified} loading={this.state.loading} showError={this.state.showError} error={this.state.error} next={this.next} addUrl={this.addUrl} isCloud={true} verify={this.verify} />
        )
      },
      {
        title: "Create Link",
        content: (
          <ApplicationUrl domainurl={this.props.oAuth.domainURL} instanceInfo={this.props.oAuth.instanceInfo} oAuth={this.props.oAuth} />
        )
      },
      {
        title: "Configure Link",
        content: (
          <CreateIncomingLink />
        )
      },
      {
        title: "Secure Link",
        content: (
          <LinkApplication consumerkey={this.props.oAuth.consumerkey} publicKey={this.props.oAuth.publicKey} />
        )
      },
      // {
      //   title: "Save Connection",
      //   content: (
      //    <SaveConnection SaveConnection={this.SaveConnection}/>
      //   )
      // }

    ]
    const stepsDisplay = steps.map((step, index) => {
      return <div key={index} className="step-wrapper">
        <div className={`step-number ${current >= index ? 'step-number-active' : "step-number-disabled"}`}>{current > index ? <span>&#10003;</span> : index + 1}</div>
        <div className={`step-description ${step.highlighted && "step-description-active"}`}>{step.title}</div>
        <div className={(index !== steps.length - 1) && "divider-line"} />
      </div>
    })
    return (
      <div className='jira_connection_scroll'>
      <Content style={{ padding: "16px 16px 32px 24px", marginLeft: 0 }}>
        {/* <div className="stepper-container-horizontal">
          <div className="stepper-wrapper-horizontal">
            {stepsDisplay}
          </div>
        </div> */}
        <div className='jira_steps_scroll'>
        <Steps current={current}>
          {steps.map((step, index) => <Step title={step.title} className="steps_title"/>)}
        </Steps>
        </div>
        <div className={`step-content ${localStorage.getItem("theme") == "default" ? "step-content-bg-default" : "step-content-bg-dark"}`}>
          {steps[current].content}
        </div>
        <div className="step-buttons">
          {
            // current == 0 && <Button type="primary" loading={this.state.loading} onClick={this.state.isVerified ? this.next : this.verify}>{this.state.isVerified ? "Click here to proceed" : "Verify"}</Button>
            current == 0 && <Button type="primary" loading={this.state.loading} onClick={() => this.next()}>Click here to proceed</Button>
          }
          {(!(current == 0)) && <Button onClick={this.previous} >
            Previous
        </Button>
          }
          {current !== 0 &&
            <Button type="primary" onClick={this.next} loading={loading} style={{ marginLeft: current === 3 && "30px" }}>
              {current === 3 ? "Connect" : "Next"}
            </Button>
          }
       </div>
      </Content>
      </div>
    )
  }
}

const mapStateTopProps = (state) => {
  return {
    oAuth: state.OAuthReducer,
  }
}

export default withRouter(
  connect(
    mapStateTopProps,
    { nextStep, addDomainURL, addKeysAndSession,setDriftState }
  )(JiraOAuthCloud)
) 