import React, { Component } from 'react'
import { Button, Input, Typography } from "antd"
import "./jiraoauth.css"
import queryString from 'query-string'
// import IncomingLinkImage from "../../media/applicationLink2.PNG"
const { Title, Text } = Typography;
class CreateIncomingLink extends Component {
    constructor(props) {
        super(props)

        this.state = {
            textToCopy: "Troopr",
            copied: false,
            parsedQueryString : {}
        }
    }

    componentDidMount(){
        const parsedQueryString = queryString.parse(window.location.search);
        this.setState({parsedQueryString})
      }
    
    copytoClipBoard = () => {
        navigator.clipboard.writeText(this.state.textToCopy)
        this.setState({ copied: true })
    }
    render() {
        const {parsedQueryString} = this.state
        return <div className="link-wrapper" >
        <div style={{ textAlign: "center" }}>
                <Title level={3}>Configure the Jira Application Link</Title>
                </div>
                <br/>
            <div style={{ display: "flex"/* , justifyContent: "center" */, alignItems: 'center' }}>
                <div className="link-content">

                    <div 
                                  style={{
                                    marginBottom: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                  }}
                    >
                        <Text strong>Step 4 of 8: </Text>
                        <Text>Copy and use below application name</Text>
                    </div>
                    <div 
                                  style={{
                                    marginBottom: 32,
                                    display: 'flex'
                                    // alignItems: 'flex-start'
                                  }}
                    >
                        <Input
                            size="small"
                            style={{ width: 200 }} disabled value={this.state.textToCopy}
                        />
                        <Button type="link" onClick={this.copytoClipBoard}>{this.state.copied ? <span>&#10003; Copied</span> : "Copy"}</Button>
                    </div>

                    <div
                                  style={{
                                    marginBottom: 32,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    textAlign: 'left'
                                  }}
                    >
                        <Text strong>Step 5 of 8: </Text>
                        <Text>Ignore all other fields and go to the bottom of the form <br></br>and click on "Create incoming link" check box</Text>
                        
                        <Text type="secondary">(Ignore all other fields)</Text>
                    
                    </div>

                    <div 
                                  style={{
                                    // marginBottom: 32,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    textAlign: 'left'
                                  }}
                    >
                        <Text strong>Step 6 of 8: </Text>
                        <Text>Click on "Continue"</Text>
                    </div>
                </div>
                <div /* className="link-image" */>
                    {/* <img 
                    style={{
                        // '-webkit-box-shadow': '3px 3px 5px 6px #ccc',
                        // '-moz-box-shadow': '3px 3px 5px 6px #ccc',
                        // 'box-shadow': '3px 3px 5px 6px #ccc'
                'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                      }}
                    src={IncomingLinkImage} alt="slack" height="100%" width="100%" hspace="10" /> */}
                    {parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_service_desk' ? 
                    <iframe /* width="560" height="315" */ className='iframe-styling' src="https://www.youtube.com/embed/TiWzo_rK8FI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    : parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_reports' ? 
                    <iframe className='iframe-styling' src="https://www.youtube.com/embed/gRUu1T93d5o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    :
                    <iframe /* width="560" height="315" */ className='iframe-styling' src="https://www.youtube.com/embed/Fz-Cm9PwoB0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                </div>

            </div>
        </div>

    }
}

export default CreateIncomingLink