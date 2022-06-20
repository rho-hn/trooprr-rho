
import React, { Component } from 'react'
import "../../jiraoauth/jiraoauth.css"

import DomainUrl from "../../jiraoauth/domainurl.jsx"

import { validateDomainUrl } from "../../jiraoauth/jiraoauth.action"
import JiraToken from "../jira/jiraConnectionFlow/jiraToken"
import LinkConfluenceToSlackChannel from "../jira/jiraConnectionFlow/LinkConfluenceToSlackChannel"
import { withRouter } from "react-router-dom";
import { Button, message, Layout, Steps, Modal } from "antd"
import {validURL} from '../../../utils/utils'
import queryString from 'query-string';

import {
 
    updateSkill,
    submitTokenData
   
  
  } from "../skills_action";
import { connect } from 'react-redux'
import { nextStep, addDomainURL, addKeysAndSession } from '../../jiraoauth/jiraOAuthActions'
const { Step } = Steps;
const { Content } = Layout
class Jiraoauth extends Component {

  constructor() {
    super();
    this.state = {
      current: 0,
      domainurl: "",
      publicKey: "",
      loading: false,
      sessionid: "",
      showError: false,
      consumerkey: "troopr",
      isVerified: false,
      connection_type:"cloud",
      data: {

        token: {done:false,userName:"",userToken:""},
       
  
      },
    }
  }


  addUrl = (domainurl) => {
    this.setState({ domainurl, isVerified: false })
  }

 

  componentDidMount() {

    let query = queryString.parse(window.location.search);
          let data=this.props.location.search.split("=")
        if(query.domainUrl){
            this.setState({
           
                domainurl:data[1]
              })
           
        

      
    }else if(query.connection_type){

      this.setState({
           
        connection_type:query.connection_type
      })
   
    }
 
    this.setState({
        isVerified: false
      })
   
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isVerified && !this.state.isVerified && prevState.isVerified !== this.state.isVerified) {
      this.setState({
        isVerified: false
      })
    }
  }

  next = (id) => {
     const {domainurl,connection_type} = this.state
    
   if (parseInt(this.props.match.params.current) == 1) {
    // this.SaveConnection()
      // this.props.history.push(`/${this.props.match.params.wId}/jiraoauth/${this.props.match.params.skill_id}/saveconnection`,{sessionid:this.state.sessionid})
      this.invokeChildMethod()

    //  this.props.history.push(`/${this.props.match.params.wId}/jiraoauth/${this.props.match.params.skill_id}/saveconnection`,{sessionid:this.state.sessionid})
    }else if (parseInt(this.props.match.params.current) == 2){
              this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=channel_preferences`,{openDefaultModal:true})
    }
    else {
 
      if (parseInt(this.props.match.params.current) == 0) {
        if (!this.state.domainurl || !validURL(this.state.domainurl)) {
          message.error("Enter a Valid Confluence site URL")
        }
        else {
          this.setState({ loading: true, showError: false })
          this.state.domainurl=this.state.domainurl.trim()
          this.state.domainurl= this.state.domainurl[this.state.domainurl.length-1]=="/"?this.state.domainurl.substring(0,this.state.domainurl.length-1):this.state.domainurl
          let obj={"metadata.domain_url":this.state.domainurl,linked:true,"metadata.connected_by":this.props.user._id,"metadata.connected_at":Date.now(),"metadata.connection_type" : this.state.connection_type}

          if(connection_type=== 'server' && domainurl.includes('atlassian.net')){
            Modal.confirm({
              title: 'It appears that you are connecting to a Confluence Cloud site, click "Proceed" to continue to connect to Confluence Cloud. Click "Cancel" to continue to connect to Confluence Server/DC site.',
              okText: 'Proceed',
              // maskClosable : true,
              keyboard : false,
              onOk: () => {
                this.setState({connection_type:'cloud'})
                obj["metadata.connection_type"] = 'cloud'
                this.validateUrl(obj)
              },
              onCancel : () => this.validateUrl(obj),
              okType: 'danger'
            })
          }else if (connection_type === 'cloud' && !domainurl.includes('atlassian.net')){
            Modal.confirm({
              title: 'It appears that you are connecting to a Confluence Server/DC site, click "Proceed" to continue to connect to Confluence Server/DC. Click "Cancel" to continue to connect to Confluence Cloud site.',
              okText: 'Proceed',
              // maskClosable : true,
              keyboard : false,
              onOk: () => {
                this.setState({connection_type:'server'})
                obj["metadata.connection_type"] = 'server'
                this.validateUrl(obj)
              },
              onCancel : () => this.validateUrl(obj),
              okType: 'danger'
            }) 
          }else this.validateUrl(obj)


//           let validUrlInfo = await  this.props.updateSkill(this.props.match.params.skill_id, this.props.match.params.wId, obj)
// // console.log("hello")
//           if (validUrlInfo) {
//             this.setState({ loading: false, showError: false })
//             // let { instanceInfo } = validUrlInfo;
//             // this.setState((prevState) => ({ current: prevState.current + 1, loading: false }))
//             // this.props.addDomainURL(this.state.domainurl, instanceInfo).then(() => {
//               this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/1?domainUrl=${this.state.domainurl}&connection_type=${this.state.connection_type}`)
//           //  })
//           }
//           else {
//             this.setState({ loading: false, showError: true })
//           }
        }

        return;
      } else {  // Current Step is 1
        // this.props.history.push(`/${this.props.match.params.wId}/wikiConnectionSteps/${this.props.match.params.skill_id}`)
        this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/2?connection_type=${this.state.connection_type}`)
      }
    }
  }

  validateUrl = async (obj) => {
    // console.log(obj)
    let validUrlInfo = await  this.props.updateSkill(this.props.match.params.skill_id, this.props.match.params.wId, obj)
              if (validUrlInfo) {
                this.setState({ loading: false, showError: false })
                // let { instanceInfo } = validUrlInfo;
                // this.setState((prevState) => ({ current: prevState.current + 1, loading: false }))
                // this.props.addDomainURL(this.state.domainurl, instanceInfo).then(() => {
                  this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/1?domainUrl=${this.state.domainurl}&connection_type=${obj['metadata.connection_type']}`)
              //  })
              }
              else {
                this.setState({ loading: false, showError: true })
              }
  }

  acceptMethods(invokeChildMethod) {
     
    this.invokeChildMethod = invokeChildMethod
  }
