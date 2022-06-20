
import { Modal, Button,Row,Col,Select,DatePicker,Skeleton, Menu } from 'antd';
import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from 'moment';
import {getSprintConfig,updateSprintConfig} from "../section/sprintActions"
import { ControlOutlined } from '@ant-design/icons';

const { Option } = Select;

class SprintConfigure extends Component {
 constructor(props) {
   super(props)

   this.state = {
    visible: false ,
    data:{}
   }
 }

componentDidMount(){


}
showModal = () => {
    
    this.setState({
      visible: true,loading:true
    });
    this.props.getSprintConfig(this.props.match.params.wId,this.props.match.params.pId).then(res=>{
        this.setState({
            visible: true,loading:false,
            data:res.data.sprintConfig?{duration:res.data.sprintConfig.duration,break:res.data.sprintConfig.break,spillOver:res.data.sprintConfig.spillOver}:{}
          });

    })


  };

  handleOk = e => {

 
    this.setState({
        buttonLoad: true,
      });
    this.props.updateSprintConfig(this.props.match.params.wId,this.props.match.params.pId,this.state.data).then(res=>{
        if(res.data.success){
            this.setState({
                visible: false,
                buttonLoad: false,
                data:res.data.sprintConfig?{duration:res.data.sprintConfig.duration,break:res.data.sprintConfig.break,spillOver:res.data.sprintConfig.spillOver}:{}
    
              });
        }
      

    })
   
  };

  handleCancel = e => {
  
    this.setState({
      visible: false,
    });
  };

  onChange=(value, select_data, type)=>{

let data=this.state.data
data[type]=value
this.setState({data:data})
  }


render() {
let config=this.props.config
return (
    <Fragment>
      {this.props.type==="menu"?
      <Menu.Item key="manage_sprint" onClick={this.showModal} icon={<ControlOutlined />}>
      Manage
    </Menu.Item>:
    // <Button  size="small" onClick={this.showModal} icon={<ControlOutlined />} >
    <div onClick={this.showModal}>
      <ControlOutlined  style={{marginRight:'6px'}}/>
    Configure Sprint
    </div>
  // </Button>
  }
    <Modal
    title="Configure Sprint"
    visible={this.state.visible}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
    footer={this.state.loading?null:[
        
        <Button key="back" onClick={this.handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={this.handleOk}>
          Submit
        </Button>,
      ]}
    >
    <Skeleton loading={this.state.loading} >
    <Row gutter={[8, 8]}>
      <Col span={8}>
        <span>Sprint Duration</span>
      </Col>
      <Col span={16}>
        {/* <span style={{ padding: 6 }} /> */}
        <Select defaultValue={config.duration} style={{ width: "100%" }} onChange={(value, data) => this.onChange(value, data, "duration")}>
          <Option value={7}>1 week</Option>
          <Option value={14}>2 weeks</Option>
          <Option value={21}>3 weeks</Option>
          <Option value={28}>4 weeks</Option>
          <Option value={42}>6 weeks</Option>
          <Option value={56}>8 weeks</Option>
        </Select>
      </Col>
      <Col span={8}>
        <span>Sprint Break </span>
      </Col>
      <Col span={16}>
        <Select defaultValue={config.break} style={{ width: "100%" }} onChange={(value, data) => this.onChange(value, data, "break")}>
          <Option value={0}>No Break</Option>
          <Option value={1}>1 day</Option>
          <Option value={2}>2 days</Option>
          <Option value={3}>3 days</Option>
          <Option value={4}>4 days</Option>
          <Option value={5}>5 days</Option>
          <Option value={14}>2 weeks</Option>
        </Select>
      </Col>
    
      <Col span={8}>
        <span>Sprint Starts </span>
      </Col>
      <Col span={16}>
        <DatePicker
          defaultValue={config._id?moment(config.next_run_at, "YYYY-MM-DD"):null}
          disabled
          style={{ width: "100%" }}

        />
      </Col>


      <Col span={8}>
        <span>Sprint Spillover </span>
      </Col>
      <Col span={16}>
        <Select defaultValue={config.spillOver} style={{ width: "100%" }}  onChange={(value, data) => this.onChange(value, data, "spillOver")}>
          <Option value="backlog">Move to Backlog</Option>
          <Option value="sprint">Move to Next Sprint</Option>
        </Select>
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
export default withRouter(connect(mapStateToProps,{getSprintConfig,updateSprintConfig})(SprintConfigure));

