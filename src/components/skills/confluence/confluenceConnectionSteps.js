import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Steps, Typography, Button, message } from "antd";
import { createNewChannel, addConfluenceChannelConfig, getAssisantSkills } from "../skills_action";
import "../jira/jiraConnectionFlow/jirasteps.css";

const { Content } = Layout;
const { Step } = Steps;
const { Title } = Typography;

class confluenceConnectionSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      channel: {},
      step: 0,
    };
  }
  componentDidMount() {
    message.success("Wiki Connection Successful", 5);
    this.props.getAssisantSkills(this.props.match.params.wId);
  }

  creteDemoChannel = () => {
    this.setState({ loading: true });
    this.props.createNewChannel(this.props.match.params.wId, "troopr-wiki-demo", /* type */ "connection_onboarding").then((data) => {
      if (data && data.success) {
        this.props
          .addConfluenceChannelConfig(
            this.props.match.params.wId,
            {
              workspace_id: this.props.match.params.wId,
              channel: data.channel,
              showCreateButton: true,
              isKeywordSearchActive: true,
              searchContent: true,
              auto_suggest: true,
              skill_id: this.props.match.params.skill_id,
            },
            /* addNewone */ true
          )
          .then((res) => {
            if (res.data && res.data.success) {
              this.setState({ loading: false, channel: data.channel, step: 1 });
            } else {
              message.error("Error creating defaults");
              this.setState({ loading: false });
            }
          });

        // this.props.history.push(
        //   `/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=${this.props.skillView.view}&channel_name=${data.channel.name}&channel_id=${data.channel.id}`
        // );
      } else {
        message.error("Error creating demo channel");
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { loading, step, channel } = this.state;
    const { team } = this.props;

    const app = localStorage.getItem("app") || "AE4FF42BA";
    const teamId = team.id || localStorage.getItem("teamId");
    let slackurl = !channel.id
      ? `https://slack.com/app_redirect?app=${app}&team=${teamId}`
      : `https://slack.com/app_redirect?team=${teamId}&channel=${channel.id}`;

    const steps = [
      {
        title: "Setup Demo Channel",
        Content: (
          <div
            style={{
              // minHeight: 400,
              maxHeight: 400,
              // overflow: 'scroll',
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // marginLeft: '20px',
            }}
          >
            <Title level={3} /* style={{marginTop : '100px'}} */>Setup Demo Wiki Channel</Title>
            <Title level={5} type='secondary' style={{ marginTop: 0 }}>
              This action will setup a demo wiki channel #troopr-wiki-demo
            </Title>
            <Title level={5} type='secondary' style={{ marginTop: 0 }}>
              Troopr will try to answer posts in this channel with matching articles from Confluence
            </Title>
          </div>
        ),
      },
      {
        title: "Success",
        Content: (
          <div style={{ textAlign: "center", width: "50vw" }}>
            <Title level={3}>Try Wiki action in Slack</Title>
            <Typography.Text>
              {channel.id ? `Demo Wiki channel #${channel.name} created. ` : ""}Troopr will try to answer posts in this channel with matching articles
              from Confluence. To customize the search behaviour, click customize below.
            </Typography.Text>{" "}
            <br />
            <br />
            <iframe
              width='380'
              height='190'
              src='https://www.youtube.com/embed/mJgDM4fhx5U'
              title='YouTube video player'
              frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
            <br />
            <br />
            <br />
            {channel && channel.id && channel.name ? (
              <div>
                <Button href={slackurl} target={"_blank"} type='primary'>
                  Go to #{channel.name}
                </Button>{" "}
                <br />
                <Button
                  style={{ marginTop: "5px" }}
                  type='link'
                  onClick={() =>
                    this.props.history.push(
                      `/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=channel_preferences&channel_name=${channel.name}&channel_id=${channel.id}`
                    )
                  }
                >
                  Customize
                </Button>
              </div>
            ) : (
              <Button onClick={() => this.setState({ step: 0 })}>Setup Demo Wiki Channel</Button>
            )}
          </div>
        ),
      },
    ];
    return (
      <Content style={{ height: "100vh", /* overflow:"auto", */ padding: "16px 16px 32px 24px", marginLeft: 0 }}>
        <Steps current={step}>
          <Step
            title={steps[0].title}
            // description="Provide Jira instance URL"
          />
          <Step
            title={steps[1].title}
            // description="Provide Jira instance URL"
          />
        </Steps>
        <div
          className='steps-content'
          style={{
            height: "74vh",
            maxHeight: "500px",
            background: localStorage.getItem("theme") == "dark" && "#07080a",
            border: localStorage.getItem("theme") == "dark" && "none",
          }}
        >
          {steps[step].Content}
        </div>
        <div style={{ height: "10vh" }} className='steps-action'>
          {step === 0 && <Button onClick={() => this.setState({ step: 1 })}>Skip</Button>}
          {step === 0 && (
            <Button type='primary' style={{ marginLeft: 16 }} loading={loading} onClick={() => this.creteDemoChannel()}>
              Setup
            </Button>
          )}
        </div>
      </Content>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    team: state.skills.team,
    currentSkill: state.skills.currentSkill,
    workspace: state.common_reducer.workspace,
    skills: state.skills.skills,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    createNewChannel,
    getAssisantSkills,
    addConfluenceChannelConfig,
  })(confluenceConnectionSteps)
);
