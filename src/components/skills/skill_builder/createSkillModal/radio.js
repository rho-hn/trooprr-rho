import React, { Component } from 'react';




class CustomRadio extends Component {


  render() {


    return (
        <label className={"ant-radio-wrapper"+ (this.props.checked ? ' ant-radio-wrapper-checked' : '')}>
        <span className={"ant-radio"+ (this.props.checked ? ' ant-radio-checked' : '')}>
           <input type="radio" className="ant-radio-input" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.props.onChange} /> 
           <span  className="ant-radio-inner">
         </span></span><span>{this.props.label}</span>
         </label>
  


 


  

    );
  }
}



export default CustomRadio; 

