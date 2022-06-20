import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { Icon as LegacyIcon } from "@ant-design/compatible";
import axios from "axios";
import { Col, Tag, Tooltip, PageHeader, message, Layout, Modal} from "antd";
import { extend } from "highcharts";

const { confirm } = Modal;

class Holiday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
    };
    // this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/api/${this.props.match.params.wId}/user/getUserPreferences`)
      .then((res) => {
        if (res.data.success && res.data.preference) {
          let selectedDays = res.data.preference.holidays.map((day) => {
            let date = new Date(day);
            
            return date;
          });
          
          this.setState({ selectedDays });
        }
      });
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

    axios
      .post(`/api/${this.props.match.params.wId}/updateUserHolidays`, {
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
      title: `Are you sure you want to mark leave for ${newdate} ?`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => this.handleDayClick(day,{selected})
    });
    }
  }

  render() {
    return (
      <>
      {/* <Layout
      style={{ marginLeft: 250, height: "100vh", 
      overflowY:"scroll" 
      }}> */}
        <Col span={24}>
          <PageHeader
            style={{
              // backgroundColor: "#ffffff",
              width: "100%",
            }}
            className='site-page-header-responsive'
            title={
              <Fragment>
                <span>My Absences</span>
              </Fragment>
            }
            subTitle={
              <span>
                Choose the days when you are on leave or planned vacation and dont want Troopr to send reminders
              </span>
            }
            // subTitle='Set your vacation dates. Troopr will turn off your notifications when you are out of office'
          />
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
        </Col>
       {/* </Layout> */}
      </>
    );
  }
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
});

export default withRouter(connect(mapStateToProps, {})(Holiday));
