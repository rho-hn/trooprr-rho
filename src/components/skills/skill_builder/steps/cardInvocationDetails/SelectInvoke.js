import React,{Component,Fragment} from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Select, Radio } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {timeArr,dayArr} from "./CardInvocation.utils"
import {checkTriggerPharse,getUserInfo} from "../CardActions"
import TimeZones from "../../../../../utils/MomenttimeZone"
import "./steps.css"


const { Option } = Select;
const formItemLayout = {
  
};
class SelectInvoke extends Component {
 constructor(props) {
   super(props)

   this.state = {
    value:  (this.props.data.triggerInformation && this.props.data.triggerInformation.frequency)?this.props.data.triggerInformation.frequency:"daily",
    disabled:true,
    radioValue:(this.props.data.triggerInformation && this.props.data.triggerInformation.weekends)?this.props.data.triggerInformation.weekends:false,
   //  radioValue:false,
    error:false,
    userTimezone:"",
    triggerOnWeekends:false
   }
   
}
async componentDidMount(){

if(this.props.mode==="save"){

 if(this.props.data.triggerInformation && this.props.data.triggerInformation.timeZone){
   this.setState({userTimezone:this.props.data.triggerInformation.timeZone});
   if(this.props.data.triggerInformation && this.props.data.triggerInformation.weekends){
     this.setState({triggerOnWeekends:this.props.data.triggerInformation.weekends});

   }


 }else{
   this.props.getUserInfo().then(res=>{
     // console.log(res);
     this.setState({userTimezone:res.data.user.timezone})
     // if(this.props.data.triggerInformation && this.props.data.triggerInformation.weekends){
     //   this.setState({triggerOnWeekends:this.props.data.triggerInformation.weekends});
 
     // }
   })
 }


 
}
else {
 this.setState({userTimezone:this.props.data.triggerInformation.timeZone,triggerOnWeekends:this.props.data.triggerInformation.weekends})
}
 
}
onChange=(e)=>{
 // console.log("ee-->",e)
this.setState({value:e.target.value})

}
onChangeRadio=(e)=>{
this.setState({radioValue:e.target.value})
}
onCheckChange=(e)=>{

this.setState({disabled:!e.target.checked})

}
getFormSelections=(value)=>{
 const { getFieldDecorator} = this.props.form;
 // console.log(this.props);
 
 return  <Fragment>
   {this.state.value==="weekly"?     <div className="flex_column"  style={{marginBottom:10}}>
                               <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Select A day</div>
                               <Form.Item {...formItemLayout}  style={{margin:0}}>
         {getFieldDecorator('selectedDay', {
             rules: [{ required: true, message: 'Select A day'}],
             initialValue: this.props.data.triggerInformation.selectedDay
         })( <Select
           showSearch
        autoClearSearchValue
        
        onChange={this.handleChange}
        placeholder="Select a day"
        tokenSeparators={[","]}
        name="Select a day"
        
        filterOption={(input, option) =>
         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }>
          {dayArr.map(d => (
    <Option key={d.value}>{d.text}</Option>
  ))}
         </Select>)}
     </Form.Item></div>
     :   
     <div className="flex_column"  style={{marginBottom:10}} >
                               <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Should Trigger On Weekends</div>
                               <Form.Item style={{margin:0}}>
               {getFieldDecorator('weekends', {
                   rules: [{ required: true, message: 'Cannot be empty!'}],
                   initialValue: this.state.triggerOnWeekends
               })(                <Radio.Group  name='csasad' onChange={this.onChangeRadio}  style={{margin:0}}>
                 <Radio  value={true}>Yes</Radio>
                 <Radio  value={false}>No</Radio> 
                 
               </Radio.Group>)}
           </Form.Item></div>
     
     
     
  

               }
  

  <div className="flex_column"  style={{marginBottom:10}}>
                               <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Time Of Day</div>
                               <Form.Item {...formItemLayout} style={{margin:0}}>
         {getFieldDecorator('timeOfDay', {
             rules: [{ required: true, message: 'Select Time'}],
             initialValue: this.props.data.triggerInformation.timeOfDay || "10:00"
         })( <Select
           showSearch
        autoClearSearchValue
        placeholder="Select Time"
        filterOption={(input, option) =>
         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
        name="SelectTime">
           {timeArr.map(d => (
    <Option key={d.value}>{d.text}</Option>
  ))}
         </Select>)}

     </Form.Item>
     </div>
     <div className="flex_column"  style={{marginBottom:10}}>
         <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Select Timezone</div>
     <Form.Item {...formItemLayout} style={{margin:0}}>
     {getFieldDecorator('timeZone', {
         rules: [{ required: true, message: 'Select Timezone'}],
         initialValue: this.state.userTimezone
     })( <Select
       showSearch
    autoClearSearchValue
    placeholder="Select TimeZone"
    filterOption={(input, option) =>
     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
     }
    name="SelectTimeZone">
     {/* {Timezone.timezones.map((item,index)=>{
return <Option   key={index} value={item.utc[0]}>{item.text}</Option>
})} */}
{TimeZones.map((item,index)=>{
return <Option   key={index} value={item}>{item}</Option>
})}
     </Select>)}
 </Form.Item>
 </div>

 
{/* <Form.Item style={{ marginBottom: 2 }} >
               {getFieldDecorator('is_trigger', {
                   rules: [{ required: false, message: 'Cannot be empty!'}],
                   // initialValue: this.state.
               })(<Checkbox onChange={this.onCheckChange}>Allow skill to be triggerd manually./troopr (trigger phrase)</Checkbox>)}
           </Form.Item> */}

     
{/* <div className="form_group_label" >Trigger Word (Used to invoke Skill on Demand ex:myreport)</div> */}
{/* <Form.Item style={{ marginBottom: 2 }}>
               {getFieldDecorator('triggerPhrase', {
                   rules: [{ required:true, message: 'Cannot be empty!'}],
                   initialValue: this.props.data.triggerInformation.triggerPhrase
               })(<Input
                 name="trigger_phrase"
             
                 placeholder="trigger phrase"
             
           />)}
           </Form.Item> */}

           </Fragment>

}

  validateInput=(e)=>{
 
   e.preventDefault();
   this.setState({
     error:false
   })
   // console.log("hello2")
   this.props.form.validateFields((err, values) => {
     // console.log("hello3",err)
     // console.log("hello4",this)
       if(!err) {
      
         
         // console.log("hello4",this)
         values.frequency=this.state.value
         this.props.data.triggerInformation=values
         // console.log("helllo6")
         // console.log("hello5",this.props.match)
           // this.props.checkTriggerPharse(this.props.match.params.wId,values.triggerPhrase,this.props.data._id).then(res=>{


             // if(res.data.success){
               this.props.nextStep();
           //   }else{

           //     console.log("hello5")
           //     if(res.data.error=="already_exists"){
           //       this.setState({
           //         error:"Skill with trigger phrase: "+values.triggerPhrase+ " already exists."
           //       })

           //     }else{
           //       this.setState({
           //         error:"Error adding skill"
           //       })

           //     }
           //   }
           // }).catch(err=>{

           //   console.log(err)
           // })
       
           // this.props.submittedValues(values);
           
       }else{
         console.error(err)
       }
   });
  }
 storeValues = () => {
   // console.log("this.props.form",this.props.form.getFieldsValue())
const values=this.props.form.getFieldsValue();
values.frequency = this.state.value
values.weekends = this.state.radioValue
  this.props.data.triggerInformation= values
 

   this.props.prevStep();
}
//data={this.state.data} nextStep={()=>this.onStepChange("slack_step")} prevStep={()=>this.onStepChange("configure_step")

 render() {
   const {} = this.props.form;

 
   
   return (
 <Form onSubmit={this.validateInput}  layout="">
        <div className="flex_column"  style={{marginBottom:10}}>
                               <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Frequency</div>
     <Form.Item style={{margin:0}}>
    <Radio.Group onChange={this.onChange}  value={this.state.value} name="daily_weekly" style={{display:"flex"}}>
       <Radio className="radio_styl" value="daily">Daily</Radio>
       <Radio className="radio_styl" value="weekly">Weekly</Radio>
         </Radio.Group>
         </Form.Item></div>
     {this.getFormSelections(this.state.value)}
    {this.state.error&& <span className="error_message">{this.state.error}</span>}
     <div style={{ marginBottom: 2 ,display:"flex",justifyContent:"space-between",marginTop:"24px" }}>
        
         <Button type="default" onClick={this.storeValues} style={{marginLeft:"10px"}} >
                   Back
               </Button>
               <Button type="primary" htmlType="submit">
             Next
         </Button>
     </div>
 </Form>
   )
 }
}





export default withRouter(connect(null,{checkTriggerPharse,getUserInfo})(Form.create({name:'step_one'})(SelectInvoke)))












