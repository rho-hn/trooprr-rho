import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
 import { slackApprovalStandupApp } from "./authActions";
 import {createTourInfo,getTourInfo} from '../auth/authActions';
class SlackAuthStandup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  componentDidMount() {
    var _obj = {
      code: queryString.parse(this.props.location.search).code
    };

    var url = localStorage.troopr_workspace_id_url;
    if (url) {
      _obj.workspace_id = localStorage.troopr_workspace_id_url.split("/")[2];
    }

    var type = queryString.parse(this.props.location.search).state;
    _obj.source=type
    if(!this.state.error){
      
    }

    this.props
      .slackApprovalStandupApp(_obj)
      .then(response => {
    
        if (response.data.success) {


        //   window.location.href = "https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding" ;
        window.location.href = `https://slack.com/app_redirect?app=A0192RC8TR6&team=${response.data.team}`
          

        } else {
          this.setState({ errors: response.data.errors });
          // console.log('checking access');
          this.props.history.push("/troopr/access") ;
        }
      })
      .catch(err => {
        console.error("err-==>", err);
        this.setState({
          error: err
        });
      });

    //catch action here and senf hem to access link
  }

  onClickRedirect = () => {
    // this.props.history.push("");
    window.location.href = "https://app.troopr.io/slack";
    //https://app.troopr.io/slack
  };

  render() {
    let errHtml = (
      <div style={{width:"100vw",height:"100vh"}} className="d-flex flex-column justify-content-center align-items-center">
        <div>OOPS! Itseems there was an error while installing</div>
        <div
          className="confirmation-button primary_btn btn_114"
          onClick={this.onClickRedirect}
          style={{padding:"25px",marginTop:"5px"}}
        >
          Click to reinstall
        </div>
      </div>
    );

    return (
      <div>
        {this.state.error ? (
          errHtml
        ) : (
          <div style={{width:"100vw",height:"100vh"}} className="d-flex flex-column justify-content-center align-items-center" >
            <div className="loader" />{" "}
            <div style={{fontSize:"24px",fontWeight:"500"}}>
              Please do not refresh the page or hit the back button. The app is
              getting installed.
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { slackApprovalStandupApp,createTourInfo,getTourInfo }
)(SlackAuthStandup);
