import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getCardSkills, excecuteCardSkill, updateCardSkills, getCardTemplates } from "../skill_builder/steps/CardActions"
// import SelectCard from "../skill_builder/steps/cardInvocationDetails/SelectCard";
// import EditSkill from "../EditSkill"
// import {addActivityLog} from "../../common/activityLog"
import { Tag, PageHeader, Button, Layout } from 'antd';
import { getCurrentSkill } from "../skills_action";
// const { Meta } = Card;
// const tagsFromServer = ["Pre-built", "Custom"];
import Reports from "../cardSkill/cardSkill";
class MainReports extends Component {
  constructor() {
    super();
    this.state = {

      // visible: false
    }
  }
  render() {

    return (
      <Fragment>

        <PageHeader

          // avatar={{ style: { backgroundColor: '#402E96' }, icon: "bar-chart" }}
          ghost={false}
          // title="Schedule Reports"
          subTitle="Schedule Project Reports from Jira or GitHub directly to your Slack Channels"

        // extra={[
        //   <Button type="primary" icon="plus">
        //     Add Report
        //   </Button>
        // ]}
        />
        <Layout>
          <Reports showFilter={true} workspace_id={this.props.match.params.wId} />
        </Layout>
      </Fragment>);
  }
}
const mapStateToProps = state => {
  // console.log(state.cards)
  return {
    //   currentSkill: state.skills.currentSkill,
    cardSkills: state.cards.cardSkills,
    cardTemplates: state.cards.templateCards,
  }
};

export default withRouter(
  connect(mapStateToProps, {
    getCardSkills,
    excecuteCardSkill, updateCardSkills, getCardTemplates, getCurrentSkill
  })(MainReports)
);