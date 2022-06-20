import React from 'react';
import { withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import { getSkillConnectUrl } from '../../skills/skills_action';
import queryString from 'query-string';
class JiraDoaminAuth extends React.Component {
     componentDidMount() {
let location=null
let parsedQueryString = queryString.parse(window.location.search);
        if( parsedQueryString.source ){
            location=parsedQueryString.source
         }
              this.props.getSkillConnectUrl("Jira",this.props.match.params.wId,location).then(res => {
                  if(res.data.success){
                      var url=res.data.url;
                      window.location=url;
                  }else{
                     
                  } 
              })
          }
					
    render() {
      return(
              <div className="jira_select_domain_container d-flex align-items-center justify-content-center"></div>
        );
    }
}

export default withRouter(connect(null, {getSkillConnectUrl})(JiraDoaminAuth))


