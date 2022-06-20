import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { CheckCircleOutlined } from '@ant-design/icons';
import { Spin, Button, Card, Result } from "antd";
import TroorLogo from '../../media/circular_troopr_logo.svg';
import queryString from "query-string";
import {
  injectStripe,
  
} from "react-stripe-elements";
//  const stripe= new Stripe('pk_live_F4bnTHQL5ZTQfuhsWAIuyGfE')
class BillingRedirect extends Component {


    constructor(props) {
        super(props);
             this.state = { 
               quantity:"",
               info:{},
               btnLoading:false,
               workspace:{}
             }  
        
            //  this.handleChange = this.handleChange.bind(this);
            //  this.handleSubmit = this.handleSubmit.bind(this);
             this.cancel = this.cancel.bind(this);
             
             
  }

  componentDidMount() {
   let plan_id = queryString.parse(this.props.location.search).plan_id;
   let url=`/auth/payment/${this.props.match.params.wId}/trooprPayment`
    if(plan_id){
      url+= "?plan_id="+plan_id
    }
  
    axios.get(url).then((response) =>{
                        // this.setState({btnLoading:false})
                        if(response.data.success){
                          if(response.data.session.object=="billing_portal.session"){
                            window.location.href =response.data.session.url;
                          }else{
  
                            this.props.stripe.redirectToCheckout({sessionId:response.data.session.id}).then((result) => {
                            });
                          }
                        }else{
                          if(response.data.error=="not_admin"){

                            this.props.history.push("/"+this.props.match.params.wId+'/settings?view=upgrade')
                          }
                        }
                      
                  
                })



      //               });
    // if(!this.props.workspace || (this.props.workspace._id==this.props.match.params.wId)){
//         axios.get("/auth/troopr_billing/payementInfo/"+this.props.match.params.wId).then(res=>{
//                             if(res.data.success){
//                     this.setState({info:res.data.paymentInfo})
//                 }else{
//                     // this.setState({loading:false})
//                 }
//         })
//         this.setState({loading:true})
//         axios.get("/auth/troopr_billing/getWorkpace/"+this.props.match.params.wId).then(res=>{
//           if(res.data.success){
//   this.setState({workspace:res.data.workspace,loading:false})
// }else{
//   this.setState({loading:false})
// }
// })

       

  
    // }
    // this.props.SkillsAction(this.props.match.params.wId);

 }



 
    // this.props.history.push(""+this.props.match.params.wId+"/skills/"+res.data.skill._id)


  // handleChange(event) {
  //   if(!isNaN(event.target.value)){
  //       this.setState({quantity: event.target.value});

  //   }
    
  // }
  // handleSubmit() {

  //   this.setState({btnLoading:true})
  //   if(this.state.quantity){
  //       let data={quantity:this.state.quantity}

  //       axios.post("/auth/troopr_billing/addBillable/"+this.props.match.params.wId,data).then(res=>{
        
  //   if(res.data.success){
  //           axios.get(`/auth/payment/${this.props.match.params.wId}/trooprPayment`).then((response) =>{
  //                   // this.setState({btnLoading:false})
  //               this.props.stripe.redirectToCheckout({sessionId:response.data.session.id}).then((result) => {
  //               });
  //           })
  //   }
  //   })
  //   }else{

  //       this.setState({error:true})
  //   }
  


    
  // }



  cancel=()=>{
    // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.state.sId) 
    this.props.history.push("/"+this.props.match.params.wId+"/dashboard") 
  }


  
  render() {
  const {workspace}=this.state
    // console.log("team",this.props.teamId)
    return (
      <div style={{width:"100vw",height:"100vh" ,display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>
     {(workspace && workspace.billing_status!=="paid")?   <Spin size="large" />:
    <Card    hoverable style={{paddingTop:20,width:"35vw"}}    cover={workspace._id && workspace.billing_status!=="paid"?
        <div style={{ width:"100%","height":"30%" }} className="justify_center column_flex align_center">
          <img
            style={{ width: "20%",height:"20%"}}
            alt="example"
            src={TroorLogo}
          />
             
  <h2 style={{ marginTop:10}}>Upgrade to Troopr Pro plan </h2>
        </div>:null}
        >
       {/* {workspace && workspace.billing_status!=="paid"?
       <div>
           
         
       <div style={{ fontSize: "14px ",marginTop:"14px" ,fontWeight: 700,marginBottom:"5px"}} >Number of active users</div>
       <input type = "text" className = "cutsom_input" onChange={this.handleChange} name="quantity" value={this.state.quantity} placeholder={"Enter active users"}   autoComplete="off"/>

       {this.state.error && !this.state.quantity&&<span className="error_message">Active Users are required</span> }

       
           <Button type="primary" loading={this.state.btnLoading} style={{width:"100%" ,marginTop:"10px"}} onClick={this.handleSubmit}> Pay</Button>
       </div>: */}
       
       <Result style={{padding:0}}
              icon={<CheckCircleOutlined />}
              status="success"
              title="Done"
              subTitle="You are already subscribed to Troopr Pro plan."
            
            />

    </Card>}

   
       </div>
    );
  }
}


export default (withRouter(injectStripe(BillingRedirect)))

