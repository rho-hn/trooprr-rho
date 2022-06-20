// app.get("/api/:wId/wiki/activity/getActivityPerDay",Wiki.getActivityPerDay)
// app.get("/api/:wId/wiki/activity/getActivityPerDayPerUser",Wiki.getActivityPerDayPerUser)

import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Table, Tag, Space ,Menu, Dropdown,Popconfirm,Modal ,Button,Card,Row,Layout,List,Tooltip,Avatar} from 'antd';
import Highlighter from 'react-highlight-words';
import moment from "moment";
import { editAlias,deleteAlias,createAlias,getAliases, } from '../aliases/alias_action'
import {  MoreOutlined,SearchOutlined,    UserOutlined, InfoCircleOutlined  } from '@ant-design/icons';
import queryString from 'query-string';
import { Input } from 'antd';
import { XAxis, Tooltip as ReTooltip, AreaChart, Area, ResponsiveContainer } from "recharts";

import{   Radio,PageHeader,Tabs,Col,Typography, message} from  'antd';
const { Title, Text } = Typography;

const { TabPane } = Tabs;
const { Content } = Layout;
class ConfluecneAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '0',
      adoptionData:[],
      usageData:[],
      activity:[],
      total:0,
      tLoading:false,
      currentActivity:{},
      modalType:"",

      loading:false

    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };
  componentDidMount(){

    // console.log("noobView",this.props.skillView)

    const isTokenisThere = this.props.currentSkill && this.props.currentSkill.metadata &&this.props.currentSkill && this.props.currentSkill.metadata.token_obj&&this.props.currentSkill.metadata.token_obj.userToken
    if(this.props.currentSkill && this.props.currentSkill.metadata && !isTokenisThere) {
      message.error('Token is not added.')
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
    }

    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({ activeTab: parsedQueryString.sView})

    this.setState({ loading:true})
  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/getActivityPerDayPerUser")
  .then(res => {

    if (res.data.success) {
      this.setState({ loading:false})
     this.setState({  adoptionData:res.data.data})
      }


  })

  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/getActivityPerDay")
  .then(res => {
    this.setState({ loading:false})
    if (res.data.success) {
     this.setState({ usageData :res.data.data})
      }


  })


  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/activity?page=1")
  .then(res => {
    this.setState({    tLoading:false})
    if (res.data.success) {
     this.setState({ activity:res.data.activity, total:res.data.total})
      }


  })
    // if(sView=="usage"){

    // }else if(sView="logs"){

    // }else{

    // }
    // this.setOption()

this.getViewData(parsedQueryString.sView)

  }
