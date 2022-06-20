import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {Modal,Select, Card ,Button,Switch,Radio ,Checkbox,Row,Col,Typography,Collapse,Layout,Alert,message} from 'antd';
import ConfluenceAliases from "./aliases/alias_main"
import { getConfluenceSpaces ,getConfluenceChannelConfig,addConfluenceChannelConfig, checkChannelConfigs, deleteConfluenceChannelConfig} from '../skills_action';
import ConfluenceChannelAdmin from "./confluence_channel_admins"
const { Text, Title } = Typography;
const { Content } = Layout;
const { Option } = Select;
const matching_type_options = [
  { label: 'Loose', value: 'loose' },
  { label: 'Tight', value: 'tight' },
];
const matching_scope_options = [
  { label: 'Title, Label', value: 'title' },
  { label: 'Title, Label, Content', value: 'all' },
];

// showCreateButton:this.state.showCreateButton,
//         isKeywordSearchActive:this.state.isKeywordSearchActive,
//         searchContent:this.state.searchContent,

 class ConfluenceCard extends Component {
constructor(props) {
  super(props)

  this.state = {
      config_spaces:[],
      visible: false ,
      selected_spaces:[],
      auto_suggest:true,
      isKeywordSearchActive:true,
      showCreateButton:true,
      searchContent:true,
      previousValues:[],
      restrictAccess:false,
      config:{},
      configLoading : false,
  }
  this.openSettingModal=  this.openSettingModal.bind(this)

}


componentDidMount(){
    this.setState({configLoading : true})
    this.props.getConfluenceChannelConfig(this.props.match.params.wId,this.props.channel.id).then(res=>{

if(res.data && res.data.success){
  // this.setState({configLoading : false})
  let {config}=res.data
 if(config===null){
  checkChannelConfigs(this.props.match.params.wId,{requiredData : ['channel_sync'],channel_id : this.props.channel.id}).then(res => {
    if(res.success){
      this.setState({configLoading : false})
      if(res.channelMeta.channel_sync_present) {
        message.error({
          style: {
            width: '60vw',
            margin:'auto'
          },
          content: (
            <>
              #{this.props.channel.name || 'This CHannel'} is configured for channel sync. Delete the configuration first before proceeding, 
              To delete the channel sync configuration, type '/t configure' in that channel and click "Delete".
            </>
          ),
        }); 
        this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=channel_preferences`)
      }
      else this.updateConfiguration(true)
    }
  })
// this.updateConfiguration(true)
 }
 else if(config){
  this.setState({configLoading : false})
 let currentUser=this.props.user_now;
let isChannelAdmin=true

if(this.props.isWorkspaceAdmin){
isChannelAdmin=true
}
else{
  if(currentUser&&currentUser._id&&config.restrict_channel_config){
    let checkForAdmin=config&&config.channel_admins&&(config.channel_admins.find(el=>el.toString()===currentUser._id.toString()))
    
    if (checkForAdmin) {
      isChannelAdmin = true
    }
    else {
      isChannelAdmin=false
    }
    
    }
}
 

 
  this.setState({
    // visible: false,
    auto_suggest:config.auto_suggest,
    isKeywordSearchActive:config.isKeywordSearchActive,
    searchContent:config.searchContent,
    showCreateButton:config.showCreateButton,
    config_spaces:config,
    selected_spaces:config.spaces||[],
    restrictAccess: !isChannelAdmin,
    config:config
  
    // loading:false
  });


 
 }
    

}
      

    })

    // this.props.getConfluenceSpaces(this.props.match.params.wId)
}



openSettingModal() {


    this.props.getConfluenceSpaces(this.props.match.params.wId).then(res=>{
      const {config}=this.props
      let _obj={}
      if(config){
  
        _obj={showCreateButton:config.showCreateButton,isKeywordSearchActive:config.isKeywordSearchActive,searchContent: config.searchContent}
        if(this.state.config.spaces){
           _obj.config_spaces=this.state.config&&this.state.config.spaces?this.state.config.spaces.map(space=>space.id):[]
  
          _obj.selected_spaces=Array.from(this.state.config&&this.state.config.spaces?this.state.config.spaces:[])
          
          _obj.previousValues=Array.from(this.state.config&&this.state.config.spaces?this.state.config.spaces:[])
        }
  
  
  
      }
  
      _obj.visible=true
      this.setState(_obj);
      
    })
   
    
      };
  

 handleOk = () => {

 
    this.setState({

        loading:true
      });
    
    this.props.addConfluenceChannelConfig(this.props.match.params.wId,{  
        workspace_id:this.props.match.params.wId,
        channel:this.props.channel,
        spaces:this.state.selected_spaces,
        skill_id:this.props.match.params.skill_id
      }
        ).then(res=>{

            this.setState({
                visible: false,
                showCreateButton:res.data && res.data.config&&res.data.config.showCreateButton,isKeywordSearchActive:res.data&&res.data.config&&res.data.config.isKeywordSearchActive,searchContent:res.data&&res.data.config&&res.data.config.searchContent,
                auto_suggest:res.data && res.data.config&&res.data.config.auto_suggest,
              loading: false,
                config:res.data&&res.data.config
              });

        })
      
//  console.log("okay")
  };

showErrorMessage(){
  let text=`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames()}`
return text
}

  updateConfiguration=(addNewone)=>{

    this.props.addConfluenceChannelConfig(this.props.match.params.wId, {
      workspace_id: this.props.match.params.wId,
      channel: this.props.channel,
      showCreateButton: this.state.showCreateButton,
      isKeywordSearchActive: this.state.isKeywordSearchActive,
      searchContent: this.state.searchContent,
      auto_suggest: this.state.auto_suggest,
      skill_id: this.props.match.params.skill_id
    },
      addNewone
    ).then(res => {
      
    
        this.setState({config:res&&res.data&&res.data.config })
      
    
    })
}
  
  handleCancel = e => {
    this.setState({
      visible: false,
      selected_spaces:this.state.previousValues
  });
  };
onChangeSpaces = (event,data) => {
    
    
    this.setState({
        config_spaces: event,
    //   spaces:
    
    });
  };

  deleteChannelConfiguration = (channel_id, name) => {
    const channelFound = this.props.channels.find(channel => channel.id === channel_id)
    let isGridSharedChannel = false
    if (channelFound && channelFound.enterprise_id && channelFound.is_org_shared) isGridSharedChannel = true
      this.props.deleteConfluenceChannelConfig(this.props.match.params.wId,channel_id,this.props.match.params.skill_id,isGridSharedChannel).then(res => {
        if(res&&res.data&&res.data.success){
          message.success(`#${name} configurations deleted successfully`)
          this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=channel_preferences`)

          } else {
          message.error(`Error deleting #${name} configurations.`)
        }
      })
     
  }

  handleDeleteConfiguration = (data) => {
    const { channel_configs, user_now, isWorkspaceAdmin } = this.props
    let isChannelAdmin = true
    // const commondataFound = commonChanneldata.find(channelCommonData => channelCommonData.channel.id === data.id)
    // console.log("commondata found" + commondataFound)
    const confluenceChannelData = channel_configs.find((channeldata) => channeldata.channel.id === data.id)
    if (confluenceChannelData && "restrict_channel_config" in confluenceChannelData && confluenceChannelData.restrict_channel_config) {
      const userFound = confluenceChannelData && confluenceChannelData.channel_admins && confluenceChannelData.channel_admins.find(user => user.toString() === user_now._id.toString())
      if (userFound) isChannelAdmin = true
      else isChannelAdmin = false
    } else {
      isChannelAdmin = true;
    }

    if (isChannelAdmin || isWorkspaceAdmin) {
      return Modal.confirm({
        title: `Are you sure you want to delete channel configuration for this channel`,
        okText: 'Delete',
        okType: 'danger',
        onOk: () => this.deleteChannelConfiguration(data.id, data.name)
      }) 
    } else {
     return  message.warning(`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames(confluenceChannelData)}`)
    }
  }

  addSpace=(val)=>{
// console.log("hello",this.state.selected_spaces,val)
// let config_spaces=this.state.config_spaces
let selected_spaces=this.state.selected_spaces
let exits=this.state.selected_spaces.find(space=>space.id==val)
if(!exits){

//  console.log(this.props.spaces)
    let space=this.props.spaces.find(space=>space.id==val)
   
    selected_spaces.push(space)
    // console.log(config_spaces)
    this.setState({   selected_spaces})

}else{
    this.setState({  selected_spaces:selected_spaces.filter(space=>space.id!=val)})



}
    // selected_spaces

  }
  getAdminNames = () => {
    const { members,config } = this.props;
   
    let adiminNames = "";
    if (config&&config.channel_admins) {
      config.channel_admins.forEach((id, index) => {
        if (index < 3) {
          const user = members && members.find((mem) => mem.user_id._id == id);
          if (user) adiminNames = adiminNames + `${user.user_id.displayName || user.user_id.name} `;
        }
      });

      if (config&&config.channel_admins&&config.channel_admins.length > 3) {
        adiminNames = adiminNames + ` and ${config.channel_admins.length - 3} others`;
      }
    }

    return adiminNames;
  };
  


  

 
  removeSpace=(val)=>{

let  selected_spaces=this.state.selected_spaces.filter(space=>space.id!=val)
    this.setState({  selected_spaces: selected_spaces})
  }

    render() {
      const {spaces,isWorkspaceAdmin,config}=this.props
      const {selected_spaces}=this.state
      // console.log(config.channel)

      
  const connectedSpacesText=(selected_spaces&&selected_spaces.length>0)?selected_spaces.reduce((previousValue,currentValue)=>{
if(previousValue){
  return previousValue+","+currentValue.name
}
else{
  return currentValue.name
}
},""):"All Spaces"
      return (<>
          
          <Content
          className="site-layout-background"
          style={{ padding: '16px 16px 32px 16px', overflow: 'initial' }}
        >
        <>
                  {/* <Alert
                    // description="Troopr is not invited to this channel. Features like Notifications, Reports, etc. will not work until Troopr is added. Use /invite @Troopr Assistant to invite Troopr to this channel."
                    message='Make sure Troopr is invited to this channel otherwise Confluence features will not work until Troopr is added. Use /invite @Troopr Assistant to invite Troopr to this channel.'
                    type='warning'
                    showIcon
                    style={{ width: "calc(100% - 16px)", maxWidth: 984 }}
                  /> */}
                  {this.state.restrictAccess&&<Alert
                    // description="Troopr is not invited to this channel. Features like Notifications, Reports, etc. will not work until Troopr is added. Use /invite @Troopr Assistant to invite Troopr to this channel."
                    message={this.showErrorMessage()||"Channel access restricted."}
                    type='warning'
                    showIcon
                    style={{ width: "calc(100% - 16px)", maxWidth: 984 }}
                  />}
                  <br />
          </>
          <Row style={{ width: '100%', maxWidth: 1000 }} gutter={[16, 16]}>
            <Col span={12} style={{ display: 'flex' }}>
              <Card
                title="Confluence Spaces"
                style={{ width: '100%' }}
                size="small"
                extra={<Button disabled={this.state.restrictAccess} onClick={this.openSettingModal}>Manage</Button>}
                loading = {this.state.configLoading}
              >
                <Text type="secondary">
                  Configure Confluence spaces for this channel. Articles from
                  the configured spaces will be looked up for suggestions for
                  requests made in this channel.
                </Text>
                <br />
                <br />
                <Text bold>
        Connected Spaces: <Text type="secondary">{connectedSpacesText}</Text>{' '}
                </Text>
        
                <br />
                <br />
              </Card>
            </Col>
        
            <Col span={12} style={{ display: 'flex' }}>
              <Card
                title="Matching Options"
                style={{ width: '100%' }}
                size="small"
                loading = {this.state.configLoading}
              >
                <Text type="secondary">
                  Tune the Confluence search behaviour in this channel.
                </Text>
                <br />
                <br />
                <Title level={5}>Matching Type</Title>
                <Text type="secondary">
                  Use loose matching to find articles where any of the keywords
                  or phrases in the message match or use tight matching type to
                  match articles only when all keywords or phrases match.
                </Text>
                <br />
                <Radio.Group
                  options={matching_type_options}
                  disabled={this.state.restrictAccess}
                  onChange={(event)=>{
                   let value=event.target.value;
                
                    this.setState({isKeywordSearchActive:value==="loose"?true:false},this.updateConfiguration)}}
                  value={this.state.isKeywordSearchActive?"loose":"tight"}
                  optionType="button"
                  buttonStyle="solid"
                />
        
                <br />
                <br />
                <Title level={5}>Matching Scope</Title>
                <Text type="secondary">
                  Confluence pages will be found based on matches found in
                  selected fields of the page.
                </Text>
                <br />
                <Radio.Group
                  options={matching_scope_options}
                  disabled={this.state.restrictAccess}
                  onChange={(event)=>{
                    let value=event.target.value
                  
                    this.setState({searchContent:value==="all"?true:false},this.updateConfiguration)}}
                  value={this.state.searchContent?"all":"title"}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Card>
            </Col>
            <Col span={24} style={{ display: 'flex' }}>
            
                <ConfluenceAliases restrictAccess={this.state.restrictAccess} channel={this.props.channel}/>  
          
            </Col>
        
            <Col span={12}>
              <Collapse size="small">
                <Collapse.Panel
                  header="Suggest Ticket creation"
                  key="1"
                  size="small"
                  extra={
                    <Switch
                      // size="small"
                      checked={this.state.showCreateButton}
                      // defaultChecked
                      disabled={this.state.restrictAccess}
                      onClick={(checked, event) => {
                        event.stopPropagation();
                        this.setState({showCreateButton:checked},this.updateConfiguration)
                      }}
                    />
                  }
                >
                  <Text type="secondary">
                    Present option to create ticket in Jira Service Management
                    when Confluence suggestions does not resolve the request.
                  </Text>
                </Collapse.Panel>
               
              
              </Collapse>
              <Collapse>
              <Collapse.Panel
                  header="Auto Suggest"
                  key="1"
                  size="small"
                  extra={
                    <Switch
                      // size="small"
                      checked={this.state.auto_suggest}
                      disabled={this.state.restrictAccess}
                      // defaultChecked
                      onClick={(checked, event) => {
                        event.stopPropagation();
                        this.setState({auto_suggest:checked},this.updateConfiguration)}
                      }
                    />
                  }
                >
                  <Text type="secondary">
                    Automatically suggest matching articles for every message in
                    channel.
                  </Text>
                </Collapse.Panel>
              </Collapse>
              <div>
             
                {this.state.config&&this.state.config._id&&<ConfluenceChannelAdmin disabled={this.state.restrictAccess} config={this.state.config} isWorkspaceAdmin={isWorkspaceAdmin} members={this.props.members} />}
              </div>
            </Col>
          </Row>
          <Button type="primary" danger style={{marginLeft:'auto',paddingRight:'8px',marginTop:'15px',marginRight:'7px'}} onClick={() => this.handleDeleteConfiguration(config.channel)}>Delete Channel Configuration</Button>      
        </Content>
        <Modal maskClosable={false} title="Spaces" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} okText={"Submit"}        confirmloading={this.state.loading}>
  
  <b>Select spaces</b>
  <Select
        mode="multiple"
     placeholder="Select a value"
                    style={{ width: "100%" }}
                    value={this.state.config_spaces}
                    // defaultValue={this.state.fieldSelectedCompact && this.state.fieldSelectedCompact.field.name}
                  //   onChange={this.onChangeSpaces}
                  // placeholder="Select Spaces"
                  optionFilterProp="children"
                  // labelInValue={true}
                  showSearch={true}
                     onChange={(value,data)=>this.onChangeSpaces(value,data,"labels")}
                    onSelect={this.addSpace}
      
                    onDeselect={this.removeSpace}
             
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {spaces.map(space => {
                      //   console.log(space.key)
                      return <Option key={space.key} value={space.id}>{space.name}</Option>
                    })}
                  </Select>
                  <br/>
                  <br/>
  
  </Modal>
              </>
        
        )
    }
}


const mapStateToProps = state => {
 

    return {
        config: state.skills.confluence_channel_config,
      spaces:state.skills.confluence_spaces,
      isWorkspaceAdmin: state.common_reducer.isAdmin,
      members: state.skills.members,
      user_now: state.common_reducer.user,
      channels: state.skills.channels,
      commonChanneldata: state.skills.commonChanneldata,
      channel_configs: state.skills.confluence_channel_configs,
    }
  };
  
  export default withRouter(connect(mapStateToProps, {
    getConfluenceSpaces ,getConfluenceChannelConfig,addConfluenceChannelConfig, deleteConfluenceChannelConfig
  })(ConfluenceCard));  
    





