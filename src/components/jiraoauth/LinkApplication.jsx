import React, { Component } from 'react'
import { Button, Input, Typography } from "antd"
import queryString from 'query-string'
// import ConsumerPng from "../../media/consumer.png"
const { TextArea } = Input;
const { Title, Text } = Typography;

class LinkApplication extends Component {
    constructor(props) {
        super(props)

        this.state = {
            consumername: "troopr",
            copied: false,
            publickey: this.props.publicKey,
            consumerkeycopied: false,
            consumernamecopied: false,
            publickeycopied: false,
            consumerkey: this.props.consumerkey,
            parsedQueryString : {}
        }
    }

    componentDidMount(){
        const parsedQueryString = queryString.parse(window.location.search);
        this.setState({parsedQueryString})
      }
    
    copytoClipBoard = (type) => {
        navigator.clipboard.writeText(this.state[type])
        this.setState({ [type + "copied"]: true })
        setTimeout(() => {
            this.setState({ [type + "copied"]: false })
        }, 1000)
    }
    render() {
        const {parsedQueryString} = this.state
        return (
            <div className="link-wrapper">

                <div style={{ textAlign: "center" }}>
                    <Title level={3}>Secure the Jira Application Link</Title>
                <br/>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="link-content">
                    <div
              style={{
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
            >
                        <div style={{ marginBottom: 8 }}>
                            <Text strong>Step 7 of 8: </Text>
                            <Text>Copy and use below field values</Text>
                        </div>

                        <div style={{ marginBottom: 4 }}>
                        <div style={{ minWidth: '120px' }}>
                            <Text>Consumer Key: </Text>
                            </div>
                            <Input
                                size="small"
                                style={{ width: 200 }} disabled value={this.state.consumerkey} />
                            <Button
                                type="link"
                                onClick={() => this.copytoClipBoard("consumerkey")}
                            >{this.state.consumerkeycopied ? <span>&#10003; Copied</span> : "Copy"}</Button>
                        </div>
                        <div style={{ marginBottom: 4 }}>
                        <div style={{ minWidth: '120px' }}>
                            <Text>Consumer Name: </Text>
                            </div>
                            <Input
                                size="small"
                                style={{ width: 200 }} disabled value={this.state.consumername} />
                            <Button
                                type="link"
                                onClick={() => this.copytoClipBoard("consumername")}
                            >{this.state.consumernamecopied ? <span>&#10003; Copied</span> : "Copy"}</Button>
                        </div>
                        <div style={{ marginBottom: 4 }}>
                        <div style={{ minWidth: '120px' }}>
                            <Text>Public Key: </Text>
                            </div>
                            <Input
                                size="small"
                                style={{ width: 200 }} disabled value={this.state.publickey} />
                            <Button
                                type="link"
                                onClick={() => this.copytoClipBoard("publickey")}
                            >{this.state.publickeycopied ? <span>&#10003; Copied</span> : "Copy"}</Button>
                        </div>
                        </div>

                        <div>
                            <Text strong>Step 8 of 8: </Text>
                            <Text>Click on "Continue" to create the application link</Text>
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
                        src={ConsumerPng} alt="slack" height="100%" width="100%" hspace="10" /> */}
                    {parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_service_desk' ? 
                    <iframe /* width="560" height="315" */ className='iframe-styling' src="https://www.youtube.com/embed/qFrPAcv1Wns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    : parsedQueryString && parsedQueryString.sub_skill && parsedQueryString.sub_skill === 'jira_reports' ? 
                    <iframe className='iframe-styling' src="https://www.youtube.com/embed/8QdHWaNicjM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    :
                    <iframe /* width="560" height="315" */ className='iframe-styling' src="https://www.youtube.com/embed/8aCiE9UXS0I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                    </div>

                </div>
            </div>
        )
    }
}

export default LinkApplication
