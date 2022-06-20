import React, { Fragment } from "react";
import { Layout,Alert,Typography } from "antd";
import { Switch, Route, Redirect,withRouter } from "react-router-dom";
import { connect } from "react-redux";

import SkillBuilder from '../components/skills/skill_builder/skill_builder';
import JiraAuth from '../components/auth/jira/jira_oauth.js';
// import SkillSetHome from '../components/skills/skill_builder/skillSetHome';
import Blank from '../components/blank';
// import JiraDomainSelection from "../components/auth/jira/jiraDomainSelection";
import JiraNotiticationSetup from "../components/auth/jira/jira_notification";
import JiraUserAuth from "../components/auth/jira/jiraUserAuthpage";
// import JiraDefaults from "../components/auth/jira/defaultChannelSelect";
import Skill from '../components/skills/skills'
import JiraDomainAuth from "../components/auth/jira/jira_domain_ouath";
import JiraOnboarding from '../components/skills/jira/jiraOnboarding';
import JiraUserOnboarding from '../components/skills/jira/jiraUserOnboarding';
import jiraMain from '../components/skills/jira/jira_main';
import JiraNotifIntialPage from '../components/auth/jira/jira_notificatin_inital_step';
//  import Skill from '../components/skills/skills';
// import NewOnBoarding from '../components/onBoarding/onBoarding.js';
import NewOnBoarding from '../components/onBoarding/newOnBoarding.js';
import JiraStandupOnboard from "../components/onBoarding/jira_standup"
import TrooprDefault from '../components/onBoarding/trooprDefault';
// import Footer from "../components/common/footer"
import GitHubAuth from "../components/auth/gitHub/gitHub"
import GitHubDefault from "../components/auth/gitHub/defaultChannelSelect"
import Payment from "../components/billing/billingMainPage.js"
import Workflow from "../components/workflow/workflow_main"
import Settings from "../components/settings/settings"
import onBoardingSuccess from "../components/onBoarding/onBoardingSuccess"
import JiraConnectionSteps from "../components/skills/jira/jiraConnectionFlow/JiraConnectionSteps"
import WikiConnectionSteps from "../components/skills/confluence/confluenceConnectionSteps"
import AppHome from "../components/skills/app_home/appHome"
import GettingStarted from "../components/skills/getting_started/gettingstarted"
import Reports from "../components/skills/reports/reports"
import projectRoutes from "./projectRoutes"
import StandupReport from "../components/skills/troopr_standup/StandupReport";
import Allstandups from "../components/skills/troopr_standup/AllStandups";
import projects from "../components/project/projects";
// import SideNavbar from "../components/sidebar/sidenavbar";
import SideNavbarNew from "../components/sidebar/sidenavbar_new";
import SlackAuth from '../components/auth/slackAuth.js';
import SlackAccessAuth from '../components/auth/SignInPage/SlackAccess';
import StripeWrapper from '../components/billing/stripeWrapper';

import SlackJiraAuth from '../components/auth/slackAuthJiraApp';
import SlackStandupAuth from '../components/auth/standupSlackOuath';
import JiraOauth from "../components/jiraoauth/jiraoauth"
import JiraOAuthCloud from "../components/jiraoauth/jiraoauthCloud"
import JiraOauthCallback from "../components/jiraoauth/jiraoauthCallback"
import JiraoauthGuestCallback from "../components/jiraoauth/jiraoauthguestcallback"
// import Dashboard from "../components/skills/dashboard/dashboard"
import NewDashboard from "../components/skills/dashboard/NewDashboard"
import Metrics from "../components/skills/dashboard/Metrics"
// import GridMetrics from "../components/skills/dashboard/grid_metrics";
import GlobalInsights from "../components/skills/troopr_standup/GlobalInsights";
// import Absences from "../components/settings/Absences/MyAbsences";
import PlannedAbsences from "../components/settings/Absences/PlannedAbsences";
import GlobalHolidays from "../components/settings/GlobalHolidays"
// import { Label } from "recharts";
import labelManagement from "../components/settings/labelManagement";
import ConfluenceOauth from "../components/skills/confluence/confluenceConnect";
import Appsumo from '../components/Appsumo'

