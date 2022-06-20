import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Select, Typography, Alert } from "antd";
import queryString from 'query-string';
import axios from "axios";
const { Title } = Typography;
const { Option } = Select;
class JiraDomainSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: "",
      domainName:"",
      domainInfo: "",
      btnLoading: false,
      loading: false,
      error: false
    };
 
  }

  componentDidMount() {
    var id = this.props.match.params.domain_id;
    this.setState({ loading: true });
    
    axios.get("/api/getJiraDoamin/" + id).then(res => {
      this.setState({ loading: false });
      if(res.data.success) {
        this.setState({ domainInfo: res.data.domainInfo });
      }
    });
    this.props.shareMethods(this.saveDoamin.bind(this));
    
    
if(this.props.data.domain.done){
  this.setState({domain:this.props.data.domain.domain})
}
  }

  onChange(value,event) {

    
    this.setState({ domain: value,domainName:event.props.name });
  }
  saveDoamin() {
   
    
    if(this.props.data.domain.done){
this.props.moveToNextStep()
    }else{
    
      
    if (this.state.domain) {
      var data = {
        id: this.state.domainInfo._id,
        cloud_id: this.state.domain
      };
      axios.post("/api/addJiraDoamin", data).then(res => {  
        
        if (res.data.success) {      
       
          
          if (res.data.channelId && res.data.channelId.channelId) {
            
            
            let [channelId,...channelName] = res.data.channelId.channelId.split("-");
           
            this.props.data.channelInfo=true
              this.props.data.channelDefaults.id= channelId
            this.props.data.channelDefaults.channelName=channelName.join('-')
            this.props.data.linking={done:false,issueType: {},
            project: {},
            channel: {id:channelId,name:channelName.join('-')},autoCreateFields:{}}  
            
          }
          this.props.data.domain={done:true,domain:this.state.domainName}
          this.props.data.skill_id=res.data.skill_id
          this.props.moveToNextStep();
        }
      });
    }else {
      this.setState({ error: true });
    }
  }
  }

  render() {
    
    let query=queryString.parse(this.props.location.search)
if(query.domainName){
  this.props.data.domain.done=true
  this.props.data.skill_id=this.props.match.params.domain_id

  if(query.channelInfo){
  let channelInfo=query.channelInfo.split("-")
  this.props.data.channelInfo=true
  this.props.data.channelDefaults.id= channelInfo[0]
  this.props.data.channelDefaults.name=channelInfo[1]
  } 
}
    return (
      <div style={{alignItems:"center",height:'45vh'}}>
      {this.props.data.domain.done||query.domainName?<Fragment>
        <Alert
          message={`Congratulations! You have successfully authorized Troopr App to access Jira domain:${query.domainName?query.domainName:this.props.data.domain.domain}.atlassian.net`}
          type="success"
          showIcon
        />
        <br />
        <div> Click Next to continue! </div>

        </Fragment>:
      <Fragment>

        <Title level={2}>Select a Jira domain</Title>
        <Alert
          message="Congratulations! You have successfully authorized Troopr App."
          type="success"
          showIcon
        />
        <br />
        <div>Pick a Jira domain and click Next to continue! </div>
        <br />
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a jira domain"
          optionFilterProp="children"
          onSelect={(value, event) => this.onChange(value, event)}
          value={this.state.domain}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.state.domainInfo &&
            this.state.domainInfo.domains.map((domain, index) => {
              return (
                <Option key={domain.id} name={domain.name} value={domain.id}>
                  {domain.name}
                </Option>
              );
            })}
        </Select>
        {this.state.error && !this.state.domain && (
          <span className="error_message errorMessage">Domain is Required</span>
        )}
      </Fragment>
        }
        </div>
    );
  }
}

export default withRouter(JiraDomainSelection);

