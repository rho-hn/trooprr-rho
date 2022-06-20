import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Table, Tag, Space ,Menu, Dropdown,Popconfirm,Modal ,Typography,Button,Card,message} from 'antd';
import Highlighter from 'react-highlight-words';

import { editAlias,removeAlias,createAlias,getAliases } from './alias_action';
import {  MoreOutlined,SearchOutlined } from '@ant-design/icons';

import moment from "moment";
import "./alias_main.css"
import { Input } from 'antd';
const { Column, ColumnGroup } = Table;
const { Text, Title } = Typography;





class ConfluecneAliases extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
name:"",
alias:"",
    currentAlias:{},
    isUpdate:false
        }
      }
    openModal=(isUpdate)=>{
this.setState({ visible:true ,isUpdate:isUpdate})


    }
    componentDidMount(){

      this.setState({loading : true})
      this.props.getAliases(this.props.match.params.wId,this.props.channel.id).then(res => {
        if(res.data.success) this.setState({loading : false})
      })
    }
    handleCancel=()=>{

      this.setState({ currentAlias:{},isUpdate:false,name:"",alias:"",visible:false})
    }
   updateModal(record){

    this.setState({ currentAlias:record,name:record.name,alias:record.alias},
      this.openModal(true)
      )

   }
   handleOk=()=>{
let data={name:this.state.name,alias:this.state.alias}
let wId=this.props.match.params.wId
if(this.state.isUpdate){
this.props.editAlias(wId,this.state.currentAlias._id,data).then(res=>{

  this.handleCancel()


})
}else{
data.workspace_id=wId
data.channel=this.props.channel
data.skill_id=this.props.match.params.skill_id
this.props.createAlias(wId,data).then(res=>{

  this.handleCancel()


})
}

   }


      getMenu=(record)=>{


let enableText=record.enabled?"Disable":"Enable"
        let  menu = (
          <Menu>
            <Menu.Item onClick={()=>this.updateModal(record)}>
             Edit
            </Menu.Item>
          <Menu.Item >

          <Popconfirm
    title={<div style={{wordBreak:"break-all"}}>Are you sure you want to <b>{enableText.toLowerCase()}</b> <i>{record.name}</i> ?</div>}
    onConfirm={()=>this.props.editAlias(record.workspace_id,record._id,{enabled:!record.enabled})}

    okText="Yes"
    cancelText="No"
  >
{enableText}
  </Popconfirm>
      
            </Menu.Item>
           <Menu.Item   >
            
           <Popconfirm
    title={<div style={{wordBreak:"break-all"}}>Are you sure you want to <b>delete</b> <i>{record.name}</i> ?</div>}
    onConfirm={()=>this.props.removeAlias(record.workspace_id,record._id).then(res=>{  message.success('Alias deleted successfully.');})}

    okText="Yes"
    cancelText="No"
  >
Delete
  </Popconfirm>

            </Menu.Item>
            
          </Menu>
        );
return menu

      }

      getCreator=(id)=>{



        let isCreator=this.props.members.find(m=>{
          if(m.user_id &&m.user_id._id){
           return  id===m.user_id._id
        
          }else if(m.user_id){
            return  id===m.user_id
        
          }
         })
         let creator=isCreator?isCreator.slackInfo?isCreator.slackInfo.displayName||isCreator.slackInfo.name:isCreator.user_id.name?isCreator.user_id.name:"Unknown User":"Unknown User"
         return creator
 
      }

      onChange=(e)=>{
this.setState({[e.target.name]:e.target.value}
)
      }


//search

getColumnSearchProps = dataIndex => (
  

  {
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={node => {
          this.searchInput = node;
        }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
    
      </Space>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>{

    if( dataIndex=="created_by"){
      // console.log(record)
let creator= this.getCreator(record[dataIndex])
return creator?creator.toString().toLowerCase().includes(value.toLowerCase()):""
    }else{
    return   record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : ''
    }
    },
  
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => this.searchInput.select(), 100);
    }
  },
  render: (text) =>{
    if(dataIndex=="created_by"){
      text=this.getCreator(text)
    }
   return (this.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ))},
});

handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  this.setState({
    searchText: selectedKeys[0],
    searchedColumn: dataIndex,
  });
};

handleReset = clearFilters => {
  clearFilters();
  this.setState({ searchText: '' });
};









      render() {
        const table_columns = [
          {
         
            title: 'Keyword',
            dataIndex: 'name',
            key: "name",
            align: 'center',
            className:"add_breakpoint",
            ...this.getColumnSearchProps("name"),
          
                   
          },
       
        
          { title:"Alias" ,
          dataIndex:"alias",
           key:"alias",
           className:"add_breakpoint",
        ...this.getColumnSearchProps('alias')},
        
       
          {
            title:"Status",
             dataIndex:"enabled",
              key:"enabled" ,
              showSorterTooltip:false,
           
            sorter: (a, b) => (a.enabled ? 'Enabled' : 'Not Enabled').length - (b.enabled ? 'Enabled' : 'Not Enabled').length,
        
            render: (text, record) => {
              
              return  text? <Tag color="green">Enabled</Tag>:<Tag color="red">Disabled</Tag>
            }
          }, 
           {
          
            title: 'Creator',
            dataIndex: 'created_by',
             key: "created_by",
            align: 'center',
            render: (text, record) => {
       

              return  <>{this.getCreator(record.created_by)}     </>
            },

            
           ...this.getColumnSearchProps("created_by")
          },
        
            
         {
            title:"Created At",
             dataIndex:"created_at" ,
             key:"created_at"  ,
             sorter: (a, b) => {
               let d1=new Date(a.created_at).getTime()
               let d2= new Date(b.created_at).getTime()
              if( d1<d2) { return -1; }
              if(d1 > d2) { return 1; }
              return 0;
          },
          defaultSortOrder: 'descend',
          showSorterTooltip:false,
              render:(text) => {

         return  moment(new Date(text)).format('ll')
        
         
           
              }
            },
          {
            title: 'Actions',
            key: "action",
            align: 'center',
        
        
            render:(text, record) => {
            return   <Space size="middle">
                 <Dropdown disabled={this.props.restrictAccess} overlay={this.getMenu(record)}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
         <MoreOutlined />
          </a>
        </Dropdown>
              </Space>
            }
          }
        ];
     
		return(  <Card title="Aliases" style={{ width: '100%' }} size="small" extra={<Button disabled={this.props.restrictAccess}   type="primary" onClick={()=>this.openModal(false)} >Add</Button>}>
    <Text type="secondary">
      Configure aliases to commonly used words so that matches can
      be made broader to includes all aliases.
    </Text>
    <br />
    <br />
      <Table dataSource={this.props.aliases} pagination={{ pageSize: 10 }} columns={table_columns} loading = {this.state.loading}>
      
 
     
   
  
  </Table>

        {this.state.visible && <Modal maskClosable={false} title={this.state.isUpdate?"Update Alias":"Add Alias"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} okText={this.state.isUpdate?"Update":"Add"} >
  <div>
  <b>Keyword</b>
  <Input   name="name" onChange={this.onChange} value={this.state.name}/>
  </div>
<br/>
<div>
<b>Alias</b>
  <Input  name="alias" onChange={this.onChange} value={this.state.alias}/>
 </div>
    </Modal>}
       
</Card>
      );
	}
}


const mapStateToProps = state => ({
 aliases:state.confluecne.aliases,
 members: state.skills.members
});


  export default withRouter(connect( mapStateToProps,{ editAlias,removeAlias,createAlias,getAliases})( ConfluecneAliases)); 
 
