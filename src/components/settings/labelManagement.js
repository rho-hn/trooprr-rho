import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

import {
  DownOutlined,
} from '@ant-design/icons';

import {
  PageHeader,
  List,
  Layout,
  Card,
  Tag,
  Typography,
  Modal,
  message,
  Input,
  Row,
  Col,
  Radio
} from "antd";

import LabelModal from "./labelModal"
import { getTag, updateTag, deleteTag } from "../project/tasks/tags/TagAction";

const {Text} = Typography
const { Search } = Input;

class LabelManager extends Component {

  constructor(props) {
    super();
    this.state = {
      loading: false,
      labelModalVisible: false,
      filter:'name',
      searchValue:'',
      tags:[]
    }
  }

  componentDidMount = () =>{
    const {match:{params:{wId}}, tags, getTag} = this.props
    if(!tags || tags.length===0){
      this.setState({loading:true})
      getTag(wId).then(res=>{
        if(res.data.success){
            this.setState({loading:false,tags:res.data.tags},() => this.onFilterChange({target:{value : this.state.filter}}));
          }
        })
        }else{
          this.setState({tags},() => this.onFilterChange({target:{value : this.state.filter}}))
        }
      }

  componentDidUpdate (prevProps) {
    if(prevProps.tags != this.props.tags){
      this.onSearchChange({target:{value : this.state.searchValue}})
      this.onFilterChange({target:{value : this.state.filter}})
    }
  }

  onUpdate = (newValues, oldLabel) => {
    this.setState({labelModalVisible:false, currentLabel:null})
    // console.log("updated label fields..", newValues)
    // console.log("old label..",oldLabel)
    if((newValues.name !== oldLabel.name) || (newValues.color !== oldLabel.color)) {
      let newLabel = {
        ...oldLabel,
        name: newValues.name,
        color: newValues.color,
      }
      this.props.updateTag(newLabel._id, newLabel).then(res => {
        message.success("Label updated")
      })
    }
  }

  onDelete = (oldLabel) => {    
    this.setState({labelModalVisible:false, currentLabel:null})
    // console.log("will delete label :", oldLabel._id)
    Modal.confirm({
      title: `Are you sure you want to delete this Label ${oldLabel.name}?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: ()=>this.props.deleteTag(oldLabel._id).then(res => message.success("Label deleted")),
      okType: 'danger',
    })
    // this.props.deleteTag(oldLabel._id)
  }

  onFilterChange = (e) => {
    this.setState({filter:e.target.value});
    if(e.target.value == 'name')
    this.state.tags.sort(this.dynamicSort('name'));
    else {
      this.state.tags.sort(
        (item1, item2) =>
          new Date(item1.created_at) - new Date(item2.created_at)
      );
    }
  }

  //https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
  dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

  onSearchChange = (e) => {
    const {tags} = this.props
    this.setState({searchValue:e.target.value})
    let tempTags = [];
    if(tags.length > 0){
      tempTags = tags.filter(tag => tag.name.toLowerCase().includes(e.target.value))
    }
    this.setState({tags:tempTags},() => {
      this.onFilterChange({target:{value : this.state.filter}})
    })
  }

  render() {
    const {tags} = this.state
    // let tags = this.props.tags.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    return (
      <Layout
      style={{ marginLeft: 0,
         height: "100vh" }}
      >
      <Fragment >
        <PageHeader title="Workspace Labels" extra={
          <>
            <Row>
             <Col>
             <Radio.Group onChange={this.onFilterChange} value={this.state.filter} style={{marginTop:'5px'}}>
              <Radio value={'name'}>Sort by Name</Radio>
              <Radio value={'date'}>Sort by Date</Radio>
            </Radio.Group>
           </Col>
           <Col>
           <Search 
           onChange={e => this.onSearchChange(e)}
           placeholder="search Labels"
          size='medium'
          allowClear
           autoFocus
           />
           </Col>
           </Row>
          </>
        } />
        <Layout style={{ maxHeight:"100vh", overflowY:"scroll", padding: "16px 16px 80px 16px", 
        // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
         }} >
          <div 
            // style={{ marginTop:'40px' }}
          >
            <List
              loading={this.state.loading}
              grid={{ gutter: 16, column: 6 }}
              dataSource={tags}
              renderItem={item => (
                <List.Item>
                  <Card hoverable size="small" onClick={e=>this.setState({currentLabel:item, labelModalVisible:true})} title={<Tag color={item.color}>{item.name}</Tag>}>
                    <div><Text style={{fontSize:"10px"}} type="secondary">Created {moment(item.created_at).fromNow()}</Text></div>
                    <div><Text style={{fontSize:"10px"}}>Created by {item.created_by && item.created_by.displayName ? item.created_by.displayName : item.created_by.name ? item.created_by.name : '' }</Text></div>
                  </Card>
                </List.Item>
              )}
            />
            <LabelModal
              visible={this.state.labelModalVisible}
              currentLabel={this.state.currentLabel}
              onUpdate={this.onUpdate}
              onDelete={this.onDelete}
              onCancel={() => this.setState({labelModalVisible:false, currentLabel:null})}
            />
          </div>
        </Layout>        
      </Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = store => {
  return {
    // user_now: store.common_reducer.user,
    tags: store.tags.tags,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getTag,
    updateTag,
    deleteTag
  })(LabelManager)
)