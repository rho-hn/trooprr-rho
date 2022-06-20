import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SlackAccessAuth from '../components/auth/SignInPage/SlackAccess';
import SignInForm from '../components/auth/SignInPage/SignInForm';
import SlackAuth from '../components/auth/slackAuth.js';
import SlackJiraAuth from '../components/auth/slackAuthJiraApp';
import SlackStandupAuth from '../components/auth/standupSlackOuath';
import StripeWrapper from '../components/billing/stripeWrapper';
import GoogleAuth from '../components/auth/googleAuth';
import Appsumo from "components/Appsumo";


// console.log("signi====>")
const signUpRoutes = () => (
 
  <div>
    <Switch>
      <Route exact path="/slack_login" component={SlackAccessAuth} />
      <Route exact path="/troopr/access" component={SignInForm} />
      <Route exact path="/appsumo" component={Appsumo} />
      <Route path="/troopr/googleAuth" component={GoogleAuth} />
      <Route path="/slack_auth" component={SlackAuth} />
      <Route path="/slack_jira_auth" component={SlackJiraAuth} />
      <Route path="/slack_standup" component={SlackStandupAuth} />
      <Route exact path="/troopr_billing/:wId" component={StripeWrapper} />
      <Route
        
        path="/*"
        render={() => <Redirect to="/troopr/access" />}
      />
    </Switch>
  </div>
);

export default signUpRoutes;
