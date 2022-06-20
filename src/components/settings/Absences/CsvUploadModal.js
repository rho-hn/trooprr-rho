import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Steps, Typography, Input, Button, Upload, message, List, Spin, Image } from "antd";
import CSVExampleImage from "../../../media/CSV_exampleImage.jpg";
import Papa from "papaparse";
import axios from "axios";

const { Step } = Steps;
const { Text } = Typography;

class PlannedAbsences extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initalStateValues };

    this.openModal = this.openModal.bind(this);
  }

  initalStateValues = {
    csvUploadModalVisible: false,
    currentStep: 0,
    fileList: [],
    parsedCsv: {},
    updateApiLoading: false,
    holidayInfo: [],
  };

  componentDidMount() {
    this.props.setClick(this.openModal);
  }

  openModal = () => this.setState({ csvUploadModalVisible: true });

  validateCSVfields = () => {
    try {
      const { parsedCsv } = this.state;
      const { members } = this.props;
      // const parsedCsv = this.parsedCsv;

      if (
        parsedCsv.meta &&
        parsedCsv.meta.fields &&
        parsedCsv.meta.fields[0] &&
        parsedCsv.meta.fields[0].trim() === "email" &&
        parsedCsv.meta.fields[1] &&
        parsedCsv.meta.fields[1].trim() === "start date" &&
        parsedCsv.meta.fields[2] &&
        parsedCsv.meta.fields[2].trim() === "end date"
      ) {
      } else {
        message.error('CSV format is wrong, Expected Columns "email, start date, end date"');
        throw "error in format";
      }

      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      const validateDate = (date) => {
        return String(date)
          .toLowerCase()
          .match(
            // /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/gm
            /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/gm
          );
      };

      let holidayInfo = [];
      const data = parsedCsv.data;

      data.forEach((col) => {
        if (col.email) {
          if (!validateEmail(col.email)) {
            message.error(`${col.email} is not a valid email`);
            throw "error in email";
          } else if (!validateDate(col["start date"])) {
            message.error(
              `${
                col["start date"] ? col["start date"] + " is not a valid date format" : "start date not found for " + col.email
              } , Expected format "01/01/2022"`
            );
            throw "error in start date";
          } else if (!validateDate(col["end date"])) {
            message.error(
              `${
                col["end date"] ? col["end date"] + " is not a valid date format" : "end date not found for " + col.email
              } , Expected format "01/01/2022"`
            );
            throw "error in end date";
          }
        }

        const user = members.find((mem) => mem.email === col.email);
        if (user) {
          const dates = this.getDates({ start_date: col["start date"], end_date: col["end date"] });
          holidayInfo.push({ user, holiday_dates: dates });
        }
      });

      this.setState({ holidayInfo });
      return true;
    } catch (error) {
      console.error({ error });
      return false;
    }
  };

  handleModalClose = () => {
    this.props.updateTheCalender();
    this.setState({ ...this.initalStateValues });
  };

  handleNextSteps = () => {
    const { currentStep, fileList } = this.state;

    if (currentStep === 2) /* last step when pressing done */ this.handleModalClose();
    else {
      if (currentStep === 0) {
        if (fileList && fileList[0] && fileList[0].name) {
          Papa.parse(fileList[0], {
            header: true,
            complete: (results) => {
              this.setState({ parsedCsv: results }, () => {
                if (this.validateCSVfields()) this.setState({ currentStep: currentStep + 1 });
              });
            },
          });
        } else message.error("Please upload a CSV file");

        // if (this.validateCSVfields()) {
        //   message.success("done");

        //   this.setState({currentStep : currentStep + 1})
        // }
      } else if (currentStep === 1) {
        this.updateHoliday();
      }
    }
    //   this.setState({currentStep : currentStep + 1})
  };

  UploadcsvFile = () => {
    const { fileList } = this.state;
    const props = {
      accept: ".csv",
      beforeUpload: (file) => {
        this.setState((state) => ({
          // fileList: [...state.fileList, file],
          fileList: [file],
        }));
        return false;
      },
      listType: "picture",
      onRemove: () => {
        this.setState({ fileList: [] });
      },
      maxCount: 1,
      // showUploadList: false,
    };

    return (
      <div
        style={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          "padding-top": "80px",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Text>You can upload a CSV file containing user absences data in the following format.</Text>
        </div>
        <div>
          <Image
            style={{
              "box-shadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            width={300}
            src={CSVExampleImage}
            alt='CSV Example image'
          />
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "row", justifyContent: "center" }}>
          {/* <Input value={fileList[0] && fileList[0].name} style={{ width: 200 }} /> */}
          <Upload {...props} className='csv_holiday_upload_modal'>
            <Button>Choose File</Button>
          </Upload>
        </div>
      </div>
    );
  };

  updateHoliday = () => {
    const { holidayInfo } = this.state;

    this.setState({ updateApiLoading: true, currentStep: this.state.currentStep + 1 });
    let data = [];

    holidayInfo.forEach((user_data) => {
      data.push({ user_id: user_data.user.user_id._id, membership_id: user_data.user._id, dates: user_data.holiday_dates });
    });

    axios
      .post(`/api/${this.props.match.params.wId}/updateTeamMembersHolidayFromCSV`, {
        data,
      })
      .then((res) => {
        if (res.data.success) {
          this.setState({ updateApiLoading: false });
        } else message.error("Error updating holidays");
      });
  };

  getDates = ({ start_date, end_date }) => {
    const changeDateFormat = (originalDate) => {
      /* changing the date format */
      let date = originalDate.replace("/", "-");
      date = date.replace("/", "-").split("-"); /* since i didn't find regex to select '/' and replace globally , just replacing it manually */
      if (date) date = `${date[2]}-${date[1]}-${date[0]}`;
      return date;
    };

    /* https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates */

    for (
      var arr = [], dt = new Date(new Date(changeDateFormat(start_date)));
      dt <= new Date(changeDateFormat(end_date));
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    arr.map((v) => v.toISOString().slice(0, 10)).join("");
    const dates = arr.map((v) => v.toISOString().slice(0, 10));

    return dates;
  };

  reviewDataStep = () => {
    const { parsedCsv, holidayInfo } = this.state;
    // const parsedCsv = this.parsedCsv;
    const { members } = this.props;
    if (parsedCsv && parsedCsv.data)
      return (
        <List
          itemLayout='horizontal'
          // bordered
          header='Review the below data and click next to update Troopr'
          style={{ margin: "40px 30px 0px 30px" }}
          dataSource={holidayInfo}
          renderItem={(col) => {
            const user = col.user;
            let dateStr = "";
            col.holiday_dates.forEach((date, i) => {
              if (i === 0) dateStr = dateStr + date;
              else dateStr = dateStr + ", " + date;
            });
            return (
              <List.Item>
                <List.Item.Meta title={`${user.user_id.displayName || user.user_id.name} (${user.email})`} description={dateStr} />
              </List.Item>
            );
          }}
        />
      );
  };

  successStepContent = () => {
    const { holidayInfo, updateApiLoading } = this.state;

    const style = { display: "flex", justifyContent: "center", height: "55vh", alignItems: "center" };
    return updateApiLoading ? <Spin style={style} /> : <Text style={style}>Updated planned absences for {holidayInfo.length} users!</Text>;
  };

  render() {
    const { csvUploadModalVisible, currentStep } = this.state;

    const steps_data = [
      {
        title: "CSV File",
        content: this.UploadcsvFile(),
      },
      {
        title: "Review Data",
        content: this.reviewDataStep(),
      },
      {
        title: "Confirmation",
        content: this.successStepContent(),
      },
    ];
    return (
      <Modal
        title='Bulk upload planned absences data'
        visible={csvUploadModalVisible}
        // visible={true}
        closable
        maskClosable={false}
        width={800}
        centered
        bodyStyle={{ height: "70vh" }}
        onCancel={() => this.handleModalClose()}
        footer={
          <>
            {currentStep === 1 && (
              <Button key='back' onClick={() => this.setState({ currentStep: currentStep - 1 })}>
                Previous
              </Button>
            )}
            <Button key='submit' type='primary' /* loading={loading} */ onClick={this.handleNextSteps}>
              {currentStep === 0 ? "Upload and Review" : currentStep === 1 ? "Update" : "Done"}
            </Button>
          </>
        }
      >
        <Steps current={currentStep}>
          {steps_data.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div
          /* style={{
            padding: "32px",
            "min-height": "60vh",
            "max-height": "60vh",
            overflow: "scroll",
            "margin-top": "13px",
            background:(localStorage.getItem('theme') == 'dark' && "#07080a"),border:(localStorage.getItem('theme') == 'dark' &&"none")
          }} */ /* style={{minHeight:200, textAlign : 'center' ,display:"flex", justifyContent:"center", alignItems:"center", padding:32}} */

          style={{
            "min-height": "200px",
            "margin-top": "16px",
            // "padding-top": "80px",
            // "background-color": "#fafafa",
            // "border": "1px dashed #e9e9e9",
            "border-radius": "2px",
            "min-height": "58vh",
            "max-height": "58vh",
            overflow: "scroll",
            "margin-top": "13px",
            background: localStorage.getItem("theme") == "dark" ? "#07080a" : "#fafafa",
            border: localStorage.getItem("theme") == "dark" ? "none" : "1px dashed #e9e9e9",
          }}
        >
          {steps_data[currentStep].content}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
  members: store.skills.members,
});

export default withRouter(connect(mapStateToProps, {})(PlannedAbsences));
