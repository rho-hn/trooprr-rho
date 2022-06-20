
import { Modal, Button,Row,Col,Select,DatePicker,Skeleton, Menu } from 'antd';
import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from 'moment';
import {getSprintConfig,updateSprintConfig,extendSprint} from "../section/sprintActions"
import { DoubleRightOutlined } from '@ant-design/icons';

const { Option } = Select;

class ExtendSprint extends Component {
 constructor(props) {
   super(props)

   this.state = {
    visible: false ,
    days:'',
    calendarValue:this.props.config._id?moment(this.props.config.endAt, "YYYY-MM-DD"):null
   }
 }

componentDidMount(){


}
// showModal = () => {
    
//     this.setState({
//       visible: true,loading:true
//     });
//     this.props.getSprintConfig(this.props.match.params.wId,this.props.match.params.pId).then(res=>{
//         this.setState({
//             visible: true,loading:false,
//             data:res.data.sprintConfig?{duration:res.data.sprintConfig.duration,break:res.data.sprintConfig.break,spillOver:res.data.sprintConfig.spillOver}:{}
//           });

//     })


//   };

  showModal = () => {
    
    this.setState({
      visible: true,loading:true
    });
    this.props.getSprintConfig(this.props.match.params.wId,this.props.match.params.pId).then(res=>{
        this.setState({
            visible: true,loading:false,
    calendarValue:this.props.config._id?moment(this.props.config.endAt, "YYYY-MM-DD"):null,
            data:res.data.sprintConfig?{duration:res.data.sprintConfig.duration,break:res.data.sprintConfig.break,spillOver:res.data.sprintConfig.spillOver}:{}
          });

    })


  };

  handleCancel = e => {
  
    this.setState({
      visible: false,
      calendarValue:moment(this.props.config.endAt,"YYYY-MM-DD")
    });
  };

  onSubmit = () => {
    // console.log('date',date)
    this.setState({visible:false})
    let data = {days:this.state.days};
    this.props.extendSprint(this.props.match.params.wId,this.props.match.params.pId,data).then(res => {
        this.setState({calendarValue:moment(this.props.config.endAt,"YYYY-MM-DD")})
    })
  }

  onChange = (d) => {
    // let data={date:date}
    // this.setState({data:data})
    let endAt= this.props.config.endAt;
    // let extendedDate = d
    // let date1 = new Date(endAt)
    // let date2 = new Date(extendedDate)

    // var res = Math.abs(date1 - date2) / 1000;
    // var days = Math.ceil(res / 86400);
    let a=moment(endAt).startOf('day')
    let b=moment(d).startOf('day')
    let difference=moment(b).diff(moment(a), 'days')
    this.setState({days:difference,calendarValue:moment(d, "YYYY-MM-DD")})

  }

render() {
let config=this.props.config
return (
    <Fragment>
    <div onClick={this.showModal}>
      <DoubleRightOutlined  style={{marginRight:'6px'}}/>
    Extend
    </div>
        <Modal
    title="Extend Sprint"
    visible={this.state.visible}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
    footer={this.state.loading?null:[
        
        <Button key="back" onClick={this.handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={this.onSubmit}>
          Submit
        </Button>,
      ]}
    >
    <Skeleton loading={this.state.loading} >
    <Row gutter={[8, 8]}>
    <Col span={8}>
        <span>Select date </span>
      </Col>
      <Col span={16}>
        <DatePicker
        disabledDate={current => {
          return current && current <= moment(new Date());
        }}
        // placeholder='Select a date'
          value={this.state.calendarValue}
          style={{ width: "100%" }}
          onChange={this.onChange}
          clearIcon={false}
        />
      </Col>
      </Row>
        </Skeleton>
        </Modal>
    </Fragment>
          )
  }

}

const mapStateToProps=(state)=>{

  return{
  config:state.sprints.sprintConfig
  }
}
export default withRouter(connect(mapStateToProps,{getSprintConfig,updateSprintConfig,extendSprint})(ExtendSprint));

