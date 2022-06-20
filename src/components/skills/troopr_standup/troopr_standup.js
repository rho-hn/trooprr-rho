import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Logo from '../../../media/circular_troopr_logo.svg';
import { SkillsAction } from '../settings/settings_action';
import { Card,Avatar, Typography, Row, Col } from 'antd';
const { Text } = Typography

const { Meta } = Card;

class AssistantTeamsync extends Component {
  constructor() {
    super()
    this.state = {
      option: ''
    }
  }

  componentDidMount() {
    this.props.SkillsAction(this.props.match.params.wId);
  }

  gotoTrooprApp = () => {
    window.location.href = `https://${window.location.hostname}/workspace/${this.props.match.params.wId}/myspace/tasks`;
  }

  render() {
    const { launcherActions } = this.props;
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="Assistant_Body card">
            <Meta
              avatar={
                <Avatar src={Logo} />
              }
              title="Troopr Standups"
              description="Let Troopr ask your team any questions you want and record and report on the responses as you need."
            />
          </Card>
        </Col>
        {/* <Col span={24}>
          <Card title="Commands" className="Assistant_Body card">
            <div>
              <List
                itemLayout="horizontal">
                {this.props.skill.commands && this.props.skill.commands.map(action => {

                  return <Card type="inner" className="card-inner-config">
                    <div className="commands-align-syntax"><Text code >{action.syntax}</Text></div>
                    <div className="commands-align-desc"><Text>{action.desc}</Text></div>
                    {action.example && "Example:"}
                    {action.example && <Text copyable code>{action.example}</Text>}
                  </Card>
                })
                }
              </List>
            </div>
          </Card></Col> */}
        <Col span={24}>
          <Card title="Commands" className="Assistant_Body card">
            <div>
              <Card type="inner" className="card-inner-config">
                <div className="commands-align-syntax"><Text code >/troopr standup</Text></div>
                <div className="commands-align-desc"><Text>This command shows all actions available in Troopr Standups.</Text></div>
              </Card>
              <Card type="inner" className="card-inner-config">
                <div>
                  <div className="commands-align-syntax"><Text code >/troopr standup list</Text></div>
                  <div className="commands-align-desc"><Text>This command shows all standups (ones you have setup or participating)</Text></div>
                </div>
              </Card>
            </div>
          </Card></Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  launcherActions: state.launcherActions.allActions,
  // paymentHeader : state.common_reducer.workspace
});


export default withRouter(connect(mapStateToProps, {
  SkillsAction
})(AssistantTeamsync));

