import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { showErrorModal } from "../../skills/github/gitHubAction";
import axios from "axios";
class GitHubAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      wId: "",
      skillId: ""
      //    visible:false
    };
  }

  componentDidMount() {
    var query = queryString.parse(this.props.location.search);

    let [info,...channelInfo] = query.state.split("-");
    var _obj = {
      code: query.code,
      installation_id: query.installation_id,
      state: info
    };

    axios.post("/bot/api/oauth/github", _obj).then(res => {
     
      if (res.data.success) {

        if (res.data.installation_type == "organization") {
          if (channelInfo.length>0) {
            let [channelId,...channelname] = channelInfo.join('-').split("_");
            this.props.history.push({
              pathname:
                "/" +
                res.data.skill.workspace_id +
                "/github_default/" +
                res.data.skill._id,
              state: {
                channelId: channelId,
                channelName: channelname.join('_')
              }
            });
          }else{
            this.props.history.push(
               "/" + 
               res.data.skill.workspace_id +
               "/skills/" +
               res.data.skill._id 
            )

          }
        } else {
          this.props.history.push(
            "/" +
              res.data.skill.workspace_id +
              "/skills/" +
              res.data.skill._id +
              "?view=personal_preferences"
          );
        }
      } else {
        this.props.history.push(
          "/" +
            res.data.error.data.workspace_id +
            "/skills/" +
            res.data.error.data._id +
            "/?view=connection"
        );
        let showModal = true;
        this.props.showErrorModal(showModal);
      }
    });
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = state => {
  // console.log("store: "+JSON.stringify(state))
  return {
    currentSkill: state.skills.currentSkill
  };
};

export default connect(mapStateToProps, { showErrorModal })(GitHubAuth);