// import React from 'react';
// import { withRouter} from 'react-router-dom';
// import { Spin,Button,Card,Select} from "antd";
// import axios from 'axios';
// import "./domainSelect.css"
// import logo from '../../../media/circular_troopr_logo.svg';
// const { Option } = Select;
// class JiraDomainSelection extends React.Component {
// 	 constructor(props) {
//      super(props);
//         this.state={
//             domain:"",
//             domainInfo:"",
//             btnLoading:false,
//             loading:false
//          }
//      this.saveDoamin=this.saveDoamin.bind(this)
//      this.onChange=this.onChange.bind(this)
//   }

//      componentDidMount() {
//         var id=this.props.match.params.domain_id
//         if(!id){
//           id = window.location.pathname.split('/')[4]
//         }
//         this.setState({loading:true})
//          axios.get('/api/getJiraDoamin/'+id).then(res=>{
//           this.setState({loading:false})
//             if(res.data.success){
//              this.setState({ domainInfo:res.data.domainInfo})
//             }
//          })
//      }

//       onChange(value) {
//            this.setState({domain:value})
//       }

//      saveDoamin(e) {
//       this.setState({btnLoading:true})
//         if(this.state.domain){
//             var data = {
//                 id:this.state.domainInfo._id,
//                 cloud_id:this.state.domain
//             }

//             axios.post('/api/addJiraDoamin',data).then(res=>{

//                     if(res.data.success){
//                       this.setState({btnLoading:false})

//                       if(res.data.channelId&&res.data.channelId.channelId){
//                         let channelInfo=res.data.channelId.channelId.split("-")

//                         this.props.history.push({pathname:"/"+res.data.workspace_id+"/jira_default/"+res.data.skill_id,state:{channelId:channelInfo[0],channelName:channelInfo[1]}})
//                       }
//                     else{

//                     //  this.props.history.push(`/${res.data.workspace_id}/skills/${res.data.skill_id}`)
//                       this.props.history.push({pathname:`/${res.data.workspace_id}/onBoardingSuccess/${res.data.skill_id}`,
//                       state:{name:"Jira",text:"Succesfully connected to Jira."}

//                     })
//                   }
//                       // if(res.data.location){
//                       //   this.props.history.push("/"+res.data.workspace_id+"/jira_standup_onboard")
//                       // }else{

//                       // }

//                     }
//                   })
//                     }else{
//                         this.setState({errors:"No Domain Selected"})
//                     }
//                 }

//      render() {
//        return(
//   <div style={{height:"100vh" ,display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>
//     {this.state.loading?<Spin size="large" />:
//       <Card    hoverable style={{paddingTop:20,width:"35vw"}} cover={
//       <div style={{ width:"100%","height":"30%" }} className="justify_center column_flex align_center">
//       <img
//                 style={{ width: "12%",height:"12%"}}
//                 alt="example"
//                 src={logo}
//               />
//                   {/* <h2 style={{ marginTop:10}}>Troopr </h2> */}
//     </div>}>
// <div className="flex_column" style={{marginBottom:25,marginTop:10}}>

//     <div className="form_group_label" > Select Jira Domain</div>
//                 <Select
//                                     showSearch
//                                     style={{ width: "100%" }}
//                                     placeholder="Select a jira domain"
//                                     optionFilterProp="children"
//                                     onChange={this.onChange}
//                                     value={this.state.domain}
//                                     filterOption={(input, option) =>
//                                     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                                     }>

//                     {this.state.domainInfo && this.state.domainInfo.domains.map((domain, index) => {
//                             return (
//                                 <Option key = {domain.id} value={domain.id}>{domain.name}</Option>
//                                   );
//                            } )}
//                 </Select>
//               </div>
//        <Button type="primary" loading={this.state.btnLoading} style={{width:"100%" ,marginTop:"10px"}} onClick={this.saveDoamin}> Submit</Button>
//   </Card>}
// </div>

//         )
//     }
// }

// export default withRouter(JiraDomainSelection)
