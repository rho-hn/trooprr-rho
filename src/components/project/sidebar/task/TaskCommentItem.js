import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteTaskComment } from '../sidebarActions.js'
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import moment from 'moment';
import Linkify from 'react-linkify';
import { EditorState, convertFromRaw, ContentState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createLinkPlugin from 'draft-js-anchor-plugin';
import createMentionPlugin from "draft-js-mention-plugin";
import "../../../../../node_modules/draft-js-mention-plugin/lib/plugin.css";
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { CompositeDecorator } from "draft-js";
import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Typography, Tooltip } from "antd";
import linkStyles from './linkStyles.module.css';
import mentionsStyles from './mentionsStyles.module.css';



const { Text } = Typography;

const mentionPlugin = createMentionPlugin({
  theme:mentionsStyles,
  mentionRegExp:/[@]/g
});

// 
const linkPlugin = createLinkPlugin({
  theme: linkStyles
})




// 
const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });
const plugins = [mentionPlugin, linkifyPlugin];


const myFunctionForGrabbingAllPluginDecorators = () => {
  // I can't quite remember why I had to wrap things in this exact way, but found that I ran into
  // errors if I did not both have a MultiDecorator and a CompositeDecorator wrapping
  // This MultiDecorator can now be used as shown in my previous post.
  return new MultiDecorator(
    [new CompositeDecorator(getPluginDecoratorArray())]
  );
}

const getPluginDecoratorArray = () => {
  let decorators = [];
  let plugin;
  // check each plugin that will be used in the editor for decorators
  // (retrieve listOfPlugins however makes sense in your code)
  for (plugin of plugins) {
    if (plugin.decorators !== null && plugin.decorators !== undefined) {
      // if the plugin has any decorators, add them to a list of all decorators from all plugins
      decorators = decorators.concat(plugin.decorators);
    }
  }
  return decorators;
}




class TaskCommentItem extends Component {
  constructor(props) {
    super(props);
    var contentState = "";
    // let commentText = this.props.item.text + ".";
    // console.log("this.props.item.text=====>",this.props.item.text)
    if (this.IsJsonString(this.props.item.text)) {
      // console.log("this is inside tghe if content state")
      contentState = convertFromRaw(
        JSON.parse(this.props.item.text)
      );
    } else {
      // console.log("this is inside else content state")

      contentState = ContentState.createFromText(
        this.props.item.text
      );
    }

    this.deleteComment = this.deleteComment.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this._getInitials = this._getInitials.bind(this);


    let decorator = myFunctionForGrabbingAllPluginDecorators();
    this.state = {
      dropdownOpen: false,
      editorState: EditorState.createWithContent(contentState, decorator)
    }
  }


  IsJsonString(str) {
    if (isNaN(str)) {
      try {
        // console.log("try method")
        JSON.parse(str);
        // console.log("JSON.parse(str)",JSON.parse(str))

      } catch (e) {
        // console.log("catch method",e)
        console.error(e)
        return false;
      }
      // console.log("true=====>")

      return true;
    }
    else {
      return false;
    }
  }


  dropdownToggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount() {
  }

  deleteComment(id) {
    this.props.deleteTaskComment(this.props.wId, id).then(res => {
      if (res.data.success) {
        this.setState({
          dropdownOpen: false
        });
      }
    });
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

  render() {
    const { member, item, user } = this.props;
    // console.log("Props from Comment------>",item);
    return (
      <div key={this.props.key} className="task_activity_item">
        <Linkify>
          <div style={{ paddingRight: 12 }}>
            {member ? (
              member.user_id.profilePicUrl ? (
                <Avatar src={member.user_id.profilePicUrl} />
              ) : (
                  <Avatar>{this._getInitials(member.user_id.displayName||member.user_id.name)}</Avatar>
                )
            ) : (item.created_by.profilePicUrl ? (
              <Avatar src={item.created_by.profilePicUrl} />
            ) : (<Avatar>{this._getInitials(member.user_id.displayName||item.created_by.name)}</Avatar>)
              )}
          </div>
          <div className="activity_item_right_box">
            <div style={{ marginBottom: 2, lineHeight: "12px" }}>
              <Text type="secondary" strong className="task_actor">
                {/* {member.user_id.displayName||item.created_by.name} */}
                {member&&member.user_id&&member.user_id.displayName ? member.user_id.displayName : item.created_by && item.created_by.name ? item.created_by.name : ''}
              </Text>
              <Text type="secondary">
                {(new Date(item.created_at)).isAfter ? moment().fromNow() : moment(new Date(item.created_at)).fromNow()}
              </Text>
              {user._id == item.created_by._id && (
                <Tooltip title="Remove this comment">
                  <DeleteOutlined
                    className="taskSidebar_deleteComment"
                    onClick={() => { this.deleteComment(item._id) }} />
                </Tooltip>
              )}
            </div>
            <Editor
              editorState={this.state.editorState}
              plugins={plugins}
            // readOnly
            />
          </div>
        </Linkify>
      </div>
    );
  }
}

TaskCommentItem.propTypes = {
  user: PropTypes.object.isRequired,
  deleteTaskComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  let propsObj = {
    user: state.common_reducer.user,
    usew: state.common_reducer.user,
  }
  // console.log("propsObj:" + JSON.stringify(propsObj))
  return propsObj;
}


export default connect(mapStateToProps, { deleteTaskComment })(TaskCommentItem);