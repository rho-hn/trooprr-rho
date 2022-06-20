import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Row, Col, Card, message, Layout, Typography } from "antd";
const { Text } = Typography;

class TeamSyncTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  comingSoon = () => {
    message.info("Coming soon");
  };

  render() {
    const {workspace} = this.props
    let layoutPage = {};
    let colSpan = this.props.from == "page" ? 8 : 24;
    if (this.props.from == "page") {
      layoutPage = {
        // padding: "12px 12px",
        // padding: "16px 16px 32px 24px"
        // height: "calc(100vh - 200px)",
        // background:
        //   localStorage.getItem("theme") == "default"
        //     ? "#ffffff"
        //     : "rgba(15,15,15)",
        paddingLeft : 8,
        paddingRight : 8,
      };
    } else {
      layoutPage = {
        background:
          //   localStorage.getItem("theme") == "default" ? "#ECECEC" : "#1f1f1f",
          localStorage.getItem("theme") == "dark" && "#1f1f1f",
      };
    }
    return (
      // <Layout style={layoutPage} >
      <div style={layoutPage} >
        <Row gutter={this.props.from == "page" ? [16, 16] : [16, 16]}>
          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"💬 " + "\xa0\xa0\xa0" + "Daily Standup"}
              extra={
                <Button size='default' onClick={() => this.props.handleTemplateSelect("Daily Standup")}>
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("Daily Standup")}
            >
              <Text type='secondary'>Daily team meeting for quick status update</Text>
            </Card>
          </Col>

          {/* <Col span={colSpan}>
            <Card
              style={{
                maxHeight: "170px",
                minHeight: "170px",
              }}
              hoverable={true}
              title='Retrospective'
              extra={
                <Button
                  onClick={() =>
                    this.props.handleTemplateSelect("retrospective")
                  }
                >
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("retrospective")}
            >
              End of Project / Sprint meeting to self inspect and plan for
              future improvements 
            </Card>
          </Col> */}

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"🌅 " + "\xa0\xa0\xa0" + "Monday Kickoff"}
              extra={
                <Button size='default' onClick={() => this.props.handleTemplateSelect("mondaykickoff")}>
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("mondaykickoff")}
            >
              <Text type='secondary'>Share what you aim to accomplish this week</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"🏝️ " + "\xa0\xa0\xa0" + "Remote team Check-in"}
              extra={
                <Button size='default' onClick={() => this.props.handleTemplateSelect("remoteteamstandup")}>
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("remoteteamstandup")}
            >
              <Text type='secondary'>Daily team update for distributed teams</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"✅ " + "\xa0\xa0\xa0" + "Task Check-in"}
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("taskcheckin")}
            >
              <Text type='secondary'>Answer by directly updating tasks assigned to you</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"🌡️ " + "\xa0\xa0\xa0" + "Retrospective"}
              extra={
                <Button size='default' onClick={() => this.props.handleTemplateSelect("retrospective")}>
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("retrospective")}
            >
              <Text type='secondary'>End of Project / Sprint meeting to self inspect and plan for future improvements</Text>
            </Card>
          </Col>
          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"🌡️ " + "\xa0\xa0\xa0" + "Retrospective Anonymous"}
              extra={
                <Button size='default' onClick={() => this.props.handleTemplateSelect("retrospectiveanonymous")}>
                  Choose
                </Button>
              }
              onClick={() => this.props.handleTemplateSelect("retrospectiveanonymous")}
            >
              <Text type='secondary'>End of Project / Sprint meeting to self inspect and plan for future improvements</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"😎 " + "\xa0\xa0\xa0" + "Team Mood"}
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("moodcheckin",false)}
            >
              <Text type='secondary'>Get a better sense of your team mood to build trust and teamwork</Text>
            </Card>
          </Col>
          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"😎 " + "\xa0\xa0\xa0" + "Team Mood Anonymous"}
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("moodcheckinanonymous",true)}
            >
              <Text type='secondary'>Get a better sense of your team mood anonymously to build trust and teamwork</Text>
            </Card>
          </Col>
          {/* <Col span={colSpan}>
            <Card
              style={{
                maxHeight: "170px",
                minHeight: "170px",
                border:
                  localStorage.getItem("theme") == "default" &&
                  "1px solid #d9d9d9",
              }}
              hoverable={true}
              title='🙌 Team Morale'
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("teammoral")}
            >
              Measure team’s well-being that is more focussed on work
            </Card>
          </Col> */}

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              // title='🃏 Planning Poker'
              title={"🃏 " + "\xa0\xa0\xa0" + "Planning Poker"}
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("planning_poker")}
            >
              <Text type='secondary'>Conduct planning poker with your team</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              // title='🃏 Planning Poker'
              title={"🃏 " + "\xa0\xa0\xa0" + "Instant planning Poker"}
              extra={<Button>Choose</Button>}
              onClick={() => this.props.handleTemplateSelect("instant-poker")}
            >
              <Text type='secondary'>Conduct planning poker instantly with a single command</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              title={"✂️ " + "\xa0\xa0\xa0" + "Backlog Refinement"}
              extra={
                <Button
                //   onClick={() => this.props.handleTemplateSelect("backlogretirement")}
                //   onClick={this.comingSoon}
                >
                  Choose
                </Button>
              }
              //   onClick={() => this.props.handleTemplateSelect("backlogretirement")}
              onClick={this.comingSoon}
            >
              <Text type='secondary'>Run a backlog grooming session with your team</Text>
            </Card>
          </Col>

          <Col span={colSpan}>
            <Card
              style={{
                 maxHeight: "170px",
                 minHeight: "170px",
              //   border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
              }}
              size='default'
              hoverable={true}
              // title='🔁 Sprint Planning'
              title={"🔁 " + "\xa0\xa0\xa0" + "Sprint Planning"}
              extra={
                <Button
                //   onClick={this.comingSoon}

                //   onClick={() => this.props.handleTemplateSelect("sprintplaning")}
                >
                  Choose
                </Button>
              }
              //   onClick={() => this.props.handleTemplateSelect("sprintplaning")}
              onClick={this.comingSoon}
            >
              <Text type='secondary'>Get your team to choose tasks for upcoming Sprint</Text>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({workspace: store.common_reducer.workspace});
export default withRouter(connect(mapStateToProps, {})(TeamSyncTemplates));
