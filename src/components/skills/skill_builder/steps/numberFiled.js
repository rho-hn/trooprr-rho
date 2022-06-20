


import React, { Component } from 'react';
import {connect} from "react-redux";

import { withRouter } from "react-router-dom";







class NumberField extends Component {
  state = {

    [this.props.field.key]:""
  };




 componentDidMount=()=>{
    if(this.props.data[this.props.field.key]){
        this.setState({
            [this.props.field.key]: this.props.data[this.props.field.key]
           })
    }

}


 
    
  componentWillReceiveProps(props,state){
   
    if(!this.props.data[this.props.field.key] && props.data[this.props.field.key]){
        this.setState({
            [props.field.key]: props.data[this.props.field.key]
           })
    }
  }

    
         





 
    



 

 onChange=(e)=>{

if(!isNaN(e.target.value)){

    this.props.data[this.props.field.key]=e.target.value
    // console.log(this.props.data)
    this.setState({
     [this.props.field.key]:e.target.value
    })

}
   
    // let data={target:{name:this.props.keyValue,value:value}};
    // this.setState({
    //   currentData:data
    // })
    // console.log("data",data)
    // this.props.onChange(data)
  
   
  
 }

 getLabel = (label) => {
if(label == "Max estimate (in hrs)"){
  let tmp = label.split(' ');
  tmp[1] = tmp[1].charAt(0).toUpperCase() + tmp[1].slice(1)
  return tmp[0]+' '+tmp[1]+' '+tmp[2]+' '+tmp[3]; 
     
}else{return label}

}

  render() {
// console.log(this.props.data.field,"what is this")


    return (

        <div > 
        <div className="form-divide" style={{fontWeight:'bold'}}>       
       {/* { this.props.field.label} */}
       {this.getLabel(this.props.field.label)}
        </div>
       <input value={this.state[this.props.field.key]  }  name={this.props.field.key} className="cutsom_input" onChange={this.onChange} 
       style={{background:(localStorage.getItem('theme') == "dark" && "#1f1f1f"),border:(localStorage.getItem('theme') == "dark" &&"1px solid #434343"),color:(localStorage.getItem('theme') == "dark" && "#cccccc")}}
       />
     

      
        
      </div>
     


 


  

    );
  }
}

    
const mapStateToProps = (state) => {
    return {  

//  fields: state.skill_builder.fields,
  }};
  
  export default withRouter(connect(mapStateToProps, {

   })(NumberField)); 