//   submitTokenData = () => {

//     this.invokeChildMethod()

//   };
  previous = () => {

    if (!this.state.domainurl) {
      return message.error("Enter a Valid Confluence site URL")
    }

    this.setState((prevState) => ({ current: prevState.current - 1 }))
    let current = parseInt(this.props.match.params.current)
    if (current === 1) {
      this.setState({ isVerified: false })
    }

    if(current === 2){
      this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/1?domainUrl=${this.state.domainurl}&connection_type=${this.state.connection_type}`)
    }else this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/${current - 1}?connection_type=${this.state.connection_type}`)

    this.setState((prevState) => ({ current: prevState.current - 1 }))
  }

  verify = async () => {
    this.setState({ loading: true })
    if (!this.state.domainurl) {
      this.setState({ loading: false })
      return message.error("Enter a Valid Confluence site URL")
    }
    let validUrlInfo = await validateDomainUrl(this.props.match.params.wId, this.state.domainurl);
    if (validUrlInfo && validUrlInfo.instanceInfo) {
      message.success("Confluence URL successfully verified.")
      this.setState({
        loading: false,
        isVerified: true,
        showError: false,
        instanceInfo: validUrlInfo.instanceInfo
      })
    } else if (!validUrlInfo || !validUrlInfo.instanceInfo) {
      this.setState({
        loading: false,
        showError: true
      })
    }
  }

  render() {
    const { loading } = this.state;
    let { current } = this.props.match.params;
    current = parseInt(current);
// console.log(this.props.location.search==="?domainUrl")
      // Confirm redux has domainURL. Else send to 0 step
      let query = queryString.parse(window.location.search);

    if (current === 1 /* || current === 2 */) {
      
    

    if(query.domainUrl){
       

        }else{
            this.props.history.push(`/${this.props.match.params.wId}/confluenceOuath/${this.props.match.params.skill_id}/0?connection_type=${query.connection_type}`)
            return <></>    
        }

     
    }
   
  

    const steps = [
      {
        title: "Confluence URL",
        content: (
          <DomainUrl domainURL={this.state.domainurl} isVerified={this.state.isVerified} loading={this.state.loading} showError={this.state.showError} next={this.next} addUrl={this.addUrl} isCloud={query.connection_type === 'cloud' ? true : false} verify={this.verify} isConfluence={true}/>
        )
      },
      {
        title: "Add Token",
        content: (
          <JiraToken
            data={this.state.data}
            wiki_type={this.state.connection_type}
            moveToNextStep={this.next}
            domain_url={this.state.domainurl}
            shareMethods={this.acceptMethods.bind(this)}
            skill_id={this.props.match.params.skill_id}
            showStyles={true}
            closeModal={false}
            fromConnectionOnboarding={true}
            currentSkill={{name:"Wiki"}}
          />
        )
      },
      /* {
        title: "Link Confluence Space(s)",
        content: (
          <LinkConfluenceToSlackChannel/>
        )
      } */
     
    //   {
    //     title: "Success",
    //     content: (
    //       <Success
    //         data={this.state.data}
    //         skill_id={this.state.data.skill_id}
    //       />
    //     )
    //   }
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
      <Content style={{ padding: "16px 16px 32px 24px", marginLeft:0 }}>
        {/* <div className="stepper-container-horizontal">
          <div className="stepper-wrapper-horizontal">
            {stepsDisplay}
          </div>
        </div> */}
        <Steps current={current}>
          {steps.map((step, index) => <Step title={step.title} />)}
        </Steps>
        <div className={`step-content ${localStorage.getItem("theme") == "default" ? "step-content-bg-default" : "step-content-bg-dark"}`}>
          {steps[current].content}
        </div>
        <div className="step-buttons">
          {/* {
            current == 0 && <Button type="primary" loading={this.state.loading} onClick={(this.state.isVerified||this.state.connection_type=="server") ? this.next : this.verify}>{(this.state.isVerified||this.state.connection_type=="server")? "Click here to proceed" : "Verify"}</Button>
          } */}

{
            current == 0 && <Button type="primary" loading={this.state.loading} onClick={ this.next }>{ "Click here to proceed"}</Button>
          }
          {(!(current == 0)) && <Button onClick={this.previous} >
            Previous
        </Button>
          }
          {current !== 0 &&
            <Button type="primary" onClick={this.next} loading={loading} style={{ marginLeft: current === 2 && "10px" }}>
              {current === 1? "Add" : current === 2 ? "Setup Wiki Channel" : "Next"}
            </Button>
          }
        </div>
      </Content>
    )
  }
}

const mapStateTopProps = (state) => {
    // console.log(state.OAuthReducer)
  return {
    oAuth: state.OAuthReducer,
    user: state.common_reducer.user,
  }
}


export default withRouter(
  connect(
    mapStateTopProps,
    { nextStep, addDomainURL,   updateSkill,
        submitTokenData }
  )(Jiraoauth)
) 


