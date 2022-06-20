import React,{Fragment} from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import JiraRequestModal from "../../../auth/jira/JiraRequestModal";
import axios from "axios";
import { MailOutlined } from '@ant-design/icons';
import {

  Typography,
  Alert,
  Button,
  Row,
  Col,
  Descriptions,
  notification
} from "antd";
import { connect } from "react-redux";
import { checkSlackLink } from "../../skills_action";

const { Title } = Typography;
const ButtonGroup = Button.Group;

class JiraNotificationSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageView: "intial_setup",
      id: this.props.skill_id,
      webhook_url: "",
      workspace_id: "",
      showPopUp: false
    };

    this.setOption = this.setOption.bind(this);
    // this.goToAssisant = this.goToAssisant.bind(this);
    this.showConnectionStatusNotif = this.showConnectionStatusNotif.bind(this);
  }
  setOption(step) {
    this.setState({ pageView: step });
    const path = window.location.pathname;
    const obj = {
      title: step,
      url: path + `?step=${step}`
    };
    window.history.pushState(obj, obj.title, obj.url);
  }

  showConnectionStatusNotif(msg, desc, duration) {
    notification.success({
      key: "linkingStatus",
      message: msg,
      description: desc,
      placement: "bottomLeft",
      duration
    });
  }

  componentDidMount() {
    this.props.shareMethods(this.moveToNext.bind(this));
    // console.log(this.props)
    // const parsedQueryString = queryString.parse(window.location.search);
    let id = this.props.skill_id
    // console.log("iddd==>",id)
    if (!id) {
      id = window.location.pathname.split("/")[3];
      this.setState({ id: id });
    }
//  console.log(window.location.pathname.split("/"))
  axios.get("/bot/jira_domain_url/" + id).then(res => {
    // console.log("url-->",res)
    if (res.data.success) {
      var url = res.data.url + "/plugins/servlet/webhooks";

      this.setState({ webhook_url: url }) ;
    }
  });
 
   
    this.props.checkSlackLink(localStorage.getItem("userCurrentWorkspaceId"));
    if (window.location.search) {
      const qs = queryString.parse(window.location.search);
      this.setState({
        pageView: qs.step
      });
      if (qs.channel && qs.project) {
        this.showConnectionStatusNotif(
          "Project Linking Status",
          `Jira project ${qs.project} linked successfully to Slack channel ${qs.channel}`,
          3
        );
      }
    }
  }
  moveToNext(){
    this.props.moveToNextStep()
  }

  // goToAssisant() {
  //   this.props.history.push(
  //     "/" +
  //       this.props.match.params.wId +
  //       "/skills/" +
  //       this.props.skill_id +
  //       "?view=connection"
  //   );

  //   // this.props.history.push(
  //   //   "/" + this.props.match.params.wId + "/skill/jira/"+this.props.match.params.skill_id
  //   // );
  // }

  // goToReports = () => {
  //   this.props.history.push(
  //     "/" +
  //       this.props.match.params.wId +
  //       "/skills/" +
  //       this.props.skill_id +
  //       "?view=reports"
  //   );

  //   // this.props.history.push(
  //   //   "/" + this.props.match.params.wId + "/skill/jira/"+this.props.match.params.skill_id
  //   // );
  // };

  JiraNotifyModal = () => {
    this.setState({
      showPopUp: !this.state.showPopUp
    });
  };

  goToSlack = () => {
    const { assistant, assistantData } = this.props;
    localStorage.setItem("app", "AE4FF42BA");
    const app = localStorage.getItem("app");

    const teamId = assistantData.id;
    let url = "";
    if (app && teamId) {
      url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`;
    } else {
      url = `https://slack.com`;
    }
    window.location.href = url;
  };

  // personalSetting = () => {
  //   this.props.history.push(
  //     "/" +
  //       this.props.match.params.wId +
  //       "/skills/" +
  //       this.props.skill_id+
  //       "?view=personal_preferences"
  //   );

  //   // this.props.history.push("/"+this.props.workspace_id+"/skills/"+this.props.skillId+ "?view=jira_user_config")
  // };

  // channelSetting = () => {
  //   this.props.history.push(
  //     "/" +
  //       this.props.match.params.wId +
  //       "/skills/" +
  //       this.props.skill_id +
  //       "?view=channel_preferences"
  //   );

  //   // this.props.history.push(`/${this.props.workspace_id}/skill/jira/${this.props.skillId}?view=jira_channel_config`)
  // };

  render() {
    // console.log("this.props.webhook_url==>", this.props.webhook_url)
    return (
      <Fragment>
       { this.props.data.token.done?<div style={{display:"flex",alignItems:"center",justifyContent:"center"}} >
       
        <Alert message="Webhook Succesfully Configured" type="success" />
       </div>
        :  
       <div>
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <Title level={2}>Enabling Jira WebHook for Troopr</Title>
              <p>This is necessary to setup Jira notifications in Troopr</p>
            </Col>
          </Row>

          <br />
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <Alert
                message="Only a Jira Admin can complete this setup"
                type="warning"
                showIcon
              />
              <Button icon={<MailOutlined />} type="link" onClick={this.JiraNotifyModal}>
                {" "}
                Click here to request your Jira admin
              </Button>

              {this.state.showPopUp && (
                <JiraRequestModal
                skill_id={this.props.skill_id}
                  modal={this.state.showPopUp}
                  toggle={() =>
                    this.setState({
                      showPopUp: !this.state.showPopUp
                    })
                  }
                />
              )}
            </Col>
          </Row>

          <br />
          <br />
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <Title level={2}>Step 1</Title>
              <Title level={4} type="secondary">
                <a target="_blank" href={this.state.webhook_url}>
                  Click here
                </a>{" "}
                to open the Jira Webhook page and then click the "Create a
                WebHook" button there.
              </Title>
              {/* <img style={{width:'600px',height:'100px'}} src={webHook1} /> */}
            </Col>
          </Row>

          <br />
          <br />
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <Title level={2}>Step 2</Title>
              <Title
                level={4}
                type="secondary"
                copyable={{ text: "Troopr Assistant" }}
              >
                Enter WebHook name as "Troopr Assistant"
              </Title>
            </Col>
            <Row type="flex" justify="center" align="middle"></Row>

            <br />
            <br />
            <Col span={12}>
              <Title level={2}>Step 3</Title>
              <Title
                level={4}
                copyable={{
                  text: `https://app.troopr.io/bot/jira_webhook/${this.props.skill_id}`
                }}
                type="secondary"
              >
                Copy this URL and paste it in the URL field:
                https://app.troopr.io/jira_webhook/bot
              </Title>
            </Col>
          </Row>

          <br />
          <br />
          <Row type="flex" justify="center" align="middle">
            <Col span={12}>
              <Title level={2}>Step 4</Title>
              <Title level={4} type="secondary">
                Select these issue events by checking them in the Jira page
              </Title>
              <Descriptions layout="vertical" bordered>
                <Descriptions.Item label="Issue">
                  Created
                  <br />
                  Updated
                </Descriptions.Item>
                <Descriptions.Item label="Comment">
                  Created
                  <br />
                  Deleted
                  <br />
                  Updated
                </Descriptions.Item>
                <Descriptions.Item label="Sprint">
                  Started
                  <br />
                  Closed
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <br />
          <br />
          <Row type="flex" justify="center" align="middle">
            <Col span={12}>
              <Title level={2}>Step 5</Title>
              <Title level={4} type="secondary">
                Click on "Create" button at the bottom of the Jira page
              </Title>
            </Col>
          </Row>

          <br />
          <br />
        </div>
    }
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  // assistant:state.assistant
  assistant: state.skills,
  assistantData: state.skills.team,

});

export default withRouter(
  connect(mapStateToProps, { checkSlackLink })(JiraNotificationSetup)
);
