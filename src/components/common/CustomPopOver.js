import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Autosuggest from "react-autosuggest";
// import { PopoverBody, Popover } from "reactstrap";
import { Popover, Button, Input } from "antd"
// import { PlusOutlined } from '@ant-design/icons';

import { updateTask } from "../project/tasks/task/taskActions";
import { connect } from "react-redux";
import { addFollowers, removeFollowers } from '../project/sidebar/sidebarActions';
import FollowersSelectedImg from '../../media/task-sidebar-followers-selected.svg';
import classnames from "classnames";
import markedImg from '../../media/task-sidebar-marked.svg';
import { addTaskMyTag, addTaskTag } from '../project/tasks/tags/TagAction';
// import { setTagValue } from '../project/sidebar/filter_sidebar_actions';
// import MembersSuggestionsContainer from '../project/tasks/list/suggestion_container';
const renderInComponent = inputProps => (
  // <Reference>
  <div className="kanban-assignee-inputContainer">
    <input {...inputProps} />
  </div>
  // </Reference>
);


class CustomPopOver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      suggestions: [],
      input: false,
      name: "",
      addTag: false,
      inputValue: '',
      error: '',
      data: [],
      tagColor: '#de350a',
      valid: true,
      autoOpen: false,
      tagsSearch: '',
      membersSearch: '',
      assigneeList: [],
      customInputFocus: false,
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.toggle = this.toggle.bind(this);
    this._handleAddOrRemoveFollowers = this._handleAddOrRemoveFollowers.bind(this);
    this._handleAddFollowers = this._handleAddFollowers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this._handleCreateTag = this._handleCreateTag.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this._onCreateTag = this._onCreateTag.bind(this);
    this.addingTag = this.addingTag.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this._handleTagList = this._handleTagList.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this._handleRemoveFollower = this._handleRemoveFollower.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    // this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }
  // handleOutsideClick(e) {
  //   // console.log("hello",e.target.className)
  //   this.node = document.getElementsByClassName('custom-popover-body');
  //   this.tagNode = document.getElementsByClassName('custom-popover-body-tag');
  //   //  console.log("hello",this.node,this.tagNode)
  //   if (this.node[0] && this.node[0].contains(e.target) || this.tagNode[0] && this.tagNode[0].contains(e.target) || e.target.className === "tag-popover-create-tag" || e.target.className === "tag-popover-create-tag") {
  //     // console.log("Inside click")
  //   } else {
  //     // console.log("close")


  //     if (this.props.dropdownOpen) {
  //       this.props.toggleDropDown(e)
  //     }

  //   }

  // }
  cancelAddTag = () => {
    this.setState({
      // dropdownOpen:false,
      // suggestions: [],
      // input: false,
      // name: "",
      addTag: false,
      // inputValue: '',
      // error: '',
      // data: [],
      // tagColor: '#de350a',
      // valid: true,
      // autoOpen: false,
      // tagsSearch: '',
      // membersSearch: '',
      // assigneeList: [],
      // customInputFocus: false,
    })
  }
  cancel = () => {
    this.setState({
      dropdownOpen: false,
      suggestions: [],
      input: false,
      name: "",
      addTag: false,
      inputValue: '',
      error: '',
      data: [],
      tagColor: '#de350a',
      valid: true,
      autoOpen: false,
      tagsSearch: '',
      membersSearch: '',
      assigneeList: [],
      customInputFocus: false,
    })
  }

  hide = () => {
    this.setState({ dropdownOpen: false })
  }
  //   componentDidUpdate(){
  //   if(this.props.popoverType === 'tag'){
  //     var forCreateTag = document.getElementsByClassName('sidebar-tag-add-style');
  //     var firstDivForTag = document.createElement('div')
  //     firstDivForTag.setAttribute("class","tags-suggestions-container");
  //     var secondDivForTag = document.createElement('div')
  //     secondDivForTag.textContent = "+ create new tag";
  //     secondDivForTag.setAttribute("class","tag-container-add-button");
  //     var finalDivForTag = firstDivForTag.appendChild(secondDivForTag);
  //     forCreateTag[0].appendChild(finalDivForTag);
  //   }
  // }

  componentDidUpdate(props) {
    // console.log(update)
    // console.log("propproppropproppropprop",props,this.props)
    if (this.state.customInputFocus && !this.nodeTest) {
      this.nodeTest = true
      this.textInput && this.textInput.focus();
    }

    // if(this.props.dropdownOpen && !this.isListner){

    //   document.addEventListener('click', this.handleOutsideClick, false)
    //   this.isListner=true
    // }else if(!this.props.dropdownOpen && this.isListner){
    //   console.log("Closed in ",this.isListner)

    //   document.removeEventListener('click',this.handleOutsideClick,false);
    //   this.isListner=false
    // }


  }

  componentDidMount() {
    // console.log("componentDidMount")
    this.nodeTest = false
    if (this.props.data && this.props.data.tag_id) {
      if (this.props.data.tag_id.length > 0) {
        var _tags = this.props.data.tag_id
        this.setState({ data: _tags });
      }
    }
    // this.isListner = false
    // if (this.props.dropdownOpen) {
    //   this.isListner = true
    //   document.addEventListener('click', this.handleOutsideClick, false)
    // } else {

    // }


  }


  _handleKeyPress(e, filterTags) {
    if (e.key == "Enter" && this.props.members.length > 0) {
      if (this.state.tagsSearch === '') {
        this._handleTagList(this.props.members[0]);
      } else {
        if (filterTags.length > 0) {
          this._handleTagList(filterTags[0]);
        }
      }
    }
  }

  componentWillUnmount() {
    // console.log("hello unmounting")


    // document.removeEventListener('click', this.handleOutsideClick, false);
    // this.isListner = false
    this.setState({ tagsSearch: '', membersSearch: '' });
  }

  addTag(tag, suggestionValue) {
    var tags = this.state.data;
    var newTags = tags.concat([tag]);
    // if (this.props.location) {
    //     // if (this.props.data.status) {
    //         this.props.addTaskMyTag({
    //             "name": tag,
    //             "color": this.state.tagColor,
    //             "owner_id": this.props.match.params.wId,
    //             "task_id": this.props.data._id
    //         }).then(res => {
    //           if(res.data.success){
    //             this.setState({customInputFocus: false, tagsSearch: ''})
    //           }
    //         })
    //     // }
    //     // else {
    //     //     this.props.addTaskMyTag({
    //     //         "name": tag,
    //     //         "color": this.state.tagColor,
    //     //         "owner_id": this.props.data.user_id._id,
    //     //         "task_id": this.props.data._id
    //     //     }).then(res => {
    //     //       if(res.data.success){
    //     //         this.setState({customInputFocus: false, tagsSearch: ''})
    //     //       }
    //     //     })
    //     // }
    // }
    // else {
    this.props.addTaskTag({
      "name": tag,
      "color": this.state.tagColor,
      "owner_id": this.props.match.params.wId,
      "task_id": this.props.data._id
    }).then(res => {
      if (res.data.success) {
        this.setState({ customInputFocus: false, tagsSearch: '' })
      }
    })
    // }
    this.setState({ data: newTags });
  }
  addingTag(name) {
    var tag = name.trim();
    tag = tag.replace(/,/g, '');
    if (!tag) return;
    this.addTag(tag);
    this.setState({ name: '' })
  }


  _handleCreateTag() {
    if (this.state.tagsSearch === '') {
      this.setState({ error: 'Cannot be empty', valid: false })
    } else {
      this.setState({ valid: true, addTag: !this.state.addTag })
      this.addingTag(this.state.tagsSearch)
    }
  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    if (this.props.popoverType && this.props.popoverType === 'tag') {
      if (method === 'click') {
        this.toggle();
        this.addTag(suggestionValue.name, suggestionValue);
      }
    }
  }

  _handleTagList(value) {
    let tag = this.props.data.tag_id.find(item => item._id === value._id);
    if (tag) {
      this.props.removeTag(tag);
    } else {
      this.setState({ tagColor: value.color }, function () {
        this.addTag(value.name);
      })
    }

  }


  toggle() {
    this.setState({
      name: "",
      input: !this.state.input
    });
  }

  onBlur() {
    if (this.state.input) {
      this.toggle();
    }
  }
  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  getSuggestions(value) {
    // if (this.props.popoverType === 'assignee') {
    //   const { members, task } = this.props;
    //   this.WithoutMembersArray = [];
    //   this.WithMembersArray = [];
    //   if (task.user_id) {
    //     for (let i = 0, memberLength = members.length; i < memberLength; i++) {
    //       if (members[i].user_id._id === task.user_id._id) {
    //         this.WithMembersArray.push(members[i]);
    //       } else {
    //         this.WithoutMembersArray.push(members[i]);
    //       }
    //     }

    //     this.assigneeList = this.WithMembersArray.concat(this.WithoutMembersArray);
    //   } else {
    //     this.assigneeList = members;
    //   }
    // }
    if (typeof value === 'object' && this.props.popoverType !== 'tag') {
      var trimmedValue = (value.user_id.displayName||value.user_id.name).trim();
      var escapedValue = this.escapeRegexCharacters(trimmedValue);
    } else if (typeof value === 'object' && this.props.popoverType == 'tag') {
      var escapedValue = this.escapeRegexCharacters((value.displayName||value.name).trim());
    } else {
      var escapedValue = this.escapeRegexCharacters(value.trim());
    }
    const regex = new RegExp("\\b" + escapedValue, "i");
    if (this.props.popoverType && this.props.popoverType == 'tag') {
      return this.props.members.filter(member => regex.test(member.displayName||member.name));
    }
    return this.assigneeList.filter(member => regex.test(member.user_id.displayName||member.user_id.name));
  }
  onSuggestionsFetchRequested({ value }) {
    if (this.props.popoverType && this.props.popoverType === 'tag') {
    } else {
      const suggestions = this.getSuggestions(value);

      this.setState({
        suggestions
      });
    }
  }
  onChangeName(e, { newValue, method }) {

    if (this.props.popoverType && this.props.popoverType == 'tag') {
      if (method === 'click') {
      } else {
        this.setState({ name: e.target.value });
      }

    }
    // else if (this.props.popoverType && this.props.popoverType === 'followers') {
    //   if (method === 'click') {
    //     e.stopPropagation();
    //   } else {
    //     this.setState({ name: e.target.value })
    //   }


    // }
    // else {
    //   if (method === "click" || method === 'enter') {
    //     const { updateTask } = this.props;
    //     this.props.task.user_id = newValue.user_id;
    //     // updateTask(this.props.task).then(res => {
    //     //   if (res.data.success) this.toggle();
    //     //   this.props.toggleDropDown(e);
    //     // });
    //     updateTask(this.props.match.params.wId, this.props.task, 'user_id');
    //     this.toggle();
    //     this.props.toggleDropDown(e);
    //   } else this.setState({ name: e.target.value });
    // }
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: this.getSuggestions("") });
  };

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  getTasksLength(suggestion) {
    const { tasks, statuses } = this.props;
    let someArray = [];
    let tasksWithUsers = [];
    let taskKeys = Object.keys(tasks)
    for (let i = 0; i < taskKeys.length; i++) {
      let statusList = tasks[taskKeys[i]]
      for (let j = 0; j < statusList.length; j++) {
        let task = statusList[j]
        if (task.user_id) {
          tasksWithUsers.push(task);
        }
      }
    }
    return tasksWithUsers.filter(
      task => suggestion.user_id._id === task.user_id._id
    ).length;
  }

  _getFollowersStatus(suggestion) {
    const { task } = this.props;
    return task.followers.find(follower => follower._id === suggestion.user_id._id);
  }

  renderSuggestion(suggestion) {
    if (this.props.popoverType && this.props.popoverType == 'tag' && this.props.data.tag_id) {
      return (
        <div style={{ borderRadius: '4px', color: 'white', backgroundColor: suggestion.color }} className={"d-flex suggestion-content d-inline-block suggestion-sidebar align-items-center justify-content-between "} key={suggestion._id}>
          <div className='tag-suggestion-list-text'>{suggestion.name}</div>
          {this.props.data.tag_id.map((tag, i) => tag._id === suggestion._id ? <img key={tag._id} src={markedImg} /> : null)}
        </div>
      )
    }
    // else if (this.props.popoverType && this.props.popoverType === 'followers') {
    //   return (
    //     <div className="d-flex suggestion-content d-inline-block suggestion-sidebar align-items-center ">
    //       {suggestion.user_id.profilePicUrl ? (
    //         <img
    //           className="profilepic_sidebar"
    //           src={suggestion.user_id.profilePicUrl}
    //           alt="profile"
    //         />
    //       ) : (
    //           <div className="profilepic_member_search d-flex align-items-center justify-content-center">
    //             {suggestion.user_id.name && (
    //               <div>{this._getInitials(suggestion.user_id.name)}</div>
    //             )}
    //           </div>
    //         )}
    //       <div className="member-info">
    //         <h5>{suggestion.user_id.name}</h5>
    //       </div>
    //       {this._getFollowersStatus(suggestion) ? <div onClick={() => this._handleRemoveFollower(suggestion)} style={{ fontSize: '12px', color: '#b3b3b3', cursor: 'pointer' }}>remove</div> :
    //         <div style={{ fontSize: '12px', color: '#422c88', cursor: 'pointer' }} onClick={() => this._handleAddFollowers(suggestion)}> add</div>
    //       }
    //     </div>
    //   );
    // } else if (this.props.popoverType && this.props.popoverType === 'assignee') {
    //   // console.log("Member suggestion : ",suggestion);
    //   return (
    //     <div className="d-flex suggestion-content d-inline-block suggestion-sidebar align-items-center ">
    //       {suggestion.user_id.profilePicUrl ? (
    //         <img
    //           className="profilepic_sidebar"
    //           src={suggestion.user_id.profilePicUrl}
    //           alt="profile"
    //         />
    //       ) : (
    //           <div className="profilepic_member_search d-flex align-items-center justify-content-center">
    //             {suggestion.user_id.name && (
    //               <div>{this._getInitials(suggestion.user_id.name)}</div>
    //             )}
    //           </div>
    //         )}
    //       <div className="member-info">

    //         <h5>{suggestion.user_id.name}</h5>
    //       </div>
    //       {this.props.task.user_id ? suggestion.user_id._id === this.props.task.user_id._id ? <div className='assigneeList-selected'>assigned</div> : <div className="taskLength-style">
    //         {this.getTasksLength(suggestion)} tasks
    //       </div> : <div className='taskLength-style'>{this.getTasksLength(suggestion)} tasks</div>}
    //     </div>
    //   );
    // }

  }
  _getInitials(string) {
    return string
      .trim()
      .split(" ")
      .map(function (item) {
        if (item.trim() != "") {
          return item[0].toUpperCase();
        } else {
          return;
        }
      })
      .join("")
      .slice(0, 2);
  }

  _handleAddOrRemoveFollowers() {
    const { user_now, task, showTags, removeFollowers, addFollowers } = this.props;
    var a = task.followers.find(follower => user_now._id === follower._id)
    if (a) {
      removeFollowers(this.props.match.params.wId, showTags, task._id, user_now)
    }
    else {
      addFollowers(this.props.match.params.wId, showTags, task._id, user_now)
    }
  }

  _handleAddFollowers(suggestion) {
    const { addFollowers, showTags, task } = this.props;
    addFollowers(this.props.match.params.wId, showTags, task._id, suggestion.user_id, 'addFollowers');

  }
  _handleRemoveFollower(suggestion) {
    const { removeFollowers, showTags, task } = this.props;
    removeFollowers(this.props.match.params.wId, showTags, task._id, suggestion.user_id);
  }

  onSubmit(e) {
    e.preventDefault();
    this._handleCreateTag();
  }

  _handleChange(e) {
    this.setState({ tagsSearch: e.target.value })
  }

  _onCreateTag() {
    this.setState({ addTag: !this.state.addTag });
  }

  _setTagColor(color) {
    this.setState({ tagColor: color, customInputFocus: true })
  }

  onInputChange(e) {
    if (this.props.popoverType == 'tag') {
      this.setState({ tagsSearch: e.target.value });
    } else if (this.props.popoverType == 'followers') {
      this.setState({ membersSearch: e.target.value });
    }

  }

  toggleDropDown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  content = (filterTags, addTag) => ""



  render() {

    let filterTags;
    if (this.props.popoverType && this.props.popoverType === 'tag') {
      filterTags = this.props.members.filter(tag => {
        return tag.name.toLowerCase().includes(this.state.tagsSearch.toLowerCase())
      });
    }

    return (
      <div>
        <Popover
          className="sidebar_dropdown"
          overlayClassName="sidebar_dropdown"
          // className={classnames('custom-popover task-sidebar-tag-popover', 'sidebar_dropdown',
          //   { 'task-sidebar-tag-popover-top': this.props.windowHeight >= 60 && !this.state.addTag },
          //   { 'add-tag-options': this.state.addTag },
          //   { 'add-tag-header': this.props.tagsHeaderPopoverOpen }
          // )}
          // placement="auto"
          trigger={["click"]}
          // title={<span>Add a Label</span>}
          // content={this.content(filterTags, this.state.addTag)}
          content={
            this.state.addTag ? (
              <div className={classnames('task-sidebar-tag-popover',
                { 'task-sidebar-tag-popover-top': this.props.windowHeight >= 60 && !this.state.addTag },
                { 'add-tag-options': this.state.addTag },
                { 'add-tag-header': this.props.tagsHeaderPopoverOpen }
              )}
              >
                <div>
                  <form onSubmit={(e) => this.onSubmit(e)}>
                    <div>
                      <div>Select Color</div>
                      <div className='tag-color-options d-flex justify-content-between flex-wrap '>
                        <div onClick={() => this._setTagColor('#61be4f')} className='tag-medium-green tag-color1 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#61be4f' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#f2d700')} className='tag-light-yellow tag-color2 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#f2d700' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#ff9f1a')} className='tag-light-orange tag-color3 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#ff9f1a' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#eb5a46')} className='tag-red tag-color4 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#eb5a46' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#c377e0')} className='tag-light-purple tag-color5 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#c377e0' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#0078bf')} className='tag-medium-blue tag-color6 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#0078bf' ? <img src={markedImg} /> : null}
                        </div>
                        <div onClick={() => this._setTagColor('#00c2e0')} className='tag-light-blue tag-color7 d-flex align-items-center justify-content-center'>
                          {this.state.tagColor === '#00c2e0' ? <img src={markedImg} /> : null}
                        </div>
                      </div>
                      {/* <hr /> */}
                      {this.state.valid ? null : <div style={{ color: 'red', fontSize: '10px' }}>{this.state.error}</div>}
                      <div className='sidebar-tag-input'>
                        <Input autoFocus
                          ref={el => { this.textInput = el; }}
                          placeholder='enter Label name'
                          onChange={(e) => this._handleChange(e)}
                          value={this.state.tagsSearch} />
                      </div>
                      <Button type="primary" style={{ width: "100%", marginTop: 4 }} onClick={this._handleCreateTag}>Create</Button>
                      <Button type="link" size="small" style={{ width: "100%" }} onClick={this.cancelAddTag}>Cancel</Button>
                    </div>
                  </form>
                </div>
              </div>
            )
              :
              (<div className={classnames('custom-popover task-sidebar-tag-popover',
                { 'task-sidebar-tag-popover-top': this.props.windowHeight >= 60 && !this.state.addTag },
                { 'add-tag-options': this.state.addTag },
                { 'add-tag-header': this.props.tagsHeaderPopoverOpen }
              )}
              ><div className="custom-popover-body-tag">
                  <div>

                    {this.state.tagsSearch === '' || filterTags.length > 0 ? <ul className='task-sidebar-tags-list-body'>
                      {this.state.tagsSearch === '' ? this.props.members.map(tag => {

                        return <li key={tag._id} onClick={() => this._handleTagList(tag)}>{this.renderSuggestion(tag)}</li>
                      }) : filterTags.map(tag => {

                        return <li key={tag._id} onClick={() => this._handleTagList(tag)}>{this.renderSuggestion(tag)}</li>
                      })}
                    </ul> : null}
                    <div className='sidebar-tag-input'>
                      <Input autoFocus 
                        value={this.state.tagsSearch} 
                        onChange={(e) => this.onInputChange(e)} 
                        onKeyPress={(e) => this._handleKeyPress(e, filterTags)} 
                        placeholder="Enter Label name" />
                    </div>
                  </div>
                  <Button type="dashed" style={{ width: "100%", marginTop: 4 }} onClick={this._onCreateTag}>New Label</Button>
                  <Button type="link" size="small" style={{ width: "100%" }} onClick={this.cancel}>Cancel</Button>
                </div>
              </div>)
          }
          visible={this.state.dropdownOpen}
          // target={this.props.popoverButtonId}
          onVisibleChange={this.toggleDropDown}
        >
          {this.props.children}
        </Popover>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // tag: state.filterSidebarValue.tag,
    tasks: state.task.tasks,
    // task: state.task.task,
    statuses: state.statuses
  }
}

export default withRouter(connect(
  mapStateToProps,
  { updateTask, addFollowers, removeFollowers, addTaskTag, addTaskMyTag }
)(CustomPopOver));
