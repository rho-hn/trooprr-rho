import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DayPicker, { DateUtils } from "react-day-picker";
import axios from "axios";
import { Col, Select, PageHeader, Modal, Button, Spin } from "antd";
import CsvUploadModal from "./CsvUploadModal";

const { confirm } = Modal;
const { Option } = Select;

class TeamAbsences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      csvUploadModalVisible: false,
      userSelectValue: null,
      preferenceLoading: false,
    };
  }

  componentDidMount() {
    this.getStardingData();
  }

  handleDayClick = (day, { selected }) => {
    const { selectedDays, userSelectValue } = this.state;

    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) => DateUtils.isSameDay(selectedDay, day));
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    // console.log(day)
    this.setState({ selectedDays });
    axios
      .post(`/api/${this.props.match.params.wId}/updateUserHolidays`, {
        holiday: day,
        selectedUser: userSelectValue,
      })
      .then((res) => {
        // console.log("res", res);
      });
  };
  showConfirm = (day, { selected }) => {
    const dates = new Date(day);
    const monthNames = [" ", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const days = dates.getDate();
    const month = monthNames[dates.getMonth() + 1];
    const newdate = `${days}th ${month}`;

    if (selected == true) {
      confirm({
        title: `Are you sure you want to unmark for ${newdate} ?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => this.handleDayClick(day, { selected }),
      });
    } else {
      confirm({
        title: `Are you sure you want to mark leave for ${newdate} ?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => this.handleDayClick(day, { selected }),
      });
    }
  };

  handleUserSelectChange = (key) => {
    this.setState({ userSelectValue: key, preferenceLoading: true });

    axios.get(`/api/${this.props.match.params.wId}/user/getUserPreferences?selectedUser=${key}`).then((res) => {
      if (res.data.success && "preference" in res.data) {
        this.setState({ preferenceLoading: false });
        let selectedDays = res.data.preference
          ? res.data.preference.holidays.map((day) => {
              let date = new Date(day);

              return date;
            })
          : [];

        this.setState({ selectedDays });
      }
    });
  };

  getStardingData = () => {
    const { members, user } = this.props;
    this.setState({ preferenceLoading: true });
    axios.get(`/api/${this.props.match.params.wId}/user/getUserPreferences`).then((res) => {
      if (res.data.success && "preference" in res.data) {
        this.setState({ preferenceLoading: false });
        let selectedDays = res.data.preference
          ? res.data.preference.holidays.map((day) => {
              let date = new Date(day);

              return date;
            })
          : [];

        this.setState({ selectedDays });
      }
    });

    const currentUserMembership = members.find((mem) => mem.user_id._id === user._id);
    if (currentUserMembership) this.setState({ userSelectValue: currentUserMembership.user_id._id });
  };

  render() {
    const { members } = this.props;
    const { userSelectValue, preferenceLoading } = this.state;
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
                <span>Team Absences</span>
              </Fragment>
            }
            subTitle={<span>Mark planned absences on behalf of your team members</span>}
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
            <div style={{ marginBottom: 16, marginLeft: "24px" }}>
              <Select
                style={{ width: 300 }}
                placeholder='Select user to see their planned absences'
                value={userSelectValue}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                showSearch
                onChange={this.handleUserSelectChange}
              >
                {members.map((mem) => {
                  return <Option key={mem.user_id._id}>{mem.user_id.displayName || mem.user_id.name}</Option>;
                })}
              </Select>
              {/* <Button style={{ marginLeft: 8 }} onClick={()=>{this.setState({csvUploadModalVisible : true})}}> */}
              <Button style={{ marginLeft: 8 }} onClick={() => this.clickChild()}>
                Bulk upload with CSV
              </Button>
              {/* <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.csvUploadReview}
                >
                  Bulk upload with CSV Review
                </Button> */}
            </div>
            {preferenceLoading ? (
              <Spin style={{ display: "block", marginTop: 50 }} />
            ) : (
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
            )}
          </div>
        </Col>
        {
          <CsvUploadModal
            setClick={(click) => (this.clickChild = click)}
            updateTheCalender={() => {
              this.getStardingData();
            }}
          />
        }
        {/* </Layout> */}
      </>
    );
  }
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
  members: store.skills.members,
});

export default withRouter(connect(mapStateToProps, {})(TeamAbsences));
