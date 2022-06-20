import  { Card } from "antd";
import React, { Component } from 'react';
import {connect} from "react-redux";
import {getServiceOperations} from "../skillBuilderActions";


//OPERATIONS

class OperationCard extends Component {





  render() {

    //   console.log(this.props)
    const {key, operation } = this.props;
    return (
   

        <div onClick={this.props.onClick} key={key} style={{marginBottom:"10px" }}>
        <Card style={{ width: "100% ",cursor:"pointer"}} bodyStyle={ {padding:"12px"}} >
          <div  style={{ fontSize: "14px ",fontWeight: 700}} >{operation.label}</div>
          <div>{operation.desc}</div>
        </Card>
      </div>


 


  

    );
  }
}
const mapStateToProps = (state) => {
//   console.log(state.skill_builder)
//   console.log(state)
  return {
  
//     skillService:state.skill_builder.services,
//     operations:state.skill_builder.operations,
//   // skillSetData: state.skills.skillSetData,
}};


export default (connect(mapStateToProps, {getServiceOperations

 })(OperationCard)); 

