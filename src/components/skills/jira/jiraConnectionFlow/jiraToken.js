import React, { Component, Fragment } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Typography, Alert, message, Button, notification } from "antd";
import { submitTokenData } from "../../skills_action";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
const { Title,Text } = Typography;
class JiraToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userToken: "",
      error: false,
      validEmail:false
    };
  }
  componentDidMount() {
if(this.props.closeModal){
  this.setState({
    userName:this.props.userName?this.props.userName:"",
    userToken:this.props.userToken?this.props.userToken:""
  })
}
// if(this.props.data){

//   this.props.data.form=this.props.form
// }
    this.props.shareMethods(this.submitTokenData.bind(this));
    if(this.props.data.token.done){
      this.setState({userName:this.props.data.token.userName,userToken:this.props.data.token.userToken})
    }
  }

  submitTokenData = () => {
    // console.log("hello how are ")
    this.props.form.validateFields((err, values) => {
      // console.log("in1",this.state)
   if(!err){
    let data={
      userName: this.state.userName,
      userToken: this.state.userToken,
      name:this.props.currentSkill?this.props.currentSkill.name:"Jira",
      

    };
    if( this.props.wiki_type){
      data.server_type=this.props.wiki_type
    }
    if(this.state.userToken &&this.state.userName) {
      this.props.submitTokenData(this.props.match.params.wId, data , this.props.currentSkill)
        .then(res => {
         if (res.data.success) {
       
          if(res.data.skill&&res.data.skill.metadata&&res.data.skill.metadata.webhook){
        if(this.props.closeModal){
              this.props.doNotShowModal()
        }
        else{
        //  console.log("in2")
       
          // console.log("in2",this.props.data.token)
            this.props.moveToNextStep(1);
            this.props.data.token={done:true,userName:this.state.userName,userToken:this.state.userToken}
          //  this.props.data.token={done:true,userName:this.state.userName,userToken:this.state.userToken}
        }
          
        }else{
          if(res.data.skill&&res.data.skill.name=="Wiki"){
            if(this.props.closeModal){
              this.props.doNotShowModal()
                      }else{
         
              // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
              // this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/2`)
              this.props.history.push(`/${this.props.match.params.wId}/wikiConnectionSteps/${this.props.match.params.skill_id}`)
              // this.props.moveToNextStep(2);
            
                    }
          }else{
            notification.warning({
              message: 'Could not enable webhook',
              duration:3,
              description:
                'Please ensure you have admin privileges',
                onClose:()=>{
                  if(this.props.closeModal){
               this.props.doNotShowModal()
                  }else{
                    this.props.moveToNextStep()
                  }
                }
            });

          }
        
       
        }
          }
          else{
            message.error('Invalid Credentials');
          }
        });
    } else {
      this.setState({ error: true });
    }
  }
  })
  };

  getUserName = event => {
    this.setState({
      userName: event.target.value
    });
    // if(this.props.data &&  this.props.data.token){

    //   this.props.data.token.userName=event.target.value
    // }
    // this.props.data.token.userName=event.target.value
  };
  getUserToken = event => {
    this.setState({ userToken: event.target.value });

    // if(this.props.data &&  this.props.data.token){

    //   this.props.data.token.userToken=event.target.value
    // }
    // this.props.data.token.userToken=event.target.value
  };
  render() {
    const { getFieldDecorator} = this.props.form;
 
    return (
      <div style={{height:(this.props.fromConnectionOnboarding && "45vh"), width : this.props.fromConnectionOnboarding && '90%'}}>
        <div style={this.props.showStyles?{width:"55%",margin:"0 auto",textAlign:"left"}:{}}>
        {this.props.fromConnectionOnboarding && <><Title style={{textAlign:"center"}} level={2}>Token Authorization</Title><br/></>}
        {/* <div>
        1. Go to your <a href={(this.props.wiki_type&&this.props.wiki_type=="server")? this.props.domain_url+"/plugins/personalaccesstokens/usertokens.action":"https://id.atlassian.com/manage/api-tokens" }target="_blank">Atlassian account page</a> and <a href= {(this.props.wiki_type&&this.props.wiki_type=="server")? "https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html":"https://confluence.atlassian.com/cloud/api-tokens-938839638.html" } target="_blank">follow these steps</a> to create an API token.
         <br/>
        2. Enter your Atlassian account email address and the API token below and click Next to continue.
        </div> */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text type="secondary">
            Go to your <a style={{color : localStorage.getItem("theme") == 'dark'?'#8c8c8c': 'rgba(0, 0, 0, 0.45)'}} target='_blank' href={(this.props.wiki_type&&this.props.wiki_type=="server")? this.props.domain_url+"/plugins/personalaccesstokens/usertokens.action":"https://id.atlassian.com/manage/api-tokens" }><u>Atlassian account page</u></a> and follow <a style={{color : localStorage.getItem("theme") == 'dark'?'#8c8c8c':'rgba(0, 0, 0, 0.45)'}} target='_blank' href = {(this.props.wiki_type&&this.props.wiki_type=="server")? "https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html":"https://confluence.atlassian.com/cloud/api-tokens-938839638.html"}>
            <u>these steps</u></a> to create an API token.
          </Text>
          <br />
        </div>
        <br />
        <Form layout='vertical' style={{margin:'auto',width : '80%'}}>
          <Form.Item label="Atlassian account email address" className={localStorage.getItem('theme') == "dark" && "form_label_dark"}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please provide the user email address',pattern:/\S+@\S+\.\S+/ }],
            initialValue: this.state.userName
          })( 
          <Input
            prefix={<UserOutlined style={{ color: localStorage.getItem('theme') == "default" ?"rgba(0,0,0,.25)" : '' }} />}
            placeholder="Username"
            onChange={this.getUserName}
            // style={{ marginBottom: "10px"}}
            type="email"
            className={` input-bg ${localStorage.getItem("theme") == 'dark' && "autofill_dark"}`}
            // autoComplete='off'
          />
         )}
           
          
          </Form.Item>
       
          <Form.Item label="API token" hasFeedback className={localStorage.getItem('theme') == "dark" && "form_label_dark"}>
           
          {getFieldDecorator('userToken', {
            rules: [{ required: true, message: 'Please Provide a Token' },{}],
            initialValue: this.state.userToken
          })(<Input
            // prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            prefix={<LockOutlined style={{ color: localStorage.getItem('theme') == "default" ?"rgba(0,0,0,.25)" : '' }} />}
            type="password"
            placeholder="Token"
            onChange={this.getUserToken}
            style={{ marginBottom: "10px" }}
            // autoComplete={"false"}
            className= {"input-bg"}
          />)}
          </Form.Item>
        </Form>
       
        {/* <Alert
          message="You can always prevent access using a previously generated token by deleting it, or by generating a new one. For maximum security, you can create a dedicated user with limited access."
          type="info"
          showIcon
        />
       <br/>      
        <Alert
          message="API token is essential to automatically enable webhook and few other functionality. Skipping this step will result in a sub-optimal Troopr experience for your team."
          type="warning"
          showIcon
        /> */}
          </div>
      </div>
    );
  }
}

export default withRouter(connect(null, { submitTokenData })(Form.create({name:'step_one'})(JiraToken)));
