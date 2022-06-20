import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSkillData, getSkillUser } from '../skills_action';
import queryString from 'query-string';
import AssistantTeamsync from "./troopr_standup"
import MyStandups from './my_standups';

class Standup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workspace_id: this.props.match.params.wId,
            view: "",
            id: '',
            name: ''
        }
        this.setOption = this.setOption.bind(this)
    }

    setOption(view, id, name) {
        this.setState({ view: view, id: id, name: name });
        let queryStringObject = queryString.stringify({
            view: view,
            id: id,
            name: name
        });
        const path = window.location.pathname;
        if (id) {
            const obj = {
                "title": view,
                "url": path + `?view=${view}&${name}=${id}`
            }
            window.history.pushState(obj, obj.title, obj.url);
        } else {
            const obj = {
                "title": view,
                "url": path + `?view=${view}`
            }
            window.history.pushState(obj, obj.title, obj.url);
        }
    }

    componentDidMount() {
        const parsedQueryString = queryString.parse(window.location.search);
        this.setState({ view: parsedQueryString.view })

        this.props.getSkillData(this.props.match.params.skill_id)
        this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id).then(res => {
            let jiraUser = res.data.skillUser

        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const parsedQueryString = queryString.parse(window.location.search);
            if (parsedQueryString.view) {
                this.setState({ view: parsedQueryString.view })
            } else {
                this.setState({ view: '' })
            }
        }
    }
    render() {
        let renderTabs = this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata.linked : this.props.currentSkill.linked
        return (
            <div className="standup-background">
                {this.props.skillView.view === "info" && <AssistantTeamsync skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
                {(!this.props.skillView.view || this.props.skillView.view === "my_standups") && renderTabs && <MyStandups skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentSkill: state.skills.currentSkill,
        skills: state.skills.skills,
    }
};

export default withRouter(connect(mapStateToProps, {
    getSkillData,
    getSkillUser,

})(Standup)); 
