import React, { Component, Fragment } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import moment from "moment";
import _ from "lodash";
import mentionsStyles from './mentionsStyles.module.css';
import mentionsStylesDefault from './defaultMentions.module.css';


import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import {
  Modal,
  Typography,
  Button,
  Select,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  Badge,
  Dropdown,
  DatePicker,
  Avatar,
  Tag,
  Checkbox,
  message,
  Progress,
  Mentions,
} from "antd";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import { EditorState, convertToRaw, ContentState, getDefaultKeyBinding, KeyBindingUtil } from "draft-js";
import "draft-js/dist/Draft.css";
// 
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
import { ItalicButton, BoldButton, UnderlineButton } from 'draft-js-buttons';
import "draft-js-mention-plugin/lib/plugin.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css"
import TextInput from './TaskDescription'
// import "./editorStyles.css";
// 
import linkStyles from './linkStyles.module.css';
import createLinkifyPlugin from "draft-js-linkify-plugin";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import AddTaskFile from "./taskFile.js";
import activityGrammer from "../../../../utils/taskActivityGrammer.js";
import CustomPopOver from "../../../common/CustomPopOver";
import DropDownAttachment from "./DropDownAttachment";
import customToast from "../../../common/customToaster";
import TaskCommentItem from "./TaskCommentItem";
import queryString from "query-string";


import {
  updateTask,
  taskMove,
  deleteTask,
  archiveTask,
  removeAssignee,
  deleteTaskFile,
  // taskDeletedToaster,
  // setAttachmentsToaster
} from "../../tasks/task/taskActions";
// import { getProfileinfo } from "../../../common/common_action";
import {
  setSidebar,
  getTaskFile,
  getActivities,
  addFollowers,
  removeFollowers,
  addChecklistItem,
  getChecklistItems,
  updateChecklist,
  deleteCheckListItem,
  addTaskComment,
  getTaskComment
} from "../sidebarActions";
import { getMembers } from "../../projectMembers/projectMembershipActions";
import { getTag, deleteTaskTag } from "../../tasks/tags/TagAction";
import { getProject, addCustomAttribute } from "../../projectActions";
import activityActions from "../../../../utils/activityActions.json";

import "draft-js-mention-plugin/lib/plugin.css";
import "react-datepicker/dist/react-datepicker.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal


// 
const linkPlugin = createLinkPlugin({
  theme: linkStyles,
  placeholder: 'Add link'
});
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

// const mentionPlugin = localStorage.getItem('theme') === 'default' ? createMentionPlugin({
//    theme:mentionsStyles
// }):createMentionPlugin({
//   theme:mentionsStyles
// })
// const { MentionSuggestions } = mentionPlugin;
// const plugins = [mentionPlugin,inlineToolbarPlugin, linkPlugin]
// 

class TaskSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      show_activity: true,
      dropdownOpenForAdd: false,
      tagsHeaderPopoverOpen: false,
      checkListName: "",
      checklistStatus: false,
      formTaskChecklist: false,
      deleteConfirmModal: false,
      editorState: EditorState.createEmpty(),
      suggestions: this.getMentions(),
      isTaskAttachView: false,
      allPlugins:[]
    };
    this.task_endDateOnChange = this.task_endDateOnChange.bind(this);
    this.task_startDateOnChange = this.task_startDateOnChange.bind(this);
    this.task_statusOnChange = this.task_statusOnChange.bind(this);
    this.task_assigneeOnChange = this.task_assigneeOnChange.bind(this);
    this.task_titleOnChange = this.task_titleOnChange.bind(this);
    this.task_descOnChange = this.task_descOnChange.bind(this);
    this.task_archiveOnConfirm = this.task_archiveOnConfirm.bind(this);
    this.task_deleteOnConfirm = this.task_deleteOnConfirm.bind(this);
    this.task_deleteNow = this.task_deleteNow.bind(this);
    this.task_assigneeonDelete = this.task_assigneeonDelete.bind(this);

    this.showTags = !window.location.pathname.split("/")[6];
    this.closeSidebar = this.closeSidebar.bind(this);
    this.onSubmitDescDelayed = _.debounce(this.onSubmitDesc, 1000);
    this.onSubmitNameDelayed = _.debounce(this.onSubmitName, 1000);
    this._toggleActivity = this._toggleActivity.bind(this);
    this._renderActivities = this._renderActivities.bind(this);
    this._getInitials = this._getInitials.bind(this);

    this.attachment_downloadFile = this.attachment_downloadFile.bind(this);
    this.attachmentToggleView = this.attachmentToggleView.bind(this);
    this.attachmentDropdownToggleForAdd = this.attachmentDropdownToggleForAdd.bind(this);
    this.attachmentDeleteFile = this.attachmentDeleteFile.bind(this);

    this.followersAddOrRemove = this.followersAddOrRemove.bind(this);

    this.label_remove = this.label_remove.bind(this);
    this.labelsShowModal = this.labelsShowModal.bind(this);

    this.subtaskInputOnChange = this.subtaskInputOnChange.bind(this);
    this.subtaskShowForm = this.subtaskShowForm.bind(this);
    this.subtaskUpdateStatus = this.subtaskUpdateStatus.bind(this);
    this.subtaskDelete = this.subtaskDelete.bind(this);
    this.subtaskInputOnSave = this.subtaskInputOnSave.bind(this);
    this.subtaskFormInputOnChange = this.subtaskFormInputOnChange.bind(this);
    this.subtaskAdd = this.subtaskAdd.bind(this);

    this.comment_add = this.comment_add.bind(this);
    this.comment_OnChange = this.comment_OnChange.bind(this);

    // this.onMentionSelect = this.onMentionSelect.bind(this);
    // this.onSearchMemberChange = this.onSearchMemberChange.bind(this);

    //mention
    // this.mentionMembersPlugin = createMentionPlugin({
    // });
    this.mentionPlugin = localStorage.getItem('theme') === 'default' ? createMentionPlugin({
      theme:mentionsStylesDefault
    }):createMentionPlugin({
     theme:mentionsStyles
   })
    this.linkifyPlugin = createLinkifyPlugin({ target: "_blank" });
    this.plugins = [
      // this.mentionMembersPlugin, 
      this.linkifyPlugin,this.mentionPlugin,inlineToolbarPlugin
    ];

    this.taskCommentKeyCommand = this.taskCommentKeyCommand.bind(this);
    this.setSuggestionMentionState = this.setSuggestionMentionState.bind(this);
    this.taskCommentKeyBindingFn = this.taskCommentKeyBindingFn.bind(this);

    this.task_archiveShowConfirmModal = this.task_archiveShowConfirmModal.bind(this)
    this.task_archiveHideConfirmModal = this.task_archiveHideConfirmModal.bind(this)
  }
  
  getMentions=()=>{
    let mentions=this.props.workspaceMembers.map((member,idx)=>{
      return {name:member.user_id.displayName||member.user_id.name}
    })
    return mentions;
  }
  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.getMentions()),
    });
  };

  taskCommentKeyBindingFn(e) {
    if (e.keyCode == 13 /* `S` key */) {
      return "add_comment";
    }
    return getDefaultKeyBinding(e);
  }

  taskCommentKeyCommand(command) {
    if (command === "add_comment") {
      this.comment_add();
      return "handled";
    }
    return "not-handled";
  }

  subtaskDelete(e, id) {
    this.props.deleteCheckListItem(this.props.match.params.wId, id, this.showTags)
  }

  subtaskUpdateStatus(e, id) {
    var data = {
      status: e.target.checked
    };
    this.props.updateChecklist(this.props.match.params.wId, id, data);
  }

  subtaskInputOnChange(e) {
    // console.log("e.target.name:"+e.target.name+" e.target.value:"+e.target.value)
    if (this.isValid(e.target.value)) {
      this.setState({ [e.target.name]: e.target.value })
      this.props.taskCheckListItems.find(cl => (("cl" + cl._id) == e.target.name)).name = e.target.value
    }
  }

  subtaskInputOnSave(e, id) {
    // console.log("HandleaddCheckListItem");
    e.preventDefault();
    var data = {
      name: e.target.value.trim()
    };
    e.target.blur()
    // console.log("blur done")
    this.props.updateChecklist(this.props.match.params.wId, id, data).then(r => {
      this.setState({ formTaskChecklist: false })
      // e.target.blur()
      // console.log("blur done2")
    }).catch(e => console.error(e))

  }

  subtaskAdd(e) {
    // console.log("newaddCheckListItem");
    e.preventDefault();
    var data = {
      name: this.state.checkListName,
      status: this.state.checklistStatus
    }
    e.target.blur()
    this.props
      .addChecklistItem(this.props.match.params.wId, this.props.task._id,
        this.showTags,
        data)
      .then(res => {
        // console.log("blur done2")
        if (res.data.success) {
          // console.log("added successfully");
          this.setState({ checkListName: "", checklistStatus: false, formTaskChecklist: false });
        }
      }).catch(e => console.error(e))
  }

  subtaskFormInputOnChange(e) {
    this.setState({ checkListName: e.target.value });
  }

  subtaskShowForm() {
    this.setState({
      formTaskChecklist: !this.state.formTaskChecklist
    });
  }

  attachmentDeleteFile(id) {
    const { deleteTaskFile } = this.props;
    // if (this.showTags) {
    //   deleteMyTaskFile(id).then(res => {
    //     if (res.data.success) {
    //     }
    //   });
    // } else {
    let key = id;
    message.loading({ content: 'Deleting file...', key });
    deleteTaskFile(this.props.match.params.wId, id, this.props.task).then(res => {
      if (res.data.success) {
        message.success({ content: 'File Deleted!', key, duration: 2 });
        // this.props.setAttachmentsToaster();
        // customToast.taskDeleted("File Deleted", {
        //   className:
        //     "some-toast-box d-flex justify-content-between align-items-center"
        // });
      } else {
        message.error({ content: 'Unable to delete File!', key, duration: 2 });
      }
    });
    // }
  }

  truncTitle = (titleTxt) => {
    // let titleTxt = this.props.task.name;
    return titleTxt.length > 10 ? `${titleTxt.substring(0, 10)}..` : titleTxt;
  }

  truncDesc = (projectname) => {
    // let titleTxt = this.state.taskname;
    return projectname.length > 10 ? `${projectname.substring(0, 10)}..` : projectname;
  }

  labelsShowModal() {
    // console.log("hello")
    this.setState({
      tagsHeaderPopoverOpen: !this.state.tagsHeaderPopoverOpen,
      dropdownOpenForAdd: false
    });
  }

  attachmentDropdownToggleForAdd() {
    this.setState({ dropdownOpenForAdd: !this.state.dropdownOpenForAdd });
  }

  attachmentToggleView() {
    this.setState({ isTaskAttachView: !this.state.isTaskAttachView });
  }

  followersAddOrRemove(e) {
    var a = this.props.task.followers.find(follower => this.props.user._id === follower._id)
    if (a) {
      this.props.removeFollowers(this.props.match.params.wId, this.showTags, this.props.task._id, this.props.user).then(
        this.setState({ currentUserFollow: !this.state.currentUserFollow }, () => {
          message.info("You have unfollowed this task!");
        })
      )
    }
    else {
      this.props.addFollowers(this.props.match.params.wId, this.showTags, this.props.task._id, this.props.user).then(
        this.setState({ currentUserFollow: !this.state.currentUserFollow }, () => {
          message.info("You have followed this task!");
        })
      )
    }
  }

  _toggleActivity(id) {
    //this.props.getActivities(id);
    this.setState({ show_activity: !this.state.show_activity });
  }

  attachment_downloadFile(id) {
    const { getTaskFile } = this.props;
    getTaskFile(this.props.match.params.wId, id).then(res => {
      if (res.data.success) {
        var url = res.data.files;

        window.open(url, "_blank");
      } else {
        // this.setState({ errors: res.data.errors });
      }
    });
  }

  task_endDateOnChange(date) {
    const { updateTask } = this.props
    const due = moment(date).format("DD MMM YYYY")
    this.props.task.due_on = new Date(due)
    updateTask(this.props.match.params.wId, this.props.task, "due_on").then(res => {
      if (res.data.success) {
        this.setState({ due_on: date })
      }
    })
  }

  task_startDateOnChange(date) {
    const { updateTask } = this.props;
    const start = moment(date).format("DD MMM YYYY");
    this.props.task.start_at = new Date(start);
    updateTask(this.props.match.params.wId, this.props.task, "start_at").then(res => {
      if (res.data.success) {
        this.setState({ start_at: date });
      }
    });
  }

  task_assigneeOnChange(val, opt) {
    // console.log("task_assigneeOnChange called")
    const { updateTask } = this.props;
    let assignee;
    this.props.workspaceMembers.map((member) => {
      if (member._id === val) {
        assignee = member.user_id;
      }
    })
    this.props.task.user_id = assignee;
    updateTask(this.props.match.params.wId, this.props.task, "user_id")
  }

  task_statusOnChange(status) {
    const { updateTask, taskMove, task } = this.props;
    var data = {};
    //selected project. would be the current project.
    var proj = this.props.project;
    data.workspace_id = proj.workspace_id._id;
    data.project_id = proj._id;
    data.position = 1;
    // data.status = this.props.statuses[status];
    data.status = status;
    // console.log("this.props.task.status:"+task.status._id)
    // console.log("new status:"+status)
    let taskCopy = { ...task }
    taskMove(this.props.match.params.wId, taskCopy, null, data).then(res => {
      // updateTask(this.props.match.params.wId, this.props.task, "status").then(res => {      
      if (res.data.success) {
        this.setState({
          status: this.props.statuses[status]
        }, () => {
          this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks`);
          // this.closeSidebar();
        });
      }
    })
    //NOT WAITING FOR RESPONSE...
    // console.log("this.props.statuses[status]:"+this.props.statuses[status])
    // this.props.task.status = this.props.statuses[status];
  }

  closeSidebar() {
    const { setSidebar, workspace } = this.props;
    if (
      window.location.pathname.match("/myspace/tasks/") &&
      window.location.pathname.match("/myspace/tasks/").length > 0
    ) {
      let obj = {
        title: "Close_Sidebar_Click",
        // url: `/myspace/tasks${window.location.search}`
        url: `/workspace/'${workspace._id}/myspace/tasks${
          window.location.search
          }`
      };
      window.history.pushState(obj, obj.title, obj.url);
    } else if (
      window.location.pathname.match("/squad/") &&
      window.location.pathname.match("/squad/").length > 0
    ) {
      let loc = window.location.pathname.split("/");
      if (loc[loc.length - 1] !== "tasks") {
        loc.splice(loc.length - 1, 1);
      }
      let new_loc = loc.join("/");
      let obj = {
        title: "Close_Sidebar_Click",
        url: `${new_loc}${window.location.search}`
      };
      window.history.pushState(obj, obj.title, obj.url);
    }

    setSidebar("");
  }

  task_deleteNow() {
    const { deleteTask, setSidebar } = this.props;
    // if (this.showTags) {
    //   deleteMyTask(this.props.task).then(res => {
    //     if (res.data.success) {
    //       this.props.taskDeletedToaster();
    //       customToast.taskDeleted("Task Deleted Successfully", {
    //         className:
    //           "some-toast-box d-flex justify-content-between align-items-center"
    //       });
    //       setSidebar("");
    //     }
    //   });
    // } else {
    deleteTask(this.props.match.params.wId, this.props.task).then(res => {
      if (res.data.success) {
        let parsedQueryString = queryString.parse(window.location.search);
        let URLobj = {
          title: "TASK_DELETED",
          url: parsedQueryString.view ? `${this.props.location.pathname}?view=${parsedQueryString.view}` : this.props.location.pathname
        };
        window.history.pushState(URLobj, URLobj.title, URLobj.url);
        // this.props.taskDeletedToaster();
        message.success({ content: 'Task Deleted Successfully!', duration: 2 });
        // customToast.taskDeleted("Task Deleted Successfully", {
        //   className:
        //     "some-toast-box d-flex justify-content-between align-items-center"
        // });
        setSidebar("");
      }
    });
    // }
  }

  isValid(data) {
    var errors = {};
    if (Validator.isEmpty(data)) {
      errors.name = "This field is required";
    }
    // this.setState({ errors: errors });
    return isEmpty(errors);
  }

  task_titleOnChange(e) {
    // if (this.isValid(e.target.value)) {
    // this.props.task.name = e.target.value
    this.setState({ name: e.target.value });
    this.onSubmitNameDelayed();
    // this.onSubmitName();
    // }
  }

  task_descOnChange(e) {
    this.setState({ desc: e.target.value });
    if (this.isValid(e.target.value)) {
      this.props.task.desc = e.target.value
      this.onSubmitDescDelayed()
    }
  }

  onSubmitName() {
    if (this.state.name) {
      const { updateTask, task } = this.props;
      this.props.task.name = this.state.name;
      updateTask(this.props.match.params.wId, task, "name").then(res => {
        if (res.data.success) {
          // this.setState({ taskname: '' });
        } else {
          // this.setState({ errors: res.data.errors });
        }
      })
    } else {
      message.error({ content: "This field cannot be empty" })
    }
  }

  onSubmitDesc() {
    const { updateTask, task } = this.props;
    // if (this.isValid(this.state.desc)) {
    this.props.task.desc = this.state.desc;
    updateTask(this.props.match.params.wId, task, "desc").then(res => {
      if (res.data.success) {
        // this.setState({ taskname: '' });
      } else {
        // this.setState({ errors: res.data.errors });
      }
    })
  }

  componentDidMount() {
// this.setState({
//   allPlugins:[linkPlugin,mentionPlugin]
// })
    const { task, getMembers, getTag, getChecklistItems, getTaskComment, getActivities } = this.props;
    this.setState({ desc: task.desc, name: this.props.task.name })
    task.files && (task.files.length > 0) && this.setState({ taskHasFiles: true })
    this.state.tagsHeaderPopoverOpen && this.setState({ tagsHeaderPopoverOpen: false })

    getTag(this.props.match.params.wId);
    getMembers(this.props.match.params.pId, this.props.match.params.wId);
    getChecklistItems(this.props.match.params.wId, this.props.task._id)
    getTaskComment(this.props.match.params.wId, this.props.task._id)
    getActivities(this.props.match.params.wId, this.props.task._id)
  }

  componentDidUpdate(prevProps) {
    // console.log("componentDidUpdate prev:"+JSON.stringify(prevProps))

    if (prevProps.task._id !== this.props.task._id) {
      this.setState({
        editorState: EditorState.createEmpty(),
      })
      const { task, getMembers, getTag, getChecklistItems, getTaskComment, getActivities } = this.props;
      this.setState({ desc: task.desc, name: this.props.task.name })
      task.files && (task.files.length > 0) && this.setState({ taskHasFiles: true })
      this.state.tagsHeaderPopoverOpen && this.setState({ tagsHeaderPopoverOpen: false })

      getTag(this.props.match.params.wId);
      getMembers(this.props.match.params.pId, this.props.match.params.wId);
      getChecklistItems(this.props.match.params.wId, this.props.task._id)
      getTaskComment(this.props.match.params.wId, this.props.task._id)
      getActivities(this.props.match.params.wId, this.props.task._id)

      task.files && (task.files.length > 0) && this.setState({ taskHasFiles: true })
      this.state.tagsHeaderPopoverOpen && this.setState({ tagsHeaderPopoverOpen: false })
      this.setState({ isTaskAttachView: false });
    }
    // if (this.state.tagsHeaderPopoverOpen) {
    //   this.scrollToBottom();
    // }
  }

  comment_OnChange = editorState => {
    this.setState({ emptyField: false });
    this.setState({ editorState });
    // // this.setState({ currentComment:e.target.value });
  }

  setSuggestionMentionState() {
    this.setSuggestionState = false;
  }

  task_assigneeonDelete = val => {
    if (!val) {
      // console.log("should delete now")
      this.props.removeAssignee(this.props.match.params.wId, this.props.task._id);
    }
  }

  _renderActivities() {
    // console.log("re-render comments...:"+JSON.stringify(this.props.taskComments))

    if (this.state.show_activity) {
      var itemArr = this.props.activities
        .concat(this.props.taskComments)
        .sort(
          (item1, item2) =>
            new Date(item1.created_at) - new Date(item2.created_at)
        );
      return itemArr.reverse().map((item, index) => {

        if (!item.action) {
          // let member = this.props.members.find(
          //   member => member.user_id._id === item.created_by._id
          // );
          let member = this.props.workspaceMembers.find(
            member => member.user_id._id === item.created_by._id
          );

          return (

            <TaskCommentItem member={member} item={item} key={item._id} wId={this.props.match.params.wId} />

          );
        } else {
          let param1 = "";
          let param2 = "";
          let member = this.props.members.find(
            member => member.user_id._id === item.actor_id._id
          );
          let req_actor = this.props.members.filter(
            member => member.user_id._id === item.actor_id._id
          );
          let actor;
          if (req_actor.length > 0 || this.props.task.status) {
            actor = item.actor_id.name;
          } else {
            actor = "Unknown user";
          }
          if (item.action == activityActions.task.status_updated) {
            try {
              param1 = item.additional_parameters.status_to;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == (activityActions&&activityActions.task&&activityActions.task.assigned_to)) {
            try {
              param1 = item&&item.additional_parameters&&item.additional_parameters.assigned_to.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.task_section_moved) {
            if (item.additional_parameters.moved_from) {
              param1 = item.additional_parameters.moved_from.name;
            } else {
              param1 = "Unknown Section";
            }
            if (item.additional_parameters.moved_to) {
              param2 = item.additional_parameters.moved_to.name;
            } else {
              param2 = "Unknown Section";
            }
          } else if (item.action == activityActions.task.due_date_updated) {
            try {
              param1 = moment(
                new Date(item.additional_parameters.due_date_to)
              ).format("DD MMM YYYY");
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.start_date_updated) {
            try {
              param1 = moment(
                new Date(item.additional_parameters.start_at_to)
              ).format("DD MMM YYYY");
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.name_updated) {
            try {
              param1 = item.additional_parameters.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.description_updated) {
            try {
              param1 = item.additional_parameters.description;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.attachment_added) {
            try {
              param1 = item.additional_parameters.attachment.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.remove_follower) {
            try {
              param1 = item.additional_parameters.task_follower.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action == activityActions.task.add_follower) {
            try {
              param1 = item.additional_parameters.task_follower.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action === activityActions.task.tagAssigned) {
            try {
              param1 = item.additional_parameters.name;
            } catch (e) {
              param1 = "";
            }
          } else if (item.action === activityActions.task.tagRemoved) {
            try {
              param1 = item.additional_parameters.name;
            } catch (e) {
              param1 = "";
            }
          }
          // console.log("Props from TaskSidebar---->",this.props);
          return (
            (item.action) && (item.action !== 'ASSIGNED_TO')
              && (item.action !== "ASSIGNE_REMOVED")
              && (item.action == "TASK_SECTION_MOVED" && param1 == param2 ? false : true)
              && (item.action !== "START_DATE_UPDATED")
              && (item.action !== "DUE_DATE_UPDATED") ?
              <div key={item._id} className="task_activity_item_small">
                <div style={{ paddingRight: 12 }}>
                  {member ? (
                    member.user_id.profilePicUrl ? (
                      // <img
                      //   src={member.user_id.profilePicUrl}
                      //   alt="profile"
                      //   className="user_profile_pic"
                      // />
                      <Avatar src={member.user_id.profilePicUrl} />
                    ) : (
                        // <div className="user_profile_pic_color d-flex align-items-center justify-content-center">
                        //   {member.user_id.name && (
                        //     <div className="proj_activ_block_item_without_img">{this._getInitials(member.user_id.name)}</div>
                        //   )}
                        // </div>
                        <Avatar>{this._getInitials(member.user_id.name)}</Avatar>
                      )
                  ) : (item.actor_id.profilePicUrl ? (
                    // <img
                    //   src={this.props.user_now.profilePicUrl}
                    //   alt="profile"
                    //   className="user_profile_pic"
                    // />
                    <Avatar src={item.actor_id.profilePicUrl} />
                  ) : (
                      // <div className="user_profile_pic_color d-flex align-items-center justify-content-center">
                      //   {this._getInitials(this.props.user_now.name)}
                      // </div>
                      <Avatar>{this._getInitials(item.actor_id.name)}</Avatar>
                    )
                    )}

                </div>
                <div className="activity_item_right_box" key={item._id}>

                  <Text type="secondary">
                    {actor} {activityGrammer(item.action, param1, param2)} {moment(new Date(item.created_at)).fromNow()}
                  </Text>
                  {/* {activityGrammer(item.action, param1, param2)} */}

                </div>
              </div> : null
          );
        }
      });
    } else {
      return this.props.taskComments.reverse().map((item, index) => {
        let member = this.props.members.find(
          member => member.user_id._id === item.created_by._id
        );

        return <TaskCommentItem member={member} item={item} key={item._id} />;
      });
    }
  }

  _getInitials(string) {
    // return string
    //   .trim()
    //   .split(" ")
    //   .map(function (item) {
    //     if (item.trim() != "") {
    //       return item[0].toUpperCase();
    //     } else {
    //       return;
    //     }
    //   })
    //   .join("")
    //   .slice(0, 2);

    let nameArr = string
    .trim()
    .replace(/\s+/g,' ') //remove extra spaces
    .split(" ")

  if (nameArr.length>1)
    return (nameArr[0][0] + nameArr[1][0]).toUpperCase()
  else
    return nameArr[0].slice(0, 2).toUpperCase()
  }

  label_remove(tag) {
    this.props.deleteTaskTag({
      id: tag,
      task_id: this.props.task._id
    })
  }

  task_archiveShowConfirmModal = () => {
    this.setState({
      archiveConfirmModal: true,
    });
  };

  task_archiveHideConfirmModal = () => {
    this.setState({
      archiveConfirmModal: false,
    })
  }

  task_deleteShowConfirmModal = () => {
    this.setState({
      deleteConfirmModal: true,
    })
  }

  task_deleteHideConfirmModal = () => {
    this.setState({
      deleteConfirmModal: false,
    })
  }

  comment_add() {
    //reset the input first to avoid duplicate messages..
    const editorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromText("")
    );
    this.setState({
      editorState: EditorState.moveFocusToEnd(editorState)
    });


    let newData = convertToRaw(this.state.editorState.getCurrentContent());
    let checkText = newData.blocks[0].text;
    this.setState({ clicked: true });
    var r = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    // console.log("CURRENT COMMENT CONTENT", this.state.editorState.getCurrentContent());
    // console.log("GET COMMENT ENTITY MAP", r.entityMap);
    //e.preventDefault();
    if (checkText.trim().length !== 0) {
      if (this.isValid(r)) {
        // console.log("RRRRRRRRRRRRRR : ", r);
        var data = {};
        data.text = r;
        data.mentionMembers = r.entityMap;
        // console.log("DATA FOR COMMENT", data);
        this.props
          .addTaskComment(this.props.match.params.wId, this.props.task._id, this.showTags, data)
          .then(res => {
            if (res.data.success) {
              // const editorState = EditorState.push(
              //   this.state.editorState,
              //   ContentState.createFromText("")
              // );
              // this.setState({
              //   editorState: EditorState.moveFocusToEnd(editorState)
              // });

              // console.log("==============----jgfjhkghgghghghj------------------->",this.state.editorState)

              //this.setState({ editorState: EditorState.moveFocusToStart(EditorState.createEmpty()), clicked:false });
              // this.lastComment.scrollIntoView({ behavior: "smooth" });
            }
          });
      }
    } else {
      this.setState({ isCommentEmpty: true });
    }
  }

  task_deleteOnConfirm() {
    // console.log("archiveTaskOnConfirm called ")
    this.task_deleteHideConfirmModal()
    this.task_deleteNow();
    // const { archiveTask, setSidebar } = this.props;
    // archiveTask(this.props.match.params.wId, this.props.task).then(res => {
    //   console.log("archive call complete")
    //   if (res.data.success) {
    //     setSidebar("");
    //   }
    // }).catch(e => { console.log(e) });
  }

  task_archiveOnConfirm() {
    // console.log("archiveTaskOnConfirm called ")
    this.task_archiveHideConfirmModal();
    const { archiveTask, setSidebar } = this.props;
    archiveTask(this.props.match.params.wId, this.props.task).then(res => {
      // console.log("archive call complete")
      if (res.data.success) {
        setSidebar("");
        message.success({ content: 'Task Archived Successfully!', duration: 2 });
      }
    }).catch(e => { console.error(e) });
  }

  task_disabledStartDate = startValue => {
    const endValue = this.props.task.due_on && moment(this.props.task.due_on)
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  task_disabledEndDate = endValue => {
    const startValue = this.props.task.start_at && moment(this.props.task.start_at)
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
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

  render() {
    // this.props.task && this.props.task.status && console.log("task statis:"+JSON.stringify(this.props.task.status))
    // console.log("Current taskCheckListItems : ", this.props.taskCheckListItems);

    const { MentionSuggestions } = this.mentionPlugin;


    if (this.props.task && this.props.user) {
      if (this.props.task.followers && this.props.task.followers.length > 0) {
        var a = this.props.task.followers.find(follower => follower._id === this.props.user._id);
      } else {
        var a = false;
      }
    }

    var progresspercent = 0;
    var progresscount = 0;
    if (this.props.taskCheckListItems !== undefined && this.props.taskCheckListItems.length > 0) {
      this.props.taskCheckListItems.map((task) => {
        if (task.status) {
          progresscount = progresscount + 1
        }
      })
      progresspercent = Math.floor((progresscount / this.props.taskCheckListItems.length) * 100);
    }

    var hasFiles;
    if (this.props.task.files) {
      if (this.props.task.files.length > 0) {
        hasFiles = true;
      }
      else {
        hasFiles = false;
      }
    }

    // const MentionMembersSuggestions = this.mentionMembersPlugin
    //   .MentionSuggestions;

    const {
      task: currentTask,
      user_now,
    } = this.props;
    const {
      name,
      followers
    } = this.state;

    // console.log("CURRENT TASK !!!!!" + JSON.stringify(currentTask))

    // if (task.followers && task.followers.length > 0) {
    //   isFollowerPresent = task.followers.filter(
    //     follower => follower._id === user_now._id
    //   );
    // }
    // console.log('this.props.location.pathname.split("/")[5]',window.location.pathname.split("/")[5])

    // let startDate = this.dateToSeconds(this.props.)

    const assignee_options = this.props.workspaceMembers.map(d => <Option key={d._id}>{d.user_id.displayName || d.user_id.name}</Option>);
    const status_options = this.props.statuses.map((d, index) => {
      // console.log("status:"+JSON.stringify(d))
      return (<Option key={index} value={d._id}>{d.name}</Option>)
    });

    // console.log("rendering for status:"+JSON.stringify(this.props.task.status))

    // console.log("this.props.class: " + (this.props.class ? this.props.class : ""))
    // const reporter=(this.props.members.filter(i=>i.user_id._id==this.props.task.owner_id)[0])
    // console.log(reporter)
    return (
      <div style={{ display: "flex", height: "100vh", flexDirection: "column", justifyContent: "space-between",background: (localStorage.getItem('theme') == 'dark' && "#1f1f1f") }}>
        <Modal
          className="sidebar_dropdown"
          // title="Confirm Task Archival"
          visible={this.state.archiveConfirmModal}
          onOk={this.task_archiveOnConfirm}
          onCancel={this.task_archiveHideConfirmModal}
          okText="Yes"
          // cancelText="No"
          okType='danger'
        >
          <p>Are you sure you want to archive this task?</p>
        </Modal>

        <Modal
          className="sidebar_dropdown"
          // title="Confirm Task Deletion"
          visible={this.state.deleteConfirmModal}
          onOk={this.task_deleteOnConfirm}
          onCancel={this.task_deleteHideConfirmModal}
          okText="Yes"
          // cancelText="No"
          okType='danger'
        >
          <Title level={4}>Are you sure you want to delete this task?</Title>
        </Modal>

        {this.state.isTaskAttachView ?
          <Fragment>
            <div style={{ padding: 16,/* borderBottom: '1px solid #e9e9e9'*/ }}>
              <Row style={{ marginTop: "2px" }}>
                <Col span={3} align="left">
                  <ArrowLeftOutlined onClick={this.attachmentToggleView} />
                </Col>
                <Col span={17} align="left">
                  {/* <div className="sidebar_attach_count" style={{ width: "80%" }}> */}
                  <Text type="secondary" strong>
                    {this.props.task.files ? (this.props.task.files.length + " files") : ""}
                  </Text>
                  {/* </div> */}
                </Col>
                <Col span={4} align="right">
                  <Button type="link" size="small" style={{ marginLeft: "4px" }} onClick={this.closeSidebar}><CloseOutlined  style={{color:localStorage.getItem("theme") ==  "dark" && "rgba(255, 255, 255, 0.65)"}}/></Button>
                </Col>
              </Row>
            </div>
            <Divider style={{ margin:'0'}}/>
            <div className="attachment_sidebar_container">
              <AddTaskFile
                style={{ marginBottom: "5px" }}
                dropdownToggleForAdd={this.attachmentDropdownToggleForAdd}
                task={this.props.task} />
              <br />
              {this.props.task.files &&
                this.props.task.files.map((file, index) => (
                  <DropDownAttachment
                    downloadFile={this.attachment_downloadFile}
                    file={file}
                    deleteFile={() => this.attachmentDeleteFile(file._id)}
                  />
                ))}
            </div>
          </Fragment>
          : (
            <Fragment>
              <div style={{ padding: 16, /*borderBottom: '1px solid #e9e9e9',*/ }}>
                <Row style={{ marginTop: "2px" }}>
                  <Col span={14} align="left">
                    <Text type="secondary" strong={true}>
                      {this.props.project.name !== undefined ? this.truncDesc(this.props.project.name) : ""} / </Text><Text strong={true}>  {currentTask.key ? currentTask.key : this.truncTitle(currentTask.name || "")}
                    </Text>
                  </Col>
                  <Col span={10} align="right">
                    <Badge dot={hasFiles}>
                      <Button
                        size="small"
                        // shape="square"
                        icon={<PaperClipOutlined />}
                        onClick={this.attachmentToggleView}
                      // style={{display:"none"}} 
                      />
                    </Badge>
                    <Dropdown overlayClassName="sidebar_dropdown" overlay={(
                      <Menu>
                        {/* <Menu.Item>   
              <Icon type="share-alt" />  Share
            </Menu.Item> */}
                        {/* {this.state.currentUserFollow} */}
                        <Menu.Item id="Popover-followers" onClick={this.followersAddOrRemove}>
                          <EyeOutlined /> {a ? "Unfollow Task" : "Follow Task"}
                        </Menu.Item>
                        <Menu.Item onClick={this.task_archiveShowConfirmModal}>
                          <DeleteOutlined />  Archive Task
                        </Menu.Item>
                        <Menu.Item onClick={this.task_deleteShowConfirmModal}>
                          <CloseOutlined />   Delete Task
                        </Menu.Item>
                      </Menu>
                    )} placement="bottomCenter" style={{ width: "25%" }}>
                      <Button type="link" size="small" style={{ marginLeft: "4px" }}><MoreOutlined style={{color:localStorage.getItem("theme") ==  "dark" && "rgba(255, 255, 255, 0.65)"}} /></Button>
                    </Dropdown>
                    <Button type="link" size="small" style={{ marginLeft: "4px" }} onClick={this.closeSidebar}><CloseOutlined style={{color:localStorage.getItem("theme") ==  "dark" && "rgba(255, 255, 255, 0.65)"}} /></Button>
                  </Col>
                </Row>
              </div>
              <Divider style={{ margin:'0' }} />
              <div style={{ minHeight: 0, display: "flex", flexDirection: "column", flexGrow: 10 }}>
                <div style={{ minHeight: 0, padding: "8px 24px", overflowY: "scroll", overflowX: "hidden", width: "100%" }}>
                  <Row style={{ marginBottom: 4 }}>
                    <Col align="left" span={24}>
                      <div className="tasksidebar__title">
                        <TextArea
                          className={localStorage.getItem('theme') == 'dark' ?"taskAttribSelector_title_dark":'taskAttribSelector'}
                          placeholder="Task title goes here.."
                          value={this.state.name}
                          onChange={this.task_titleOnChange}
                          // onPressEnter={this.onSubmitName}
                          autoSize={{ minRows: 1, maxRows: 16 }}
                          style={{
                            // negative margin to align internal text left
                            marginLeft: "-12px",
                            resize: "none",
                            height:'30px'
                          }}
                          
                        // defaultValue={currentTask.name}
                        />

                      </div>
                      <span ></span>

                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 4,marginLeft:'-12px' }}>
                    <br />
                    {/* <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Description</Text>
                    </Col> */}
                    <Col align='left' span={24}>
                      <div className={"tasksidebar__title tasksidebar__desc"} style={{ marginBottom: "4px",border:'none' }}>
                        {/* <TextArea
                          className="taskAttribSelector "
                          placeholder="Empty"
                          value={this.state.desc}
                          onChange={this.task_descOnChange}
                          // onPressEnter={this.onSubmitName}
                          autoSize={{ minRows: 1, maxRows: 32 }}
                          style={{
                            // width: "80%",
                            // paddingRight: "6px",
                            resize: "none"
                          }}
                        // defaultValue={currentTask.desc}
                        /> */}
                        <TextInput />

                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 4 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Status</Text>
                    </Col>
                    <Col span={18}>
                      <Select
                        className={localStorage.getItem('theme') == 'default' ? "taskAttribSelector":' taskAttribSelector_dark'}
                        dropdownClassName="sidebar_dropdown"
                        onChange={e => this.task_statusOnChange(e)}
                        value={this.props.task.status ? this.props.task.status._id ? this.props.task.status._id : this.props.task.status : ""}
                        style={{ width: "60%" }}
                      >
                        {status_options}
                      </Select>
                    </Col>
                    {/* } */}

                  </Row>
                  <Row style={{ marginBottom: 4 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Assignee</Text>
                    </Col>
                    <Col span={18}>
                      <Select
                        className={localStorage.getItem('theme') == 'default' ? "taskAttribSelector":' taskAttribSelector_dark'}
                        placeholder="Empty"
                        dropdownClassName="sidebar_dropdown"
                        onSelect={this.task_assigneeOnChange}
                        allowClear={true}
                        onChange={this.task_assigneeonDelete}
                        // defaultValue={this.props.task.user_id && this.props.task.user_id.name}
                        value={this.props.task.user_id && (this.props.task.user_id.displayName||this.props.task.user_id.name)}
                        style={{ width: "60%" }}
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {assignee_options}
                      </Select>

                    </Col>
                  </Row>

                  {/* <Row style={{ marginBottom: 4 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Reporter</Text>
                    </Col>
                    <Col span={18}>
                      <Input
                        // className="taskAttribSelector"
                        // placeholder="Empty"
                        // dropdownClassName="sidebar_dropdown"                                             
                        value={reporter!==undefined?reporter.user_id.name:this.props.task.owner_id.name}
                        style={{ width: "60%" }}
                       
                      >                       
                      </Input>
                    </Col>
                  </Row> */}

                  <Row style={{ marginBottom: 4 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Start Date</Text>
                    </Col>

                    <Col 
                    className={localStorage.getItem('theme') == 'default' ? "taskAttribSelector":'taskAttribSelector_dark'}
                     span={11}
                    // style={{width:'20vw'}}
                     >
                      <DatePicker
                        disabledDate={this.task_disabledStartDate}
                        dropdownClassName="sidebar_dropdown"
                        value={this.props.task.start_at && moment(this.props.task.start_at)}
                        style={{ marginBottom: "4px", marginRight: "4px", color: "#ccc" }}
                        placeholder="Empty"
                        onChange={this.task_startDateOnChange}
                        style={{ width: "100%", }}
                        bordered={false}
                      >
                      </DatePicker>
                    </Col>

                  </Row>
                  <Row style={{ marginBottom: 4 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>End Date</Text>
                    </Col>

                    <Col 
                    className={localStorage.getItem('theme') == 'default' ? "taskAttribSelector":'  taskAttribSelector_dark'} 
                    span={11}
                    >
                      <DatePicker
                        disabledDate={this.task_disabledEndDate}
                        dropdownClassName="sidebar_dropdown"
                        value={this.props.task.due_on && moment(this.props.task.due_on)}
                        style={{ marginBottom: "4px" }}
                        placeholder="Empty"
                        onChange={this.task_endDateOnChange}
                        style={{ width: "100%" }}
                        bordered={false}
                      >
                      </DatePicker>
                    </Col>

                  </Row>
                  <Row style={{ paddingBottom: 8 }}>
                    <Col span={6} align="left" style={{ lineHeight: "32px" }}>
                      <Text strong>Labels</Text>
                    </Col>
                    <Col span={18}>
                      {(this.props.task.tag_id && this.props.task.tag_id.length > 0 && (this.props.task.status)) ?
                        this.props.task.tag_id.map((tag) => (
                          <Tag closable={true} color={tag.color} key={tag._id} onClose={(e) => { this.label_remove(tag._id) }} style={{ margin: "4px" }} >{tag.name}</Tag>
                        ))
                        : null}         
                <CustomPopOver
                  // members={this.props.tags}
                  members = {this.props.tags && this.props.tags.length > 0 ? this.props.tags.sort(this.dynamicSort('name')) : []}
                  dropdownOpen={this.state.tagsHeaderPopoverOpen}
                  popoverType="tag"
                  toggleDropDown={this.labelsShowModal}
                  data={this.props.task}
                  workspaceTags={this.props.tags}
                  location={this.showTags}
                  popoverButtonId={"tag_popover_loc"}
                  tagsHeaderPopover={this.state.tagsHeaderPopoverOpen}
                  removeTag={this.label_remove}
                >
                  <Button size={"small"} id="tag_popover_loc" type={"dashed"} 
                    onClick={this.labelsShowModal} style={{ margin: "3px",background:(localStorage.getItem('theme') == 'dark' && '#1f1f1f') }}><PlusOutlined /></Button>
                </CustomPopOver>
                    </Col>
                  </Row>
                  <Divider style={{ marginBottom: "12px", marginTop: "12px", width: "100%" }} />
                  {/* <div style={{padding:"22px"}}> */}
                  <Row>
                    <Col span={24} align="left">
                      <div style={{ width: "60%", display: "flex", flexDirection: "row", justifyContent: "flex-start", lineHeight: "14px", marginBottom: 8 }}>
                        <div style={{ paddingRight: 16 }}>
                          <Text strong>Subtasks</Text>
                        </div>
                        {this.props.taskCheckListItems.length > 0 ?
                          // style={{paddingTop:"5px"}}
                          // <Progress type="circle" width={70} percent={progresspercent} />
                          <Progress percent={progresspercent} size="small" />
                          : null}
                      </div>
                      <div>
                        {this.props.task.status !== undefined &&
                          this.props.taskCheckListItems !== undefined &&
                          this.props.taskCheckListItems.map((item, index, arr) => {
                            // console.log("rendering subtask:"+item.name+" ("+item._id+")")
                            return (
                              <div
                                className="subTaskGrp"
                                style={{ minWidth: "100%", display: "flex", marginBottom: "4px", alignItems: "baseline" }}
                              >
                                <Checkbox
                                  style={{ paddingRight: "6px" }}
                                  // item={item}
                                  // key={item._id}
                                  checked={item.status}
                                  className="subTaskCheck"
                                  onChange={(e) => { this.subtaskUpdateStatus(e, item._id) }}
                                />
                                <TextArea
                                  // autoFocus
                                  autoSize={{ minRows: 1, maxRows: 16 }}
                                  // className={"taskAttribInputSelector"}
                                  className={localStorage.getItem("theme") == "dark" ? "taskAttribInputSelector_dark" : "taskAttribInputSelector"}
                                  size="small"
                                  style={{
                                    width: "95%",
                                    paddingRight: "4px",
                                    resize: "none",
                                    // paddingLeft:0
                                  }}
                                  name={"cl" + item._id}
                                  value={item.name}
                                  onChange={this.subtaskInputOnChange}
                                  defaultValue={item.name}
                                  onPressEnter={(e) => { this.subtaskInputOnSave(e, item._id) }}
                                  onBlur={(e) => { this.subtaskInputOnSave(e, item._id) }}
                                />
                                <MinusCircleOutlined
                                  style={{ paddingLeft: "6px" }}
                                  className= "dynamic-delete-button"
                                  // className={localStorage.getItem("theme") == "default" ? "dynamic-delete-button" : "dynamic-delete-button_dark"}
                                  onClick={(e) => { this.subtaskDelete(e, item._id) }} />
                              </div>
                            );
                          }
                          )}
                        {this.state.formTaskChecklist &&
                          <div
                            className="subTaskGrp"
                            style={{ minWidth: "100%", marginBottom: "4px" }}
                          >
                            {/* <Checkbox
                                  style={{ paddingRight: "6px" }}
                                  className="subTaskCheck"
                                  onChange={(e) => { this.subtaskUpdateStatus(e) }}
                                /> */}
                            <TextArea
                              autoFocus
                              placeholder="type and press enter to save"
                              autoSize={{ minRows: 1, maxRows: 16 }}
                              className={localStorage.getItem('theme') == "dark" ? "taskAttribInputSelector_dark":"taskAttribInputSelector"}
                              size="small"
                              style={{
                                width: "90%",
                                paddingRight: "6px",
                                resize: "none"
                              }}
                              name="checkListName"
                              onChange={this.subtaskFormInputOnChange}
                              // value={item.name}
                              onPressEnter={(e) => { this.subtaskAdd(e) }}
                            />
                          </div>
                        }
                        <Button
                          size="small"
                          type="dashed"
                          onClick={this.subtaskShowForm}
                          // style={{ width: "60%" }}
                          style={{ margin: '12px',background:(localStorage.getItem('theme') == 'dark' && '#1f1f1f') }}
                        >
                          <PlusOutlined />{" "}
                          <Text type="secondary">Add Subtask</Text>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Divider style={{ marginBottom: "12px", marginTop: "12px", width: "100%" }} />
                  <Row>
                    <Col>
                      {/* <Title level={4}>Comments and Activities</Title>
                  <br /> */}
                   <div className="suggestinsbox">
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ marginRight: "8px" }}>

                    {this.props.user_now.profilePicUrl ?
                      <Avatar src={`${this.props.user_now.profilePicUrl}?_=${(new Date()).getTime()}`} />
                      : <Avatar >{(this.props.user_now.displayName||this.props.user_now.name) ? this._getInitials(this.props.user_now.displayName||this.props.user_now.name) : this._getInitials("Troopr User")}</Avatar>}

                  </div>
                  <div className={localStorage.getItem('theme' == 'default' ? "tasksidebar_addcomment_container" : '')} style={{ flexGrow: 1}}>
                    <div>
                    <Editor
                      blockStyleFn={"taskSidebar_commentEditor"}
                      editorState={this.state.editorState}
                      onChange={this.comment_OnChange}
                      plugins={this.plugins}
                      handleKeyCommand={this.taskCommentKeyCommand}
                      keyBindingFn={this.taskCommentKeyBindingFn}
                      style={{ marginTop: "-12px", marginLeft: "-6px",maxWidth:"330px" }}
                      placeholder="Write a comment"
                      ref={element => {
                        this.editor = element;
                      }}
                    />
                    </div>
                    <div>
                      <MentionSuggestions className="MentionSuggestions"
                      style={{maxHeight:"180px"}} 
                      onSearchChange={this.onSearchChange}
                      suggestions={this.state.suggestions}
                      onAddMention={this.onAddMention}
                      />
                    </div>
                      {/* <InlineToolbar >
                        {
                          (externalProps) => (
                            <div >
                              <BoldButton {...externalProps} />
                              <ItalicButton {...externalProps} />
                              <UnderlineButton {...externalProps} />
                              <linkPlugin.LinkButton {...externalProps} />
                            </div>
                          )
                        }
                      </InlineToolbar> */}
                  </div>
                  </div>
                  <Divider style={{ marginBottom: "12px", marginTop: "12px", width: "100%" }} />
                  </div>
                      <div className="task_activity">
                        <div className="task_activity_heading">
                          <Text strong style={{ padding: "6px 0px" }}>Comments and Activities | </Text>
                          <Text type="secondary">
                            <a onClick={() => this._toggleActivity(this.props.task._id)}>
                              {this.state.show_activity
                                ? "Hide activity"
                                : "Show activity"}
                            </a></Text>
                        </div>
                        {/* comments */}
                        <div>{this._renderActivities()}</div>
                        <div
                          ref={lastComment => {
                            this.lastComment = lastComment;
                          }}
                        />
                      </div>

                    </Col>
                  </Row>
                </div>
              </div>
              <Divider  style={{margin:'0'}} />
              <div style={{
                width: '100%',
                // borderTop: '1px solid #e9e9e9',
                padding: '0px 24px 8px 24px',
                // flexGrow: 1
              }}>
                {/* <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ marginRight: "8px" }}>

                    {this.props.user_now.profilePicUrl ?
                      <Avatar src={`${this.props.user_now.profilePicUrl}?_=${(new Date()).getTime()}`} />
                      : <Avatar >{this.props.user_now.name ? this._getInitials(this.props.user_now.name) : this._getInitials("Troopr User")}</Avatar>}

                  </div>
                  <div className={localStorage.getItem('theme' == 'default' ? "tasksidebar_addcomment_container" : '')} style={{ flexGrow: 1 }}>
                    <Editor
                      blockStyleFn={"taskSidebar_commentEditor"}
                      editorState={this.state.editorState}
                      onChange={this.comment_OnChange}
                      plugins={plugins}
                      handleKeyCommand={this.taskCommentKeyCommand}
                      keyBindingFn={this.taskCommentKeyBindingFn}
                      style={{ marginTop: "-12px", marginLeft: "-6px" }}
                      placeholder="Write a comment"
                      ref={element => {
                        this.editor = element;
                      }}
                    />
                      {/* <InlineToolbar >
                        {
                          (externalProps) => (
                            <div >
                              <BoldButton {...externalProps} />
                              <ItalicButton {...externalProps} />
                              <UnderlineButton {...externalProps} />
                              <linkPlugin.LinkButton {...externalProps} />
                            </div>
                          )
                        }
                      </InlineToolbar> */}
                  {/* </div>
                </div> */}
              </div> 

              {/* {this.props.task.status && this.state.tagsHeaderPopoverOpen ? (
                <CustomPopOver
                  title={"Add a Label"}
                  members={this.props.tags}
                  dropdownOpen={this.state.tagsHeaderPopoverOpen}
                  popoverType="tag"
                  toggleDropDown={this.labelsShowModal}
                  data={this.props.task}
                  workspaceTags={this.props.tags}
                  location={this.showTags}
                  popoverButtonId={"tag_popover_loc"}
                  tagsHeaderPopover={this.state.tagsHeaderPopoverOpen}
                  removeTag={this.label_remove}
                />
              ) : null} */}
            </Fragment>)
        }
      </div>
    );
  }
}

TaskSidebar.propTypes = {
  setShow: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  channels: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
  taskMove: PropTypes.func.isRequired,
  setSidebar: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  archiveTask: PropTypes.func.isRequired,
  getMembers: PropTypes.func.isRequired,
  user_now: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  // console.log(state)
  // console.log("state", state.common_reducer.user);
  //reducers
  return {
    section: state.section,
    tasks: state.task.tasks,
    task: state.task.task,
    members: state.projectMembership.members,
    channels: state.sidebar.channels,
    messages: state.sidebar.messages,
    activities: state.sidebar.activities,
    taskEmailRelation: state.sidebar.relation,
    user_now: state.common_reducer.user,
    tags: state.tags.tags,
    projects: state.projects.projects,
    workspaces: state.common_reducer.workspaces,
    sections: state.section,
    taskCheckListItems: state.sidebar.checkListItems,
    taskComments: state.sidebar.comments,
    project: state.projects.project,
    workspace: state.common_reducer.workspace,
    statuses: state.statuses,
    user: state.skills.user,
    workspaceMembers: state.skills.members

  };
}

export default withRouter(
  //actions
  connect(
    mapStateToProps,
    {
      getProject,
      updateTask,
      taskMove,
      getTaskFile,
      deleteTask,
      archiveTask,
      getActivities,
      addFollowers,
      removeFollowers,
      setSidebar,
      getMembers,
      getTag,
      removeAssignee,
      deleteTaskTag,
      // getProfileinfo,
      deleteTaskFile,
      addChecklistItem,
      getChecklistItems,
      updateChecklist,
      deleteCheckListItem,
      // taskDeletedToaster,
      addCustomAttribute,
      // setAttachmentsToaster,
      addTaskComment,
      getTaskComment
    }
  )(TaskSidebar)
);