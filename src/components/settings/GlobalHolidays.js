import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import {getWorkspace} from "../common/common_action"
import axios from "axios";
import { Col, PageHeader, Layout, Modal,Alert} from "antd";
const { confirm } = Modal;

class GlobalHoliday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
    };
    // this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    this.props.getWorkspace(this.props.match.params.wId).then(res=>{
  if(res&&res.data&&res.data.workspace){
    let workspace=res.data.workspace
    let selectedDays = workspace.globalHolidays&&workspace.globalHolidays.map((day) => {
      let date = new Date(day);
      
      return date;
    });
    this.setState({selectedDays:selectedDays||[]})
  }
    })
  }

  handleDayClick = (day,{selected}) => {
    const { selectedDays } = this.state;
    const { user } = this.props;


    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    // console.log(day)
    this.setState({ selectedDays });

    axios.post(`/api/${this.props.match.params.wId}/addGlobalHolidays`, {
        holiday: day,
      })
      .then((res) => {
        // console.log("res", res);
      });
  };
  showConfirm=(day,{selected})=> {
    const dates = new Date(day);
        const monthNames = [" ","Jan", "Feb", "Mar", "Apr", "May", "June",
                            "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const  days = dates.getDate();
        const month = monthNames[dates.getMonth()+1];
        const newdate = `${days}th ${month}`;
        
    
   
    if(selected == true){
    confirm({
    title: `Are you sure you want to unmark for ${newdate} ?`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => this.handleDayClick(day,{selected})
  });
    }
    else{
      confirm({
      title: `Are you sure you want to mark holiday for ${newdate} ?`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => this.handleDayClick(day,{selected})
    });
    }
  }

  render() {
    let {isAdmin}=this.props
    return (
      <Layout
      style={{ marginLeft: 0,
         height: "100vh", 
      overflowY:"scroll" 
      }}
      >
      {isAdmin?<Col span={24}>
          <PageHeader
            style={{
              // backgroundColor: "#ffffff",
              width: "100%",
            }}
            className='site-page-header-responsive'
            title={
              <Fragment>
                <span>Global Holidays</span>
              </Fragment>
            }
            subTitle={
              <span>
                Choose the days when your team on holiday and dont want Troopr to send reminders 
              </span>
            }
            // subTitle='Set your vacation dates. Troopr will turn off your notifications when you are out of office'
          />
                <div style={{display:"flex",justifyContent:"center"}}><Alert message="This holiday calendar will be used by all Check-ins except the ones that have their own holiday calendar." type="info" /></div> 
          <div
                  style={{
                    height: "100vh",
                    //overflowY: "scroll",
                    paddingBottom: "60px",
                    // background:
                    //   localStorage.getItem("theme") == "default"
                    //     ? "#ffffff"
                    //     : "rgba(15,15,15)",
                  }}
          >
          <DayPicker
            numberOfMonths={12}
            selectedDays={this.state.selectedDays}
            onDayClick={this.showConfirm}
            // onDayClick={this.handleDayClick}
            canChangeMonth={false}
            month={new Date()}
            disabledDays={[
              {
                before: new Date(),
              },
            ]}
          />
          </div>
        </Col>:
        <div style={{height:'100vh',display:"flex",justifyContent:"center",alignItems:"center"}}>
          <Alert message="Only a workspace admin can configure team Holidays." type="info" />
        </div>
  }
      </Layout>
    );
  }
}

const mapStateToProps = (store) =>{
  return {
    user:store.auth.user,
    isAdmin:store.common_reducer.isAdmin,
    workspace:store.common_reducer.workspace
    // workspace:
  }
} 

export default withRouter(connect(mapStateToProps, {getWorkspace})(GlobalHoliday));
