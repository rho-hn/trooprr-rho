

import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Githublogo from '../../../media/Github_logo.png';
import { SkillsAction } from '../settings/settings_action';
import { getAssisantSkills } from "../skills_action";
import { Card, Avatar, Row, Col } from 'antd';

import '../jira/jira.css';

const { Meta } = Card;

class GithubMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jiraSkill: null,
    }
  }


  componentDidMount() {
    this.props.SkillsAction(this.props.match.params.wId);
    this.props.getAssisantSkills(this.props.match.params.wId)

  }

  render() {
    let jiraSkill = this.props.assistant_skills.find((skill) => {
      return skill.key === "github"
    })
    return (
      <Row>
        <Col span={24}>
          <Card >
            <Meta
              avatar={
                <Avatar src={Githublogo} />
              }
              title="GitHub"
              description="Create, update, track and get notified about events and insights in Github Projects"
            />
          </Card>
        </Col>

      </Row>
    );
  }
}


const mapStateToProps = state => ({
  assistant_skills: state.skills.skills,
});


export default withRouter(connect(mapStateToProps, { SkillsAction, getAssisantSkills })(GithubMain));

