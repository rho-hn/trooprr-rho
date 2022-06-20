import React, { Component } from "react";
import "./jiraoauth.css";
import { Button, /* Image, */ Typography, Input, Alert/* , Row, Col */ } from "antd";
// import ExampleImage from "../../media/troopr-jira-configure-app-link.png"
import JiraConnectionRequestModal from "../auth/jira/jira_connecition_requestModal";
import { withRouter } from "react-router-dom";
import queryString from 'query-string'

const { Title, Text } = Typography;
class ApplicationUrl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false,
      textToCopy: "https://app.troopr.io",
      showPopUp: false,
      parsedQueryString : {}
    };
  }

  componentDidMount(){
    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({parsedQueryString})
  }

  copyToClipBoard = () => {
    navigator.clipboard.writeText(this.state.textToCopy);
    this.setState({ copied: true });
  };


  JiraNotifyModal = () => {
    this.setState({
      showPopUp: !this.state.showPopUp
    });
  };

  render() {
    const {parsedQueryString} = this.state
    let url = `${this.props.oAuth && this.props.oAuth.instanceInfo ? this.props.oAuth.instanceInfo.baseUrl : this.props.domainurl}/plugins/servlet/applinks/listApplicationLinks`;
    return (
      <div className='application-wrapper'>
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Create Application Link in Jira</Title>
            <>
              <Alert
                message={"Only a Jira Admin can complete this setup"}
                type="warning"
                showIcon
                action = {<Button type="link" onClick={this.JiraNotifyModal}>
                Click here to request your Jira admin
              </Button>
            }
              />

              {this.state.showPopUp && (
                <JiraConnectionRequestModal
                skill_id={this.props.match.params.skill_id}
                  modal={this.state.showPopUp}
                  toggle={() =>
                    this.setState({
                      showPopUp: !this.state.showPopUp
                    })
                  }
                />
              )}
            </>
          <br/>
        </div>
        <div style={{ display: "flex",
                  justifyContent: 'center',
                  alignItems: 'center'
      }}>
          <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        maxWidth: 400,
                        minWidth: 400
                      }}
          >
            <div
                           style={{
                            marginBottom: 32,
                            display: 'flex',
                            // flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}
             >
              <div style={{ textAlign: 'left', marginBottom: 8 }}>
              <Text strong>Step 1 of 8: </Text>
              </div>

              <Button type="link" size="small" href={url} target='_blank'>
              Go to Jira application link page
              </Button>
            </div>
            
            <div style={{ marginBottom: 8, textAlign: 'left' }}>
              <Text strong>Step 2 of 8: </Text>
              <Text style={{ marginLeft: 8 }}>
                Copy the below URL and paste in the application <br></br> link page as
                shown in the image on the right and click on  <br></br>"Create new link"
                button
              </Text>
            </div>

            <div style={{ marginBottom: 32, textAlign: 'left' }}>
              <Input
                size="small"
                style={{ width: 200 }}
                value="https://app.troopr.io"
                disabled
              />
              <Button style={{ marginLeft: 4 }} type="link" onClick={this.copyToClipBoard}>
                {this.state.copied ? <span>&#10003; Copied</span> : "Copy"}
              </Button>
              <br/>
              <Text style={{ marginBottom: 32 }} type="secondary">
              * You can enter any unique URL here
            </Text>
            </div>
            <div style={{ marginBottom: 32, textAlign: 'left' }}>
              <Text strong>Step 3 of 8: </Text>
              <Text>
              Click on "Continue" button in the Configure<br/> Application URL form
              </Text>
            </div>
          </div>
          <div style={{ marginLeft: 32 }}>
            {/* <Image
              style={{
                'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
              }}
              width={300}
              src={ExampleImage}
              alt="Example Image"
            /> */}
            {parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_service_desk' ? 
             <iframe /* width="560" height="315" */ className="iframe-styling" src="https://www.youtube.com/embed/gluHF8Cdgm4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
             : parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_reports' ? 
             <iframe className="iframe-styling" src="https://www.youtube.com/embed/O_BLLChf6mg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> 
             :
             <iframe /* width="560" height="315" */ /* style={{width : '30vw', height : '40vh'}} */ className="iframe-styling" src="https://www.youtube.com/embed/c532RMZ3yjY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
          </div>

        </div>
      </div>
    );
  }
}

export default withRouter(ApplicationUrl);
