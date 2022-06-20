import React, { Fragment } from "react"
import { Modal, Button } from 'antd';
//  import 'antd/dist/antd.css';
import ReactJoyride from "react-joyride"
import logo1 from "./logo1.png"
import slack from "./slack.png"
import { STATUS } from 'react-joyride';
import logo5 from "./logo5.png"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {checkSlackLink} from "../skills_action"
import {
  getTourInfo, createTourInfo,
  updateTourInfo
} from '../../auth/authActions';
class App extends React.Component {
  state = {
    visible: false,
    modal1Visible: false,
    url: ""
  };



  setModal1Visible(modal1Visible) {
    this.setState({
      modal1Visible,
      run: false,

      steps: [

        {
          target: ".tour2",
          content: "These are the built-in Skills of Troopr Assistant.",
          disableBeacon: true,
          locale: {
            skip: <span>Skip Tour</span>,
            next: <span className="next-btn">Next →</span>
          },

          placement: "left",

        },

        {

          target: ".tour3",
          content: <div className="joyride" >Troopr Skill Builder allows you to create new skills to automate Jira schedule Smart Notifications.</div>,
          locale: {
            last: <span className="next-btn">Last →</span>
          },
          placement: "right",
        },
      ]
    });
  };
  componentDidMount() {
    this.props.getTourInfo().then(res => {
      
        if (res.data.tourInfo && !res.data.tourInfo.completed) {
          this.setModal1Visible(true)
      
      }
    });
    this.props.checkSlackLink(localStorage.getItem("userCurrentWorkspaceId"))
  }

  handleClick = e => {
    e.preventDefault();

    this.setState({
      run: true,
      modal1Visible: false,
    });
  };
  handleOk = e => {
   
    this.setState({
      modal1Visible: false,
    });
  };
  sendtoslack=()=>{
    const {assistant}= this.props
    const app = localStorage.getItem('app');
    // const teamId = assistant.id
    let teamId = localStorage.getItem("teamId");

    let url = '';
    if(app && teamId){
      url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
    }else{
      url = `https://slack.com`;
    }
     window.location.href = url;

}
  handleCancel = e => {


    // console.log(e);
    let data = {};
    data.completed = true;
    this.props.updateTourInfo(data);

       this.setState({
      modal1Visible: false,
    });
  };
  handleCancel1 = e => {
   
    this.setState({
      visible: false,
    });
  };

  handleJoyrideCallback = data => {

    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      let data = {};
      data.completed = true;
      this.props.updateTourInfo(data);
      this.setState({ run: true, visible: true });
    }

  }


  jira = (url) => {
    // console.log("url========>", url)
  }
  jira = (url) =>{

    // /5d3b00d3d9a04d255dfcc2f1/skills
    this.props.history.push(url);
  }
  
  render() {

  
    let url
 

    let skills_id = this.props.getSkill.find(data => {
      return data.key === "jira"
    });
    if (skills_id &&skills_id.skill_metadata) {
      url = `/${this.props.match.params.wId}/skill/jira/${skills_id.skill_metadata._id}`;
    }

    

    return (
      <div>
        <ReactJoyride
          callback={this.handleJoyrideCallback}
          steps={this.state.steps}
          run={this.state.run}
          continuous
          showSkipButton
          styles={{
            options: {
              // modal arrow and background color

              arrowColor: "#402e96",
              backgroundColor: "#402e96",
              // page overlay color
              overlayColor: " ##00FFFFFF",
              //button color
              primaryColor: "#eee",
              //text color
              textColor: "#FFFFFF",
              opacity: 0.5,
              //width of modal
              width: 427,
              //zindex of modal
              zIndex: 1000
            }
          }}
        />
       


        <Modal

          width="58.3vw"

          centered
          visible={this.state.modal1Visible}
          onCancel={this.handleCancel}
          footer={null}

        >

          <div className="onboard">
            
              Hello {this.props.auth.user.name}
            <img src={logo1} alt="logo1" width="24px" /></div>
          <div className="cgrt " >
            Congratulations! Troopr is now successfully installed in your workspace.<br />
            Let's take a quick tour of the Troopr Dashboard!</div>
          <div className="row_flex justify_center">
            <Button className="tour_button" type="primary" onClick={this.handleClick}>Start Tour</Button></div>
          <div className="flexbox1">
            <img src={slack} alt="slack" height="24px" width="24px" hspace="10" />

            <div className="go_to_slack" onClick={this.sendtoslack}>Go to Slack</div>
            </div>


        </Modal>

        <Modal

          width="58.3vw"
          centered
          visible={this.state.visible}
          onCancel={this.handleCancel1}
          footer={null}
        >


          <div className="onboard">

            That’s it,
        <img className="picture" src={logo5} alt="logo5" /></div>
          <div className="cgrt">
            You are all set to get started.<br />
            Let's begin by connecting to your Jira domain.</div>
          <div className="row_flex justify_center">
            <Button className="tour_button" type="primary" width="182px" onClick={() => this.jira(url)}>Connect to Jira</Button></div>
          <div className="flexbox1">
            <img src={slack} alt="slack" width="24px" height="24px" hspace="10" />

            <div className="go_to_slack" onClick={this.sendtoslack}>Go to Slack</div></div>

        </Modal>



      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    getSkill: state.skills.skills,
    auth: state.auth,
    assistant:state.skills.team
  }
}

export default withRouter(connect(mapStateToProps, {
  getTourInfo,
  updateTourInfo, createTourInfo,checkSlackLink
})(App));


// export default withRouter(
//   connect(
//     mapStateToProps,
//     {  }
//   )(JiraUserOnboarding)
// );
