import React, { Component } from 'react'
import { Input, Button, Alert, Modal } from 'antd';
import "./jiraoauth.css"
import { Typography,Tooltip } from "antd"
import { QuestionCircleOutlined,UserOutlined } from '@ant-design/icons';
import JiraConnectionRequestModal from "../auth/jira/jira_connecition_requestModal";
import JiraDomainUrlExampleModal from "../auth/jira/JiraDomainUrlExampleModal";
import { withRouter } from "react-router-dom";
const { Title,Text, Link } = Typography;
class DomainUrl extends Component {
    constructor(props){
        super(props)
        this.state = {
            isVerified: false,
            showPopUp : false,
            jiraDomianExampleModalVisible : false,
            showError : false
        }
    }
    componentDidMount() {
        this.setState({
            isVerified: false
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isVerified !== this.props.isVerified) {
            this.setState({
                isVerified: this.props.isVerified
            })
        }

        if (prevProps.showError !== this.props.showError) {
            if(this.props.showError) this.errorModal()
        }
    }

    errorModal = () => {
        Modal.error({
            title: `Could not connect to your ${this.props.isConfluence ? 'Confluence' : 'Jira'}`,
            content: (
            <div style={{ maxHeight: 350, overflow: "auto", display: "flex", flexDirection: "column" }}>
                {this.props.isCloud ? 
                <>
                <Text strong>Make sure you entered a valid site URL</Text>
                <Text type="secondary">{"Example : " + (this.props.isConfluence ? "https://acme.atlassian.net" : "https://domain-name.atlassian.net")}</Text>
                </>
                : 
                <>
                <Text strong>Make sure you entered a valid site URL</Text>
                <Text type="secondary">{`Example 1: https://${this.props.isConfluence ? 'confluence' : 'jira'}.yourdomain.com`}</Text>
                <Text type="secondary">{`Example 2: https://yourdomain.com/${this.props.isConfluence ? 'confluence' : 'jira'}`}</Text>
                <Text style={{ marginTop: 16, marginBottom: 8 }} strong>Try opening your firewall for Troopr</Text>
                <Text type="secondary" strong>For Inbound from Troopr Servers</Text>
                <Text type="secondary" copyable>54.212.48.54</Text>
                <Text type="secondary" style={{ marginTop: 8 }} strong>For Outbound to Troopr Servers (for webhook)</Text>
                <Text type="secondary" copyable>44.230.224.252 443</Text>
                <Text type="secondary" copyable>13.127.66.168 443</Text>
                {/* <Text style={{ marginTop: 16, marginBottom: 8 }} strong>Error details</Text>
                <Text>errrr! Error: unable to verify the first certificate\nat TLSSocket.onConnectSecure (node:_tls_wrap:1530:34)\nat TLSSocket.emit (node:events:390:28)\nat TLSSocket._finishInit (node:_tls_wrap:944:8)\nat TLSWrap.ssl.onhandshakedone (node:_tls_wrap:725:12) \ncode: \'UNABLE_TO_VERIFY_LEAF_SIGNATURE\'\n</Text> */}
                </>}
                {this.props.error && <><br /><Text>Error details:</Text>
                {JSON.stringify(this.props.error)}
                </>
                }
                </div>)

        })
    }
    render() {
        let example = `Example : https://${this.props.isConfluence ? 'Confluence' : 'Jira'}.troopr.io`;

        let errorDescription = (
            <div>
                <div>If your {this.props.isConfluence ? 'Confluence' : 'Jira'} instance Url is correct, try opening your firewall for Troopr.</div>
                <div style={{ marginBottom: "5px", marginTop: "5px" }}>Following are the relevant IP addresses:</div>
                <div>For Inbound from Troopr Servers</div>
                <div style={{ marginBottom: "5px" }}>54.212.48.54</div>
                <div>For Outbound to Troopr Servers (for webhook)</div>
                <div>44.230.224.252 443</div>
                <div>13.127.66.168 443</div>
            </div>
        )

        if (this.props.isCloud) {
            example = "Example : " + (this.props.isConfluence ? "https://acme.atlassian.net" : "https://domain-name.atlassian.net")

            errorDescription = (
                <div>
                    <div>Make sure you enter the whole url with your domain name: https://domain-name.atlassian.net</div>
                </div>
            )

        }

        const warning = (
            <div>
                <div>If your {this.props.isConfluence ? 'Confluence' : 'Jira'} Server has firewall enabled, try opening your firewall for Troopr.</div>
                <div>Following are the relevant IP addresses:</div>
                <div>For Inbound from Troopr Servers</div>
                <div>54.212.48.54</div>
                <div>For Outbound to Troopr Servers (for webhook)</div>
                <div>44.230.224.252 443</div>
                <div>13.127.66.168 443</div>
            </div>
        )

        return (


            <div className="domain-url-wrapper">
                {/* {this.props.showError && <div style={{ marginBottom: "10px",marginTop:!this.props.isCloud && '160px' }}>

                    <Alert
                        message={`Error while connecting your ${this.props.isConfluence ? 'Confluence' : 'Jira'} Instance. Make sure you entered a valid site URL`}
                        description={errorDescription}
                        type="error"

                    />

                </div>} */}
                {/* <div style={{marginBottom:"10px",fontSize:"22px",fontWeight:"bold"}}>Let's connect to Jira</div> */}
                <Title level={3}>Let's connect to {this.props.isConfluence ? 'Confluence' : 'Jira'}</Title>
                {/* this.props.isConfluence ? '' :  */ <div style={{textAlign : 'center'}}>
                    {/* <Alert
                        message={"Only a Jira Admin can complete this setup"}
                        type="warning"
                        showIcon
                        action={<Button type="link" onClick={() => this.setState({
                            showPopUp: !this.state.showPopUp
                        })}>
                            Click here to request your Jira admin
                        </Button>
                        }
                    /> */}


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
                    {this.state.jiraDomianExampleModalVisible && (
                        <JiraDomainUrlExampleModal
                            modal={this.state.jiraDomianExampleModalVisible}
                            toggle={() =>
                                this.setState({
                                    jiraDomianExampleModalVisible: false
                                })
                            }
                            isCloud = {this.props.isCloud}
                            isConfluence={this.props.isConfluence}
                        />
                    )}
                </div>}
                {!this.props.isCloud /* &&!this.props.showError */&&<Alert 
                description={warning}
                type='warning'
                />}
                <div style={{ marginBottom: "20px", marginTop: "20px", width: "400px",textAlign:'center' }} className="domain-url">
                {/* <Tooltip title={example}> */}
                <Text strong>Enter {this.props.isConfluence ? 'Confluence' : 'Jira'} site URL {/* <InfoCircleOutlined /> */}</Text>
                {/* </Tooltip> */}
                    <Input value={this.props.domainURL} defaultValue={this.props.domainURL} size="large" onChange={(e) => { this.props.addUrl(e.target.value) }} placeholder={this.props.isConfluence ? 'https://acme.atlassian.net' : `Enter Jira site URL`} />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Text type='secondary'>{example}</Text>
                        {/* <div>Remove Note : Remove trailing forward slash (/) in the host URL</div> */}
                    </div>
                    <br/>
                    {this.props.isConfluence && 
                    <Button type="link" onClick={() => {this.setState({jiraDomianExampleModalVisible : true})}} icon={<QuestionCircleOutlined />}>What is Confluence site URL?</Button>
                    }
                    {!this.props.isConfluence && <div>
                        <Button type="link" onClick={() => {this.setState({jiraDomianExampleModalVisible : true})}} icon={<QuestionCircleOutlined />}>What is Jira site URL?</Button>|<Button type="link" onClick={() => this.setState({
                            showPopUp: !this.state.showPopUp
                        })} icon={<UserOutlined />}>I am not Jira admin</Button>
                    </div>}
                </div>
                {/* <Button loading={this.props.loading||false} type="primary" onClick={this.state.isVerified ? this.props.next : this.props.verify}>{this.state.isVerified ? "Connect" : "Verify"}</Button>    */}

            </div>
        )
    }
}

// export default DomainUrl

export default withRouter(DomainUrl);