// import SaveConnection from "../components/jiraoauth/saveconnection"
const Routes = (props) => {
  const gotoBilling = () => props.history.push(`/${props.workspace._id}/settings?view=upgrade`);

  return (

    <Fragment>
      <Switch>

    
      <Route exact path="/" component={Blank} />
      {/* <Route exact path="/" render={() => <Redirect to='' />} /> */}

      <Route exact path="/gitHubOuath" component={GitHubAuth} />
      <Route  path="/jira_auth" render={(props)=><JiraAuth {...props}/>} />
      <Route path="/slack_auth" component={SlackAuth} />
      <Route path="/appsumo" component={Appsumo} />
      {/* <Route path="/slack_auth" render={()=><SlackAuth {...props}/>} /> */}
      <Route path="/slack_jira_auth" component={SlackJiraAuth} />
      <Route path="/slack_standup" component={SlackStandupAuth} />
      <Route exact path="/troopr_billing/:wId" component={StripeWrapper} />
      <Route exact path="/slack_login" component={SlackAccessAuth} />
      {/* <Route path="/jira_auth" component={JiraAuth} /> */}
      {/* <Route exact path="/troopr/access" render = {()=><Redirect to=''/>} /> */}

      <Route path="/:wId">
        {/*<SideNavbar /> */}
        <SideNavbarNew />
        <Layout className="full_scroll"/*style={{background:(localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")}}*/>
                          {props.workspace &&
          props.workspace.billing_status &&
          (props.workspace.billing_status == "grace_payment_failed" || props.workspace.billing_status == "payment_failed") && (
            <Alert
              message={
                <span>
                  Payment Unsuccessful. Payment towards your Troopr subscription was unsuccessful. Go to{" "}
                  <Typography.Link onClick={() => gotoBilling()} style={{ textDecoration: "underline" }}>
                    Billing
                  </Typography.Link>{" "}
                  to update your billing information. If you have any questions, contact us at sales@troopr.io
                </span>
              }
              banner
              closable
            />
          )}
          <Switch>
            {/* <Route exact path="/:wId/onBoarding" component={NewOnBoarding} /> */}
            <Route exact path="/:wId/onBoarding/team_mood" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/planning_poker" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/checkin" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/retro" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/jira_slack_int" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/jsi_wiki_na" component={NewOnBoarding} />
            <Route exact path="/:wId/onBoarding/instant-poker" component={NewOnBoarding} />
            <Route path="/:wId/onBoarding" component={NewOnBoarding} />

            <Route path="/:wId/jira_standup_onboard" component={JiraStandupOnboard} />
            <Route exact path="/:wId/squads" component={projects} />
            <Route path="/:wId/squad/:pId" component={projectRoutes} />
            {/* <Route exact path="/:wId/skills/:skill_id" render={(props) => <Skill {...props} key={props.location.key} />} /> */}
            <Route exact path="/:wId/skills/:skill_id" component={Skill} />
            <Route exact path="/:wId/skills/:skill_id/:sub_skill" component={Skill} />
            <Route path="/:wId/troopr_default/:skill_id" component={TrooprDefault} />
            <Route path="/:wId/onBoardingSuccess/:skill_id" component={onBoardingSuccess} />
            {/* <Route path="/:wId/jira_default/:skill_id" component={JiraDefaults} /> */}
            <Route path="/:wId/github_default/:skill_id" component={GitHubDefault} />
            <Route exact path="/:wId/workflow" component={Workflow} />
            <Route exact path="/:wId/settings" render={(props) => <Settings {...props} />} />
            <Route exact path="/:wId/billing" component={Payment} />
            <Route exact path="/:wId/appHome" component={AppHome} />
            <Route exact path="/:wId/getting_started" component={GettingStarted} />
            <Route exact path="/:wId/reports" component={Reports} />
            <Route exact path="/:wId/dashboard" component={NewDashboard} />
            <Route exact path="/:wId/metrics" component={Metrics} />
            {/* <Route exact path="/:wId/grid_metrics" component={GridMetrics} /> */}


            {/* <Route exact path="/:wId/teamsyncs" component={Allstandups} /> */}
            <Route exact path="/:wId/teamsyncs/templates/new_checkin" component={Allstandups} />
            <Route exact path={["/:wId/teamsyncs","/:wId/teamsyncs/all","/:wId/teamsyncs/template"]} component={Allstandups} />
            <Route exact path={["/:wId/global-insights"]} component={GlobalInsights} />
            <Route exact path={["/:wId/planned_absences"]} component={PlannedAbsences} />
            <Route exact path={["/:wId/globalholidays"]} component={GlobalHolidays} />
            <Route exact path={["/:wId/labels"]} component={labelManagement} />
            <Route exact path={["/:wId/teamsyncs/global_insights","/:wId/teamsyncs/templates","/:wId/teamsyncs/mycheckins","/:wId/teamsyncs/all","/:wId/teamsyncs/templates/new_team_mood_anonymous", "/:wId/teamsyncs/templates/new_team_mood", "/:wId/teamsyncs/templates/new_planning_poker","/:wId/teamsyncs/templates/new_instant_planning_poker","/:wId/teamsyncs/templates/new_retro","/:wId/teamsyncs/templates/new_retro_anonymous","/:wId/teamsyncs/integrations", "/:wId/teamsyncs/integrations/:skill_id"]} component={Allstandups} />
            {/*<Route exact path={["/:wId/teamsyncs/global_insights","/:wId/teamsyncs/templates","/:wId/teamsyncs/mycheckins","/:wId/teamsyncs/all","/:wId/teamsyncs/templates/new", "/:wId/teamsyncs/integrations", "/:wId/teamsyncs/integrations/:skill_id"]} component={Allstandups} />*/}
            <Route exact path="/:wId/teamsync/:tId" component={StandupReport} />
            <Route exact path={["/:wId/teamsync/:tId/actionItems", "/:wId/teamsync/:tId/actionItems/:instanceId"]} component={StandupReport} />
            <Route exact path="/:wId/teamsync/:tId/instance/:instanceId" component={StandupReport} />
            <Route exact path="/:wId/teamsync/:tId/instance/:instanceId/answer" component={StandupReport} />
            <Route exact path="/:wId/teamsync/:tId/settings" component={StandupReport} />
            {/* <Route exact path="/:wId/teamsync/:tId/engagement" component={StandupReport} /> */}
            <Route exact path="/:wId/teamsync/:tId/holiday" component={StandupReport} />
            {/* <Route exact path="/:wId/teamsync/:tId/history" component={StandupReport} /> */}
            {/* <Route exact path="/:wId/teamsync/:tId/history/:history_user_id" component={StandupReport} /> */}
            {/* <Route exact path="/:wId/teamsync/:tId/history/guest/:history_user_slack_id" component={StandupReport} /> */}
            {/* <Route exact path="/:wId/teamsync/:tId/insights" component={StandupReport} /> */}
            <Route exact path={["/:wId/teamsync/:tId/insights","/:wId/teamsync/:tId/insights/:history_user_id","/:wId/teamsync/:tId/insights/guest/:history_user_slack_id"]} component={StandupReport}/>
            <Route path={["/:wId/teamsync/:tId/history", "/:wId/teamsync/:tId/engagement"]} component={StandupReport} />

            <Route path="/:wId/jira_domain_oauth" component={JiraDomainAuth} />
            <Route path="/:wId/jira_user_oauth/:skill_id" component={JiraUserAuth} />
            <Route path="/:wId/jira_notification_setup/:skill_id" component={JiraNotiticationSetup} />
            <Route path="/:wId/jira_notification_setup/:skill_id?step=intial_setup" component={JiraNotifIntialPage} />
            <Route path="/:wId/skill/jira/:skill_id?view=jira_user_config" component={jiraMain} />
            <Route exact path="/:wId/jira_welcome/:skill_id" component={JiraOnboarding} />
            <Route exact path="/:wId/jira_user_welcome/:skill_id" component={JiraUserOnboarding} />
            <Route exact path="/:wId/jiraConnectionSteps/:domain_id" component={JiraConnectionSteps} />
            <Route exact path="/:wId/wikiConnectionSteps/:skill_id" component={WikiConnectionSteps} />
            <Route exact path="/:wId/jiraoauthServer/:skill_id/:current" component={JiraOauth} />
            <Route exact path="/:wId/jiraOAuthCloud/:skill_id/:current" component={JiraOAuthCloud} />
            <Route exact path="/:wId/jiraoauth/callback/:skill_id" component={JiraOauthCallback} />
              <Route exact path="/:wId/jiraoauth/guest/callback/:skill_id" component={JiraoauthGuestCallback} />

            <Route exact path="/:wId/wikiOuath/:skill_id/:current" component={ConfluenceOauth} />
            {/* <Route exact path ="/:wId/jiraoauth/:skill_id/saveconnection" component ={SaveConnection} /> */}
            {/* <Route exact path="/:wId/skills" component={Skill} /> */}
            {/* <Route exact path="/:wId/skill/troopr_reminder" component={ TrooprReminder } /> */}
            {/*<Route exact path="/:wId/skill/skillsetdetails" component={ SkillSetDetails } /> */}
            {/* <Route exact path="/:wId/skill/create_skill" component={CardCreation} /> */}
            {/* <Route exact path="/:wId/skill/create_skills" component={SkillDetails} /> */}
            {/* <Route exact path="/:wId/cards" component={ SkillCardDetails } /> */}
            {/* <Route exact path="/:wId/card/create_card" render={(props) => <SkillCardDetails {...props} open={true}/>} /> */}
            {/* <Route exact path="/:wId/skill/skillcreation" component={ SkillCreation } /> */}
            {/* <Route exact path="/:wId/skillset/:skillset_name/:skillset_id" component={ SkillSetHome } /> */}
            {/* <Route exact path="/:wId/skill/:skill_id/skillbuilder" component={SkillBuilder} /> */}
            {/* <Route path="/:wId/domain_selection/:domain_id" component={JiraDomainSelection} /> */}
            {/* <Route path="/:wId/skill/github_buttons/:skill_id?view=github_user_config" component={GithubMain}/> */}
            {/* <Route exact path="/:wId/skills/config_jira/:skillId" component={jiraMain} /> */}
            {/* <Route exact path="/:wId/skills/config_webHook/:skillId" component={JiraNotifIntialPage} /> */}
            {/* <Route path="/*" component={Blank} /> */}
            <Route exact path="/:wId" render={(props) => <Blank {...props} />} />
           
            <Route path="/*" render={(props) => <Blank {...props} />} />
          </Switch>
        </Layout>
      </Route>
      </Switch>
    </Fragment>
  )
};

// export default Routes;

function mapStateToProps(store) {
  return {
    workspace: store.common_reducer.workspace,
  }
}

export default withRouter(connect(mapStateToProps, {
})(Routes))
