import React, { Component } from 'react'
import queryString from "query-string";
import { checkJiraStatus } from '../../utils/utils'
import { getGuestOAuthAccessTokensForUsers } from "../skills/skills_action"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class JiraoauthCallback extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.skills !== prevProps.skills) {
            const { skills } = this.props
            const jiraSkill = skills.find(skill => skill.name === 'Jira')
            const isJiraEnabled = jiraSkill && jiraSkill.skill_metadata ? checkJiraStatus(jiraSkill.skill_metadata) : true

            let code = queryString.parse(this.props.location.search)
            // let oauthToken=code.oauth_token  
          
            let oauthverifier = code.oauth_verifier
            if (code.isUser) {
                if (oauthverifier === "denied") {
                    if (!isJiraEnabled /* jiraSkill && jiraSkill.skill_metadata.disabled */)
                        this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${this.props.match.params.skill_id}`)
                    else
                        this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${code.sub_skill}?view=personal_preferences`)

                }
                else {
                    this.props.getGuestOAuthAccessTokensForUsers(this.props.match.params.wId, oauthverifier, code.sessionid).then(res => {
                        if (res && res.data && res.data.success) {
                            const {channelview}=res.data
                                // / 60b7130e4e6cc132ba0a990a / skills / 60b7130e60cb173b7b4d3ac5 / jira_service_desk ? view = channel_preferences & channel_name=trup & channel_id=C031U60A2MB & channel_type=support
                            this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${code.sub_skill}?view=${channelview.view}&channel_id=${channelview.channel_id}&channel_name=${channelview.channel_name}&channel_type=${channelview.channel_type}`)
                                
                                // "/" + this.props.match.params.wId + "/jira_user_welcome/" + this.props.match.params.skill_id + `?sub_skill=${code.sub_skill}`)

                        }
                        else {

                        }
                    })
                }

            }
          
            //     let response=await getAccessTokens(this.props.match.params.wId,oauthverifier)
            // if(response.success){
            // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}`)
            // }
            // else{

            // }
        }
    }
    render() {
        return (
            <div>
            
                {/* {this.state.loading?"Loading":"Connected"} */}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        skills: store.skills.skills
    }
}

export default withRouter(connect(mapStateToProps, { getGuestOAuthAccessTokensForUsers })(JiraoauthCallback));


