import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import {
  changeStandupHoliday,editTeamSync
  } from "../skills_action";


import { Col, PageHeader ,message,Switch,Modal,Alert} from "antd";

const { confirm } = Modal;
class HolidayCalender extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedDays:[],
        holidaysEnabled:false
      };
      this.handleDayClick = this.handleDayClick.bind(this)
      
    }
    componentDidMount(){
        // console.log("hiiiiiiiiiiiiiiiiiiCCCCCCC")
        
        this.setState({holidaysEnabled:this.props.teamsync.hasOwnProperty("enableHolidays")?this.props.teamsync.enableHolidays:true})
        if(this.props.teamsync && this.props.teamsync.holidays){
            // console.log("hellouwfugweufy",this.props.teamsync.holidays)
            let selectedDays=this.props.teamsync.holidays.map(val=>{
               let date =new Date(val)
               // return new Date(date.getFullYear(),date.getMonth(),date.getDate())
            return date
            })
            this.setState({selectedDays:selectedDays},
                ()=>{
                    // console.log(this.state.selectedDays)
                })
        }   
    }
    
    componentDidUpdate(props){
        // console.log("hiiiiiiiiiiiiiiiiii",this.props.teamsync)
        if((!props.teamsync && this.props.teamsync) || (props.teamsync && this.props.teamsync &&(props.teamsync._id!==this.props.teamsync._id))){
            // console.log(this.props.teamsync.holidays)
            if(this.props.teamsync.holidays){
                let selectedDays=this.props.teamsync.holidays.map(val=>new Date(val))
                this.setState({selectedDays:selectedDays,holidaysEnabled:this.props.teamsync.hasOwnProperty("enableHolidays")?this.props.teamsync.enableHolidays:true})
            }
          
        }
    }

    handleEnableDisableHolidays=(e)=>{
this.setState({holidaysEnabled:e})
let data = {
  enableHolidays: e,
};

this.props.editTeamSync(this.props.match.params.tId, data)
    }

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state;
        if(this.props.user && (this.props.user._id.toString()==this.props.teamsync.user_id._id.toString())){
          if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
              DateUtils.isSameDay(selectedDay, day)
            );
            selectedDays.splice(selectedIndex, 1);
          } else {
            selectedDays.push(day);
          }
          // console.log(day)
          this.setState({ selectedDays });
          this.props.changeStandupHoliday(this.props.match.params.wId,this.props.teamsync._id,{holiday:day})
        }else{
          message.error("Only creator of the Check-in ("+(this.props.teamsync.user_id.displayName || this.props.teamsync.user_id.name) + ") is allowed to configure team holidays")
        }
       
      }
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
  render(){

let {holidaysEnabled}=this.state
    return (
      <>
      

       <Col span={24}>

<PageHeader
style={{
  // backgroundColor: "#ffffff",
  width: "100%"
}}

className="site-page-header-responsive"

// tags={this.props.teamsync.createInstance ? <Tag color="green">Active</Tag> : <Tag color="orange">Paused</Tag>}
title={
  <Fragment>
    {/* <LegacyIcon
      className="trigger"
      type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
      onClick={this.props.sidertoggle}
    /> */}
    <span>
  

      {/* {this.props.teamsync.name && this.props.teamsync.name.length > 59 ?
        <Tooltip title={this.props.teamsync}>
          {this.props.teamsync.name.substring(0, 60) + '... '}
        </Tooltip>
        :
        this.props.teamsync.name + ' '
      } */}
      Holidays

    </span>
  </Fragment>
}
subTitle={
  <Fragment>
<span style={{display:"inline-block",marginRight:"30px"}}> Pick the days where you do not want check-in to run</span>

<Switch   defaultChecked checked={this.state.holidaysEnabled} onChange={this.handleEnableDisableHolidays} />

  </Fragment>
}


/>
  
{
  holidaysEnabled?  <div 
  style={{height:'75vh',overflow :'auto'}}
 >
  <DayPicker numberOfMonths={12} selectedDays={this.state.selectedDays}
  // onDayClick={this.handleDayClick}
  onDayClick={this.showConfirm}
   canChangeMonth={false}
    month={new Date()}
    
    disabledDays={[
     
     {
    
       before: new Date(),
     }
  ]}
    
    />
    </div>: <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"60vh"}}><Alert type="info" message="Enabling Check-in holiday calendar will allow this Check-in to define its own holidays. Global holidays will not be applicable when this calendar is enabled."  /></div>
}

</Col>
      
      </>
     
    );
  }
}
const mapStateToProps = (store) => ({
  user: store.auth.user,
})

export default withRouter( connect(mapStateToProps, {changeStandupHoliday,editTeamSync})(HolidayCalender));