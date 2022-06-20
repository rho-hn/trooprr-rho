import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import { connect } from "react-redux";
import queryString from "query-string";

import "./task_item.css";
import "./common.css"
// import "react-toastify/dist/ReactToastify.css";

import {getTag} from "./tags/TagAction";
import {
    // setFilterSidebarValue,
    // clearFilters,
    // setTagValue,
    // setUnassigned,
    // setMembers,
    // searchForTags
    setSquadFilter
} from "../sidebar/filter_sidebar_actions";
import { getProject, 
  // updateProjectFilterValue 
} from '../projectActions.js';
import { PlusOutlined, TagOutlined, UserOutlined, CloseOutlined, CloseCircleOutlined} from '@ant-design/icons';
import { 
  Button, 
  Divider, 
  Input, 
  Dropdown, 
  Tag,
  Tooltip,
  Select, Typography } from 'antd';

const {Option} = Select
const {Title} = Typography
const named_filters = [
  {name:"Assigned to Me", id:"mine"},
  {name:"Followed by Me", id:"mineFollowed"},
  {name:"Unassigned", id:"unassigned"},
  {name:"Overdue", id:"OVER_DUE"},
]

class ProjectFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            filterQuery: "",
            currFilters: [],
            query: '',
            assigneeFilter: false,
            subview: this.props.subview,
            flag: true,
            backlogFilter: { member: [], tag: [] },
            filterSearchOptions:[],
            filterSelectValues: [],
        }
    }

    componentDidMount() {
      //load current filters
      let filterSelectValues = []
      this.props.filterItems && this.props.filterItems.map(item => {
        filterSelectValues.push({
          key:item.value.id,
          label:item.type+":"+item.value.name,
          value:item.value.id
        })
      })
      this.setState({filterSelectValues})    
    }

    // fetchUrlFilters = (params) => {

    //   const filter = params.filter;
    //   const sort = params.sort;
    //   const member = params.member;
    //   const filter_array = [
    //     "Incomplete Tasks",
    //     "Complete Tasks",
    //     "All Tasks",
    //     "OVER_DUE"
    //   ];
    //   const sort_array = ["None", "Alphabetic", "Due Date", "Assignee"];
    //   if (member === "UA") {
    //     this.props.setUnassigned();
    //   }
  
    //   if (filter_array.indexOf(filter) != -1) {
    //     this.props.setFilterSidebarValue(filter);
    //   }
    // }

    componentDidUpdate(prevProps) {
      if(this.props.subview !== prevProps.subview){
        // console.log("componentDidUpdate clearing filters")
        this.setState({ currFilters: [], filterSearchOptions:[]});
      } 
      if (this.props.filterItems !== prevProps.filterItems){
        //load current filters
        let filterSelectValues = []
        this.props.filterItems && this.props.filterItems.map(item => {
          filterSelectValues.push({
            key:item.value.id,
            label:item.type+":"+item.value.name,
            value:item.value.id
          })
        })

        // console.log("mounting filterSelectValues:",filterSelectValues)
        this.setState({filterSelectValues})  
      }

      //to remove deleted task
      if((this.props.tasks !== prevProps.tasks) || (this.props.inActiveTasks !== prevProps.inActiveTasks)){
        // load current filters
        let filterSelectValues = []
        let allTasks = []
        this.props.filterItems && this.props.filterItems.map(item => {
          filterSelectValues.push({
            key:item.value.id,
            label:item.type+":"+item.value.name,
            value:item.value.id
          })
        })
        //get all tasks in one array
        this.props.statuses&&this.props.statuses.forEach(status => {
          this.props.tasks[status._id]&&this.props.tasks[status._id].forEach(task => {
            allTasks.push(task)

          })
        })

        //if any deleted task present in filters, remove
        filterSelectValues.forEach((filterValue, index)=> {
          let label = filterValue.label.split(':')
          if(label[0] == 'task'){
            let available = allTasks.findIndex(task => task._id == filterValue.key)
            if(available == -1){
              filterSelectValues.splice(index,1);
            }
          }
        })
        this.handleChange(filterSelectValues)
      }

    }

    onFilterItemsClear() {
      this.setState({ currFilters: [], filterSearchOptions:[], filterSelectValues:[]});
      this.storeSquadFilter([])
    }

    _handleUrlQuery(query, value) {
        let final_str = "?";
        if (window.location.search != "") {
            let url = window.location.search.substr(1);
            let url_arr = url.split("&");
            let has_query;
            for (let i in url_arr) {
                let split_query = url_arr[i].split("=");
                if (split_query[0] == query && query !== "tags" && query !== "member") {
                    split_query[1] = value;
                    has_query = true;
                }
                if (i == url_arr.length - 1) {
                    final_str = final_str + `${split_query[0]}=${split_query[1]}`;
                } else {
                    final_str = final_str + `${split_query[0]}=${split_query[1]}&`;
                }
            }
            if (!has_query) {
                final_str = `${window.location.search}&${query}=${value}`;
            }
        } else {
            final_str = `${final_str}${query}=${value}`;
        }
        return final_str;
    }

    _handleRemoveUrlQuery(query, value) {
        let final_str = "?";
        let final_params = "";
        if (window.location.search != "") {
            let url = window.location.search.substr(1);
            let url_arr = url.split("&");
            let temp_query = [];
            let filteredQuery;
            if (query === "member") {
                filteredQuery = url_arr.filter(item => item.split("=")[1] !== value);
            } else if (query === "tags") {
                filteredQuery = url_arr.filter(
                    item => item.split("=")[1].replace(/%20/g, " ") !== value
                );
            }

            temp_query = filteredQuery;
            if (filteredQuery.length > 1) {
                final_params = filteredQuery.join("&");
            } else {
                final_params = filteredQuery.join();
            }
            if (temp_query.length === 0) {
                final_str = `${final_params}`;
            } else {
                final_str = `${final_str}${final_params}`;
            }
            return final_str;
        }
    }

    selectDropdownVisible = () => {
      this.setState({ selectDropdownOpen: !this.state.selectDropdownOpen, filterSearchOptions: [] })
    }

    // toggleAssigneeFilter(value) {
    //   // console.log("toggleAssigneeFilter value:",value)
    //   this.toggleFilter({type:"assignee",value})
    // }

    // toggleNamedFilter(value) {
    //   // console.log("toggleNamedFilter value:",value)
    //   if(value.id==="mine") {
    //     this.toggleAssigneeFilter({name:this.props.user.name,id:this.props.user._id})
    //   }else {
    //     this.toggleFilter({type:"named_filter",value})
    //   }
    // }

    // toggleLabelFilter(value) {
    //   // console.log("toggleLabelFilter value:",value)
    //   this.toggleFilter({type:"label",value})
    // }

    storeSquadFilter(filter) {
      this.props.setSquadFilter(filter, this.props.match.params.pId  + ((this.props.subview === "active")?"":"__p"))
    }

    // toggleFilter(filterItem){      
    //   let {filterItems:fltr, setSquadFilter} = this.props
    //   // console.log("this.props.filter:",JSON.stringify(fltr))
    //   if(Array.isArray(fltr)){
    //     let idx = fltr.findIndex(fI => (fI.type===filterItem.type && fI.value.id===filterItem.value.id))
    //     if(idx === -1) 
    //       this.storeSquadFilter(fltr.concat([filterItem]))
    //     else {
    //       let arrayWithoutFilterItem = fltr.slice(0)
    //       arrayWithoutFilterItem.splice(idx, 1)
    //       this.storeSquadFilter(arrayWithoutFilterItem)
    //     }
    //   }else {
    //     this.storeSquadFilter([filterItem])
    //   } 
    // }

    getAssigneeOptions = filter =>{
      if(this.props.workspaceMembers) {
        let filteredMembers = filter? this.props.workspaceMembers.filter(mem => (mem.user_id.displayName||mem.user_id.name).toLowerCase().includes(filter.toLowerCase())):this.props.workspaceMembers
        return filteredMembers.map(mem => {
          return {label:"assignee:"+(mem.user_id.displayName||mem.user_id.name), value:mem.user_id._id}
        })
      } else return []
    }

    getFollowerOptions = filter => {
      // console.log('filter',filter);
      if(this.props.workspaceMembers) {
        let filteredMembers = filter? this.props.workspaceMembers.filter(mem => (mem.user_id.displayName||mem.user_id.name).toLowerCase().includes(filter.toLowerCase())):this.props.workspaceMembers
        return filteredMembers.map(mem => {
          // to differenciate "assignee" and "follower" values for "Select", we are adding ':follower' at the end 
          return {label:"follower:"+(mem.user_id.displayName||mem.user_id.name), value:mem.user_id._id+ ":follower"}
        })
      } else return []
    }

    getLabelOptions = filter =>{
      if(this.props.tags) {
        let filteredTags = filter? this.props.tags.filter(tag => tag.name.toLowerCase().includes(filter.toLowerCase())):this.props.tags
        return filteredTags.map(tag => {
          return {label:"label:"+tag.name, value:tag._id}
        })
      } else return []
    }

    getTaskOptions = filter =>{
      let tasks = (this.props.subview === "active") ? this.props.tasks: this.props.inActiveTasks
      // console.log("this.props.subview", this.props.subview)
      // console.log("Object.keys(tasks)", Object.keys(tasks))
      // let allTasks = []
      let allTasks = []
      Object.keys(tasks).forEach(key => {
        let secTasks = tasks[key]
        // console.log("found sec tasks", secTasks.length)
        // allTasks = [...allTasks, ...secTasks]
        allTasks = allTasks.concat(secTasks)
      })
      // allTasks = allTasks.map(t=>({name:t.name,key:t.key}))
      if(this.props.tags) {
        let filteredTasks = filter? allTasks.filter(task => {
          let nameMatch = task.name && task.name.toLowerCase().includes(filter.toLowerCase()) 
          let keyMatch = task.key && task.key.toLowerCase().includes(filter.toLowerCase())
          return nameMatch || keyMatch
        }):allTasks        
        filteredTasks =  filteredTasks.map(task => {
          return {label:"task:"+task.key+" "+task.name, value:task._id}
        })
        return filteredTasks
      } else return []
    }

    getKeyWordOPtions = filter => {
      let tasks = (this.props.subview === "active") ? this.props.tasks: this.props.inActiveTasks
      let allTasks = []

      Object.keys(tasks).forEach(key => {
        let secTasks = tasks[key]
        // console.log("found sec tasks", secTasks.length)
        // allTasks = [...allTasks, ...secTasks]
        allTasks = allTasks.concat(secTasks)
        
      })
      if(this.props.tags) {
        let filteredTasks = filter? allTasks.filter(task => {
          let keyWordMatch = task.name && task.name.toLowerCase().includes(filter.toLowerCase())
          return keyWordMatch
        }):allTasks

        let keyWord
        if(filteredTasks.length > 1){
          return {label:"keyword:"+filter, value:filter}
        }else return []
      } else return []
    }

    searchChange = q => {
      let qSplit = q.split(':')
      let filterSearchOptions = []

      if(q && q.length>1) {
        if  (qSplit.length === 1){
          filterSearchOptions = filterSearchOptions.concat(this.getKeyWordOPtions(q))
        }  
        if (qSplit[0] == 'assignee' || qSplit.length===1) {
          filterSearchOptions = filterSearchOptions.concat(this.getAssigneeOptions(qSplit.length===1?q:qSplit[1]))
        } 
        if (qSplit[0] == 'label' || qSplit.length===1) {
          filterSearchOptions = filterSearchOptions.concat(this.getLabelOptions(qSplit.length===1?q:qSplit[1]))
        }
        if (qSplit[0] == 'task' || qSplit.length===1) {
          filterSearchOptions = filterSearchOptions.concat(this.getTaskOptions(qSplit.length===1?q:qSplit[1]))
        }
        if (qSplit[0] == 'follower' || qSplit.length===1) {
          filterSearchOptions = filterSearchOptions.concat(this.getFollowerOptions(qSplit.length===1?q:qSplit[1]))
        }
      }
      // console.log("setting filterSearchOptions:",JSON.stringify(filterSearchOptions))
      this.setState({filterSearchOptions})
    }

    onFilterItemClear = (filterItem) => {
      if(this.props.filterItems){
        let idx = this.props.filterItems.findIndex(fI => fI.type===filterItem.type && fI.value.id===filterItem.value.id)
        
        if (idx!== -1) {
          let arrayWithoutFilterItem = this.props.filterItems.slice(0)
          arrayWithoutFilterItem.splice(idx, 1)
          this.storeSquadFilter(arrayWithoutFilterItem)
        }
      }
    }
    
    truncTag = t => t.length > 10 ? `${t.substring(0, 8)}..` : t

  filterSearch_dropdown = menu => (
    // this.state.filterSearchOptions.length>1?<Fragment>{menu}</Fragment>:
    <Fragment>
      {named_filters.map(named_filter =>
        <Button type="link" onClick={(e) => {
            this.toggleNamedFilter({ name: named_filter.name, id: named_filter.id })
            this.dropdownVisible()
          }}
          style={{color:(localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.65)":"rgba(0, 0, 0, 0.65)")}}
        >{named_filter.name}</Button>
      )}
      <Divider style={{ marginTop: 4, marginBottom: 4 }}/>
      <Button type="link" onClick={e => this.searchChange("assignee:")} style={{color:(localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.65)":"rgba(0, 0, 0, 0.65)") }}>
        Tasks by assignee
      </Button>
      <Button type="link" onClick={e => this.searchChange("label:")} style={{color:(localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.65)":"rgba(0, 0, 0, 0.65)")}}>
        Tasks by labels
      </Button>
      <Button type="link" onClick={e => this.searchChange("follower:")} style={{color:(localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.65)":"rgba(0, 0, 0, 0.65)")}}>
        Tasks by followers
      </Button>
      <Divider style={{ marginTop: 4, marginBottom: 4 }}/>
      {menu}
    </Fragment>
  )
    
  toggleSelect = value => {
    // console.log("toggleSelect value:", value)
    // let vsplit = value.label.split(":")
    // if(vsplit[0]==="assignee")
    //   this.toggleAssigneeFilter({name:vsplit[1],id:value.key})
    // else if (value.label.split(":")[0]==="label"){
    //   this.toggleLabelFilter({name:vsplit[1],id:value.key})
    // }
  }

  handleChange = values => {
    // this.setState({filterSelectValues:values})
    //transform and store
    let storeFilters = []
    values.forEach(value => {
      let vsplit = value.label.split(":")
      storeFilters.push({type:vsplit[0],value:{name:vsplit[1],id:value.key}})
    })
    // console.log("storing..",storeFilters)
    this.storeSquadFilter(storeFilters)
  }

  toggleNamedFilter(value) {
    // console.log("toggleNamedFilter value:",value)
    if(value.id==="mine") {
      this.toggleAssigneeFilter({name:(this.props.user.displayName || this.props.user.name),id:this.props.user._id})
    }else if (value.id === "mineFollowed"){
      this.toggleFollowerFilter({name:(this.props.user.displayName||this.props.user.name),id:this.props.user._id+":follower"})
    }
    else {
      this.toggleFilter({type:"named_filter",value})
    }
  }

  toggleAssigneeFilter(value) {
    // console.log("toggleAssigneeFilter value:",value)
    this.toggleFilter({type:"assignee",value})
  }
  toggleFollowerFilter(value) {
    this.toggleFilter({type:"follower",value})
  }

  toggleFilter(filterItem){      
    let {filterItems:fltr, setSquadFilter} = this.props
    // console.log("this.props.filter:",JSON.stringify(fltr))
    if(Array.isArray(fltr)){
      let idx = fltr.findIndex(fI => (fI.type===filterItem.type && fI.value.id===filterItem.value.id))
      if(idx === -1) 
        this.storeSquadFilter(fltr.concat([filterItem]))
      else {
        let arrayWithoutFilterItem = fltr.slice(0)
        arrayWithoutFilterItem.splice(idx, 1)
        this.storeSquadFilter(arrayWithoutFilterItem)
      }
    }else {
      this.storeSquadFilter([filterItem])
    } 
  }

  dropdownVisible = () => {
    this.setState({ selectDropdownOpen:!this.state.selectDropdownOpen, dropdownOpen: !this.state.dropdownOpen, filterSearchOptions:[] })
  }
    render() {
        let currentUser, currentUserId = this.props.user._id;
        currentUser = this.props.workspaceMembers.find(ele => ele.user_id._id === currentUserId)

        return (
            <Fragment >
                <Dropdown
                    visible={this.state.dropdownOpen}
                    onVisibleChange={this.dropdownVisible}
                    trigger={["click"]}
                    overlay={
                        <div
                            class="ant-dropdown-menu"
                            style={{
                                // padding: 8,
                                background: localStorage.getItem('theme') == 'default' &&"white",
                                width: "550px",
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                        <div style={{display: "flex", justifyContent: "space-between",padding: "8px 8px 0px"}}>
                        <Title style={{textAlign:"center"}} level={4}>Search and Filter Tasks</Title>                        
                        <Button type="link" icon={<CloseOutlined />} onClick={e=>this.dropdownVisible()}>
                          Close
                        </Button>
                        </div>
                            <div style={{width:"100%", padding:"0px 8px"}}>
                            <Select
                              // showSearch
                              // bordered={false}
                              // autoFocus
                              ref={input => input && input.focus()}
                              defaultOpen={true}
                              // open={this.state.selectDropdownOpen}
                              mode="multiple"
                              labelInValue
                              style={{ width: "100%"}}
                              placeholder="start typing or select from options below"
                              dropdownRender={menu=>this.filterSearch_dropdown(menu)}
                              value={this.state.filterSelectValues}
                              onSearch={this.searchChange}
                              filterOption={false}
                              onSelect={this.toggleSelect}
                              onDeselect={this.toggleSelect}
                              onChange={this.handleChange}
                              // notFoundContent={null}
                              // options={this.state.filterSearchOptions.map(item => {
                              //   console.log("rendering option:",item)
                              //   return (<Option key={item.value}>{item.label}</Option>)
                              // })}
                              >
                                {this.state.filterSearchOptions.map(item => <Option key={item.value}>{item.label}</Option>)}
                                </Select>
                                </div>
                        </div>
                    }

                >
                <Fragment>
                    <Button style={{marginRight:4}} size="small" /*icon={<PlusOutlined />}*/ onClick={this.dropdownVisible}>
                    {(this.props.filterItems && this.props.filterItems.length > 0) ? `${this.props.filterItems.length} Filter(s)`:"Add Filter"}
            </Button>
            {(this.props.filterItems && this.props.filterItems.length > 0) &&
                <Button
                style={{marginRight:8}}
                  size="small"
                  type="primary" 
                  // shape="circle" 
                  icon={<CloseCircleOutlined />}
                  onClick={e=>{this.onFilterItemsClear()}}
                >Clear All
                  {/* {this.props.filterItems && this.props.filterItems.length == 1 ? "Clear Filter" : "Clear Filters"} */}
                </Button>}
            {/* <Dropdown.Button overlay={menu} placement="bottomCenter" icon={<UserOutlined />}>
      Add Filter
    </Dropdown.Button> */}
    </Fragment>
                </Dropdown>
                
                {/* {this.showCurrentFilters()} */}
                {/* {this.props.filterItems && this.props.filterItems.map(item => {
                  return (
                      <Tag closable
                        key={item.value.id}
                        onClose={(e) => this.onFilterItemClear(item)}
                      >
                        {this.truncTag(item.value.name)}
                      </Tag>)
                })}                   */}
                
            </Fragment>
        );
    }
}

function mapStateToProps(store, ownProps) {
  // console.log("ownProps:",JSON.stringify(ownProps))
    return {
      user: store.common_reducer.user,
      project: store.projects.project,
      projects: store.skills.projects,
      workspaceMembers: store.skills.members,
      tags: store.tags.tags,
      tasks: store.task.tasks,
      inActiveTasks: store.task.backlogTasks,
      filterItems: store.filterSidebarValue.filterItems[ownProps.match.params.pId  + ((ownProps.subview === "active")?"":"__p")],
      statuses: store.statuses
    }
}

export default withRouter(connect(
    mapStateToProps,
    {
        // setTagValue,
        // setFilterSidebarValue,
        // clearFilters,
        // setUnassigned,
        // updateProjectFilterValue,
        // setMembers,
        // searchForTags,
        // getProject,
        // getTag
        setSquadFilter
    }
)(ProjectFilter));
