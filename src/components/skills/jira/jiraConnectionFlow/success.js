import React from 'react'
import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Result, Button,Alert, Typography, Row, Col } from "antd";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"
import queryString from "query-string"

const {Text, Title} = Typography

const success = (props) => {
    const parsedQueryString = queryString.parse(props.location.search)
    const {linking} = props.data
    const app = localStorage.getItem("app")||"AE4FF42BA"
    const teamId=props.teamId.id||localStorage.getItem("teamId")
    let slackurl=!props.data.linking.channel.id?`https://slack.com/app_redirect?app=${app}&team=${teamId}`:`https://slack.com/app_redirect?team=${teamId}&channel=${props.data.linking.channel.id}`, agentChannelUrl, supportChannelUrl;
    if(parsedQueryString.sub_skill === 'jira_service_desk'){
      agentChannelUrl = !(linking && linking.helpdeskChannels && linking.helpdeskChannels.agentChannelData) ?`https://slack.com/app_redirect?app=${app}&team=${teamId}`:`https://slack.com/app_redirect?team=${teamId}&channel=${linking.helpdeskChannels.agentChannelData.id}`
      supportChannelUrl = !(linking && linking.helpdeskChannels  && linking.helpdeskChannels.supportChannelData) ?`https://slack.com/app_redirect?app=${app}&team=${teamId}`:`https://slack.com/app_redirect?team=${teamId}&channel=${linking.helpdeskChannels.supportChannelData.id}`
    }
     let buttonText=props.data.linking.channel.id?`#${props.data.linking.channel.name}`:`Slack`

     const jiraSkill = props.skills.find((skill) => skill.name === "Jira");



     let jiraUrl, jiraDomainName;
     if (jiraSkill) {
       let type = jiraSkill.skill_metadata
         ? jiraSkill.skill_metadata &&
           (jiraSkill.skill_metadata.metadata.server_type == "jira_server" || jiraSkill.skill_metadata.metadata.server_type == "jira_server_oauth")
         : jiraSkill.metadata && (jiraSkill.metadata.server_type === "jira_server" || jiraSkill.metadata.server_type === "jira_server_oauth");

       if (type) {
         jiraUrl = jiraSkill.skill_metadata ? jiraSkill.skill_metadata.metadata.domain_url : jiraSkill.metadata.domain_url;
         jiraDomainName = jiraUrl;
       } else {
         let name = jiraSkill.skill_metadata ? jiraSkill.skill_metadata.metadata.domain_name : jiraSkill.metadata.domain_name;
         jiraUrl = jiraSkill.skill_metadata
           ? jiraSkill.skill_metadata.metadata.domain_url
           : jiraSkill.metadata.domain_url
           ? jiraSkill.metadata.domain_url
           : `https://${name}.atlassian.net`;

         jiraDomainName = jiraUrl;
       }
     }

     const helpdesk_button_style = {
       position : 'absolute',
       bottom : '0px',
       right : '0px',
       left : '0px'
     }

    return (
      <div>
        {parsedQueryString.sub_skill === "jira_software" ? (
          <div style={{ textAlign: "center", width: "50vw" }}>
            <Title level={3}>Try Jira action in Slack</Title>
            <Text>Congratulations on successfully setting up your Project channel.</Text> <br />
            <br />
            <iframe
              width='380'
              height='190'
              src='https://www.youtube.com/embed/voStiKcicVI'
              title='YouTube video player'
              frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>{" "}
            <br />
            Try unfurling a Jira issue in the channel now. Type any valid Jira issue key in the channel and see how Troopr shows the issue context in
            the message thread. <br />
            <br />
            {linking && linking.channel && linking.channel.id && linking.channel.name ? (
              <div>
                <Button href={slackurl} target={"_blank"} type='primary'>
                  Go to #{linking.channel.name}
                </Button>{" "}
                <br />
                <Button
                  style={{ marginTop: "5px" }}
                  type='link'
                  onClick={() =>
                    props.history.push(
                      `/${props.match.params.wId}/skills/${
                        jiraSkill.skill_metadata ? jiraSkill.skill_metadata._id : jiraSkill._id
                      }/jira_software?view=channel_preferences&channel_name=${linking.channel.name}&channel_id=${
                        linking.channel.id
                      }&channel_type=project`
                    )
                  }
                >
                  Customize the project channel behavior
                </Button>
              </div>
            ) : (
              <Button onClick={() => props.goToChannelDefaultStep()}>Setup Project Channel Default</Button>
            )}
          </div>
        ) : parsedQueryString.sub_skill === "jira_service_desk" ? (
          <div style={{ textAlign: "center", width: "70vw" }}>
            <Title level={3}>Try Jira action in Slack</Title>
            <Text>Congratulations on successfully setting up your Helpdesk channels.</Text> <br /> <br />
            <Row gutter={60} style={{ justifyContent: "center" }}>
              <Col span={10}>
                <div style={{ paddingBottom: "60px" }}>
                  <iframe
                    style={{ height: "60%", width: "90%" }}
                    src='https://www.youtube.com/embed/_q5D3IvoF5E'
                    title='YouTube video player'
                    frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  ></iframe>{" "}
                  <br />
                  Convert a message to a Jira ticket by adding :ticket: emoji to it.
                </div>
                <br /> <br />
                {linking &&
                linking.helpdeskChannels &&
                linking.helpdeskChannels.supportChannelData &&
                linking.helpdeskChannels.supportChannelData.id &&
                linking.helpdeskChannels.supportChannelData.name ? (
                  <div style={helpdesk_button_style}>
                    <Button href={supportChannelUrl} target={"_blank"} type='primary'>
                      Go to #{linking.helpdeskChannels.supportChannelData.name}
                    </Button>{" "}
                    <br />
                    <Button
                      style={{ marginTop: "5px" }}
                      type='link'
                      onClick={() =>
                        props.history.push(
                          `/${props.match.params.wId}/skills/${
                            jiraSkill.skill_metadata ? jiraSkill.skill_metadata._id : jiraSkill._id
                          }/jira_service_desk?view=channel_preferences&channel_name=${linking.helpdeskChannels.supportChannelData.name}&channel_id=${
                            linking.helpdeskChannels.supportChannelData.id
                          }&channel_type=support`
                        )
                      }
                    >
                      Customize the support channel behavior
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => props.goToChannelDefaultStep(0)}>Setup Support Channel Default</Button>
                )}
              </Col>

              <Col span={10}>
                {/* <Text>Congratulations on successfully setting up your Helpdesk channels.</Text> <br /> */}
                <div style={{ paddingBottom: "60px" }}>
                  <iframe
                    style={{ height: "60%", width: "90%" }}
                    src='https://www.youtube.com/embed/OiB6te7nr9k'
                    title='YouTube video player'
                    frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  ></iframe>{" "}
                  <br />
                  The ticket created in the “Support” channel will appear in this channel. Post a message in the thread and see it updating in the
                  Jira ticket.
                </div>
                <br /> <br />
                {linking &&
                linking.helpdeskChannels &&
                linking.helpdeskChannels.agentChannelData &&
                linking.helpdeskChannels.agentChannelData.id &&
                linking.helpdeskChannels.agentChannelData.name ? (
                  <div style={helpdesk_button_style}>
                    <Button href={agentChannelUrl} type='primary' target={"_blank"}>
                      Go to #{linking.helpdeskChannels.agentChannelData.name}
                    </Button>{" "}
                    <br />
                    <Button
                      style={{ marginTop: "5px" }}
                      type='link'
                      onClick={() =>
                        props.history.push(
                          `/${props.match.params.wId}/skills/${
                            jiraSkill.skill_metadata ? jiraSkill.skill_metadata._id : jiraSkill._id
                          }/jira_service_desk?view=channel_preferences&channel_name=${linking.helpdeskChannels.agentChannelData.name}&channel_id=${
                            linking.helpdeskChannels.agentChannelData.id
                          }&channel_type=agent`
                        )
                      }
                    >
                      Customize the agent channel behavior
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => props.goToChannelDefaultStep(1)}>Setup Agent Channel Default</Button>
                )}
              </Col>
            </Row>
          </div>
        ) : parsedQueryString.sub_skill === "jira_reports" ? (
          <div style={{ textAlign: "center", width: "50vw" }}>
            <Title level={3}>Interact with the Report in Slack</Title>
            <Text>Congratulations! Your demo report was setup successfully and posted to {linking && linking.channel && linking.channel.id && linking.channel.name ? linking.channel.name : ''}.</Text>
            <br /> <br />
            <iframe
              width='380'
              height='190'
              src='https://www.youtube.com/embed/cqqDg-xPFG4'
              title='YouTube video player'
              frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>{" "}
            <br /> <br />
            Click on the "Show Issues" button in the report to see the list of issues. <br />
            <br />
            {linking && linking.channel && linking.channel.id && linking.channel.name ? (
              <div>
                <Button href={slackurl} type='primary' target={"_blank"}>
                  Go to #{linking.channel.name}
                </Button>{" "}
                <br />
                <Button
                  style={{ marginTop: "5px" }}
                  type='link'
                  onClick={() =>{
                    let link = `/${props.match.params.wId}/skills/${
                      jiraSkill.skill_metadata ? jiraSkill.skill_metadata._id : jiraSkill._id
                    }/jira_reports?view=reports&from=jira_conection_onboarding`
                    if(linking && linking.info && linking.info[0] && linking.info[0]._id) link += `&report_id=${linking.info[0]._id}`
                    props.history.push(link)
                  }
                  }
                >
                  Customize this Report
                </Button>
              </div>
            ) : (
              <Button onClick={() => props.goToChannelDefaultStep()}>Setup Project Channel Default</Button>
            )}
          </div>
        ) : (
          <Result
            icon={<CheckCircleOutlined />}
            status='success'
            // title="Success"
            style={{ padding: "0" }}
            extra={[
              <div>
                <Alert
                  message={
                    jiraSkill && jiraSkill.skill_metadata.disabled ? (
                      <div style={{ textAlign: "center" }}>
                        Successfully connected to:{" "}
                        <a href={jiraUrl} target='_blank'>
                          {jiraDomainName}
                        </a>
                        <br />
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        To link more Jira projects to your Slack channels, invite Troopr to that channel and follow instructions.
                        <br />
                        type /invite @troopr or click on "Add App" in that channel and Choose "Troopr Assistant"
                        <br />
                        <br />
                        Access Troopr commands from any channel by typing /troopr
                        <br />
                        <br />
                        Visit "Troopr Assistant" Home, your new Jira project Hub in Slack, to get started.
                      </div>
                    )
                  }
                  type='success'
                  // showIcon
                  style={{ marginBottom: "25px", width: "55vw", textAlign: "left" }}
                />
                <Button icon={<SlackOutlined />} href={slackurl} key='slack'>
                  Go to {buttonText}
                </Button>
                <br />
              </div>,
            ]}
          />
        )}
      </div>
    );
}
const mapStateToProps=(state) =>{
  return{
    teamId: state.skills.team,
    skills: state.skills.skills,

}}

export default withRouter(connect(mapStateToProps,{})(success));