getViewData=(view)=>{

if(view=="logs"){

  this.setState({    tLoading:true})
  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/activity?page=1")
  .then(res => {
    this.setState({    tLoading:false})
    if (res.data.success) {
     this.setState({ activity:res.data.activity, total:res.data.total})
      }


  })
}else if(view=="usage"){
  this.setState({ loading:true})
  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/getActivityPerDay")
  .then(res => {
    this.setState({ loading:false})
    if (res.data.success) {
     this.setState({ usageData :res.data.data})
      }


  })

}else{
  this.setState({ loading:true})
  axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/getActivityPerDayPerUser")
  .then(res => {

    if (res.data.success) {
      this.setState({ loading:false})
     this.setState({  adoptionData:res.data.data})
      }


  })
}
 

 

}
  onChange=(pagination)=>{

this.setState({tLoading:true})
    axios.get("/bot/api/" + this.props.match.params.wId + "/wiki/activity?page="+pagination.current)
    .then(res => {

      if (res.data.success) {
       this.setState({ activity:res.data.activity, total:res.data.total,tLoading:false})
        }


    })
    // current: 2, pageSize: 10
    // pagination

  }
  openModal=( modalType,activity)=>{
    this.setState({ visible:true , modalType,  currentActivity:activity})
  }


  handleCancel=()=>{

    this.setState({currentActivity:{}, modalType:"",visible:false})
  }


  goToConfluence=(url)=>{

    window.open(url, '_blank');
  }

  setOption(sView) {
    // this.setState({ view: view, id: id, name: name });
    let queryStringObject = queryString.stringify({
      view: "analytics",
      sView:sView

    });
 let  path = window.location.pathname;
 
      const obj = {
        "title": "analytics",
        "url": path + `?view=analytics&sView=${sView}`
      }
      window.history.pushState(obj, obj.title, obj.url);
      this.getViewData(sView)
    
  }

  getQueryName=(name)=>{
let text=name
    if(name.length>25){
        text= text.substring(0, 25).trim()
      return  <Tooltip title={name}>
        <span> {text+"..."}</span>
      </Tooltip>

    }
    return text

      
    }

    _getInitials(string) {
        return string
          .trim()
          .split(" ")
          .map(function(item) {
            if (item.trim() != "") {
              return item[0].toUpperCase();
            } else {
              return;
            }
          })
          .join("")
          .slice(0, 2);
      }
    getModalHeader=()=>{
const {modalType}=this.state
       return  (modalType==="confluecneDoc")? <>{this.getQueryName(this.state.currentActivity.msg.text)} <span>{(" ("+this.state.currentActivity.confluenceData.length+ "  doc found)")}</span></>:(modalType==="helpful")?this.state.currentActivity.likes.length +" people found helpful":this.state.currentActivity.dislikes.length+" people found not helpful"
    }
   
 

  
  render() {
    const { mode } = this.state;
    const table_columns = [
        {
       
          title: 'Request message',
          dataIndex: "query_text",
          key: "message",
         
          render: (text, record) => {
     
                if(!text&&record.msg&&record.msg.text){
                  text=record.msg.text
                }
            return   text?this.getQueryName(text):<></>
          },
        },
        //   ...this.getColumnSearchProps("name"),
        
                 
    
     
      
       { title:"Doc Found" ,
       dataIndex:"confluenceData",
        key:"confluenceData",
        render: (text, record) => {
     

            return  <a onClick={()=>this.openModal("confluecneDoc",record)}>{text?text.length+" doc(s)":"0 doc(s)"}    </a>
          },
        },
    //   ...this.getColumnSearchProps('alias')},
      
     
        // {
        //   title:"Status",
        //    dataIndex:"enabled",
        //     key:"enabled" ,
        //     showSorterTooltip:false,
         
        //   sorter: (a, b) => (a.enabled ? 'Enabled' : 'Not Enabled').length - (b.enabled ? 'Enabled' : 'Not Enabled').length,
      
        //   render: (text, record) => {
            
        //     return  text? <Tag color="green">Enabled</Tag>:<Tag color="red">Disabled</Tag>
        //   }
        // }, 
         {
        
          title: 'Requestor',
          dataIndex: 'activity_by',
           key: "activity_by",
          
          render: (text, record) => {
     
           

            return text? <>{text.displayName||text.name}    </>:<>Unknown User</>
          },

          
        //  ...this.getColumnSearchProps("created_by")
        },
        {
          title:'Channel Name',
          key:'channel',

          dataIndex: 'channel',
          render: (text, record) => {
            // console.log(text)
     
            return text? <>{text.name||text.id||""}    </>:<></>
            // console.log(record)
          },
        },
      
          
       {
          title:"Activity At",
           dataIndex:"activity_at" ,
           key:"activity_at"  ,
           sorter: (a, b) => {
             let d1=new Date(a.activity_at).getTime()
             let d2= new Date(b.activity_at).getTime()
            
            if( d1<d2) { return -1; }
            if(d1 > d2) { return 1; }
            return 0;
        },
        defaultSortOrder: 'descend',
        showSorterTooltip:false,
            render:(text) => {
               
     
       return  moment(new Date(text)).format('Do MMM, h:mm a')
      
       
         
            }
        },
            {
        
            title: 'Helpful',
            dataIndex: 'likes',
             key: "likes",
          
            render: (text, record) => {
                
          
       return  <a onClick={()=>this.openModal("helpful",record)}>{text&&text.length>0?
        <Avatar.Group
        maxCount={2}
        size="small"
        maxStyle={{
          color: '#f56a00',
          backgroundColor: '#fde3cf',
        }}
      >

{text.map(item=>(<Tooltip title={item?item.displayName||item.name||item.user_name:"Unknown User"} placement="top">{ item?item.profilePicUrl?<Avatar  src={item.profilePicUrl} />: <Avatar  >  {this._getInitials(item.displayName||item.name||item.user_name)}</Avatar>:<Avatar icon={<UserOutlined />} /> } </Tooltip >))}
              </Avatar.Group>
        
        :0}    </a>
          
            },
  
            
          //  ...this.getColumnSearchProps("created_by")
          },

          {
        
            title: 'Not Helpful',
            dataIndex: 'dislikes',
             key: "dislikes",
          
            render: (text, record) => {
       
                return  <a onClick={()=>this.openModal("not_helpful",record)}>{text&&text.length>0?
                    <Avatar.Group
                    maxCount={2}
                    size="small"
                    maxStyle={{
                      color: '#f56a00',
                      backgroundColor: '#fde3cf',
                    }}
                  >
            
            
{text.map(item=>(<Tooltip title={item?item.displayName||item.name||item.user_name:"Unknown User"} placement="top">{ item?item.profilePicUrl?<Avatar  src={item.profilePicUrl} />: <Avatar  >  {this._getInitials(item.displayName||item.name||item.user_name)}</Avatar>:<Avatar icon={<UserOutlined />} /> } </Tooltip >))}
                          </Avatar.Group>
                    
                    :0}    </a>
                      
                        },
              
                        
                      //  ...this.getColumnSearchProps("created_by")
               
 
  
  
            
          //  ...this.getColumnSearchProps("created_by")
          },
      ];



    //   {
    //     "_id" : ObjectId("61384450757c5058ee3efe85"),
    //     "confluenceData" : [ 
    //         {
    //             "url" : "https://stagetrooprnov.atlassian.net/wiki/spaces/TEST/pages/16449590/lables+used+in+this+for+tr+lvl+dv+but+keyword+not+used+anywhere",
    //             "title" : "lables used in this for tr lvl dv but keyword not used anywhere",
    //             "id" : "16449590"
    //         }
    //     ],
    //     "msg" : {
    //         "text" : "development",
    //         "ts" : "1631077454.001600"
    //     },
    //     "team_id" : ObjectId("60b7139660cb173b7b4d3ae2"),
    //     "workspace_id" : ObjectId("60b713974e6cc132ba0a991e"),
    //     "activity_by" : ObjectId("60b7139860cb173b7b4d3ae9"),
    //     "activity_at" : ISODate("2021-09-08T05:04:16.181Z"),
    //     "__v" : 1
    // }
    
    return (
        
        <Content style={{  overflow: "scroll", overflowX:'hidden',marginLeft:0 }}>
       
        <Row
          gutter={[36, 36]}
          justify="space-between"
          align="bottom"
          style={{ padding: 36 }}
        >
          <Col xs={{ span: 20 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 12 }}>
          <Card
                  
                  style={{ width: "100%" ,height:300}}
                  bodyStyle={{height:"100%", padding: 12 }}
                  size="small"
                  title={
                    <Tooltip
                      placement="bottomLeft"
                      title="Showing number of active users in past 90 days"
                    >
                      <Title level={5}>
                        Adoption Report
                        <InfoCircleOutlined style={{ paddingLeft: 8 }} />
                      </Title>
                    </Tooltip>
                  }
                  loading={this.state.loading}
                > 
                <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={this.state.adoptionData}>
                      <ReTooltip contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }} />
                      <XAxis dataKey={"date"} />
                      <Area
                        type='monotone'
                        dataKey='users'
                        fill={localStorage.getItem("theme") === "default" ? "#402E96" : "#664af0"}
                        // strokeWidth={2}
                        // fillOpacity={1}
                      />
                    </AreaChart></ResponsiveContainer>
                    </Card> 
          </Col>
          <Col  xs={{ span: 20 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 12 }}>
          <Card
        
        style={{ width: "100%",height:300 }}
        bodyStyle={{height:"100%"  }}
        size="small"
        title={"Usage"}
        loading={this.state.loading}
        title={
          <Tooltip
            placement="bottomLeft"
            title="Showing number of Confluence activities (articles served,
          clicked, voted, searched etc) in past 90 days"
          >
            <Title level={5}>
              Usage Report
              <InfoCircleOutlined style={{ paddingLeft: 8 }} />
            </Title>
          </Tooltip>
        }
      > 
       <ResponsiveContainer width="100%" height="90%">
  <AreaChart data={this.state.usageData} >
            <ReTooltip contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }} />
            <XAxis dataKey={"date"} />
            <Area
              type='monotone'
              dataKey='activities'
              fill={localStorage.getItem("theme") === "default" ? "#402E96" : "#664af0"}
              // strokeWidth={2}
              // fillOpacity={1}
            />
          </AreaChart>  
          </ResponsiveContainer>
              </Card>
          </Col>
          <Col         xs={{ span: 20 }}
                sm={{ span: 24 }}
                lg={{ span: 24 }}
                xxl={{ span: 24 }}>
            <Table
              
              
              title={() => (
                <Tooltip
                  placement="bottomLeft"
                  title="Showing all Confluence search activity details"
                >
                  <Title level={5}>
                    Activity Log
                    <InfoCircleOutlined style={{ paddingLeft: 8 }} />
                  </Title>
                </Tooltip>
              )}
              loading={this.state.tLoading} 
              pagination={{ pageSize: 10 },{total:this.state.total||10,showTotal:total => `Total ${total} activities`}} 
              columns={table_columns} 
              onChange={this.onChange}
              dataSource={this.state.activity}
              // style={{ margin: 16 }}
            />
            {this.state.visible&& <Modal title={ this.getModalHeader()} visible={this.state.visible} footer={null} onCancel={this.handleCancel} >

      <List

    itemLayout="horizontal"
   
    dataSource={this.state.modalType==="confluecneDoc"?this.state.currentActivity.confluenceData:this.state.modalType==="helpful"?this.state.currentActivity.likes:this.state.currentActivity.dislikes}
    renderItem={(item ,index)=> (
      <List.Item key={item?item._id||item.id:index}>
        {/* <List.Item.Meta */}
         
        {this.state.modalType==="confluecneDoc"? <h4>{index+1 +": "}<a style={{color: "#402E96"}}onClick={()=>this.goToConfluence(item.url)}>{item.title}</a></h4>: <div>  <>
        {item?item.profilePicUrl?<Avatar src={item.profilePicUrl} />: <Avatar>  {this._getInitials(item.displayName||item.name||item.user_name)}</Avatar>:<Avatar icon={<UserOutlined />} /> }  </>
            <span style={{  marginRight: 4, lineHeight: "24px" }}>
                          {" "}
                          {item?item.displayName||item.name||item.user_name:"Unknwon User"}{" "}
                  
                        </span></div>
   
                        
                 
        
        
        // <List.Item.Meta
        //   avatar={item.profilePicUrl?<Avatar src={item.profilePicUrl} />: <Avatar icon={<UserOutlined />} />}
        //   title={item.displayName||item.name||item.user_name}
        //   description={item.email}
   
        // />
        
        }
          
        {/* /> */}
      </List.Item>
    )}
  />

    </Modal>}
          </Col>
        </Row>
        

      </Content >
      
      )
  }
}


const mapStateToProps = state => ({
 aliases:state.confluecne.aliases,
 members: state.skills.members,
 currentSkill:state.skills.currentSkill
});


export default withRouter(connect( mapStateToProps,{ editAlias,deleteAlias,createAlias,getAliases})( ConfluecneAnalytics)); 
 