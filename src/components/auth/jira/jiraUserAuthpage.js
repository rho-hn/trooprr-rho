import React from 'react';
import { withRouter} from 'react-router-dom';
import axios from 'axios';

class JiraUserAuth extends React.Component {
     componentDidMount() {
        var id = this.props.match.params.skill_id
         if(!id) {
            id=window.location.pathname.split('/')[4]
        }

         axios.get('/api/jiraUserOuathUrl/'+id).then(res=>{
            if(res.data.success){
                var url=res.data.url;
                window.location=url;
            }
    })
 }
     						
  render() {
    return(
        <div className="jira_select_domain_container d-flex align-items-center justify-content-center"></div>
        );
    }
}

export default withRouter(JiraUserAuth)


