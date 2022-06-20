import React from "react";
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
import PropTypes from "prop-types";
import { ItalicButton, BoldButton, UnderlineButton } from 'draft-js-buttons';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
// import "./editorStyle.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css"
import 'draft-js-mention-plugin/lib/plugin.css';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import {
    updateTask,
} from "../../tasks/task/taskActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {Button,Tooltip } from "antd";
import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';
import linkStyles from './linkStyles.module.css';
import { stateToMarkdown } from "draft-js-export-markdown";
import {stateFromMarkdown} from 'draft-js-import-markdown';
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import mentionsStyles from './mentionsStyles.module.css';
import mentionsStylesDefault from './defaultMentions.module.css';
const linkPlugin = createLinkPlugin({
    theme: linkStyles,
    linkTarget: "_blank",
    placeholder:'Enter url and press enter'
});

const inlineToolbarPlugin = createInlineToolbarPlugin({
    theme: { buttonStyles, toolbarStyles }
});
// const mentionPlugin = createMentionPlugin()
const { InlineToolbar } = inlineToolbarPlugin;

// const plugins = [linkPlugin, inlineToolbarPlugin]

class TextInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            editorState: !this.props.task.desc ? EditorState.createEmpty() : this.getDesc(),
            cs: "",
            ro: true,
            linkPlugin: "",
            textLength:!this.props.task.desc ?0:1,
            suggestions:this.getMentions()
        };
        this.mentionPlugin = localStorage.getItem('theme') === 'default' ? createMentionPlugin({
            theme:mentionsStylesDefault
          }):createMentionPlugin({
           theme:mentionsStyles
         })
         this.plugins = [
            // this.mentionMembersPlugin, 
            this.mentionPlugin,linkPlugin, inlineToolbarPlugin
          ];
    }
    getDesc = () => {
            try {     
                return EditorState.createWithContent((convertFromRaw(JSON.parse(this.props.task.desc))))
            } catch (error) {
                let stateFromMkdn = stateFromMarkdown(this.props.task.desc)
                let raw=convertToRaw(stateFromMkdn)
                for(let i=0;i<Object.keys(raw.entityMap).length;i++){
                    if(raw.entityMap[i].type==='LINK'&&raw.entityMap[i].data.url==='#'){
                        raw.entityMap[i].mutability="SEGMENTED";
                        raw.entityMap[i].type='mention'
                        delete raw.entityMap[i].data.url
                        raw.entityMap[i].data.mention={name:""}
                    }
                }
                let newState=convertFromRaw(raw)
                return EditorState.createWithContent(newState)
        }
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

    onChange = editorState => {
        this.setState({ editorState });
    };
    componentDidMount = () => {
        let cs = this.state.editorState.getCurrentContent()
        let ctr = convertToRaw(cs);
        if(ctr.blocks[0].text.length===0 && this.state.textLength>0){
            this.setState({textLength:0})
        }
        
            // if(JSON.parse(this.props.task.desc).blocks[0].text.length===0 && this.state.textLength===0){
            //     console.log(true)
            // }
                // this.setState({textLength:0})
             

        // this.setState({ editorState: EditorState.createEmpty() })
        // if (this.props.task.desc != null) {
        // try {

        //     this.setState({ cs: this.props.task.desc })
        //     let cs = convertFromRaw(JSON.parse(this.props.task.desc));
        //     this.setState({ editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.task.desc))) })
        //     console.log(this.state.editorState.getCurrentContent())
        // } catch (error) {
        //     console.log(this.props.task.desc)
        //     this.setState({
        //         editorState: EditorState.createWithContent(ContentState.createFromText(this.props.task.desc))
        //     })
        //     }
        // }
    }
    componentDidUpdate(prevProps, prevState) {
    
        if (prevProps.task._id !== this.props.task._id && this.props.task.desc != null) {
            try {
                this.setState({textLength:1})
                this.setState({ cs: this.props.task.desc })
                this.setState({textLength:this.props.task.desc.length})
                let editorstate=EditorState.createWithContent((convertFromRaw(JSON.parse(this.props.task.desc))))
                this.setState({
                    editorState: editorstate,
                    ro:true
                })             
            }
            
            catch (error) {
                // this.setState({ editorState: EditorState.createWithContent(stateFromMarkdown(this.props.task.desc)) ,ro:true})
                let stateFromMkdn = stateFromMarkdown(this.props.task.desc)
                let raw=convertToRaw(stateFromMkdn)
                for(let i=0;i<Object.keys(raw.entityMap).length;i++){
                    if(raw.entityMap[i].type==='LINK'&&raw.entityMap[i].data.url==='#'){
                        raw.entityMap[i].mutability="SEGMENTED";
                        raw.entityMap[i].type='mention'
                        delete raw.entityMap[i].data.url
                        raw.entityMap[i].data.mention={name:""}
                    }
                }
                let newState=convertFromRaw(raw)
                this.setState({ editorState:EditorState.createWithContent(newState) ,ro:true})
                 
             
            
            }
        }
        if (prevProps.task._id !== this.props.task._id && this.props.task.desc == null) {
            this.setState({ editorState: EditorState.createEmpty(),ro:true ,textLength:0})
        }
    }
    focus = () =>
        this.editor.focus();
    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        return (
            <div>
                
                <div className="desc-component" style={{position:"relative"}}  >
                    {
                    ! this.state.ro || (this.props.task.desc && this.props.task.desc.length>0 && this.state.textLength)?
                    <div>
                    <div className={"tasksidebar_addcomment_container"} style={{ marginBottom:'7px',flexGrow: 1,border:(this.state.ro ? "1px solid transparent": (localStorage.getItem('theme') == 'dark' ? "1px solid #434343" : "1px solid #e9e9e9") ) , borderRadius:'2px'}} >
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={this.plugins}
                        onClick={this.focus}
                        readOnly={this.state.ro}
                        style={{ marginTop: "-12px", marginLeft: "-6px", border: "none"}}
                        ref={(event) => this.editor = event}
                    />
                    <div style={{position:"absolute",marginLeft:"250px"}}>
                   <InlineToolbar >
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
                    </InlineToolbar>

                    </div>
                </div>
                <MentionSuggestions className="MentionSuggestions"
                      style={{overflow:'scroll'}} 
                      onSearchChange={this.onSearchChange}
                      suggestions={this.state.suggestions}
                      onAddMention={this.onAddMention}
                      />
                </div>
                :
                <div style={{marginLeft:'12px',marginBottom:'10px'}}>
                    {/* No description given. */}
                    </div>
                    } 
                    <div>
                        {this.state.ro ? <Button size='small' style={{marginTop:'0',marginLeft:'12px'}}onClick={() => this.setState({ ro: !this.state.ro })}>
                            <EditOutlined
                            // style={{ fontSize: '16px', marginTop: "10px" }}
                             /> 
                            {/* {this.state.textLength===0? "Add Description":"Edit Description"} */}
                            Edit Description
                            </Button>
                            :
                            <Button
                            size="small"
                            style={{marginTop:'0',marginLeft:'12px'}}
                            onClick={() => {

                                let cs = this.state.editorState.getCurrentContent()
                                let ctr = convertToRaw(cs);
                              for(var i in ctr.entityMap) {
                                    if(ctr.entityMap[i].type==='mention'){
                                        ctr.entityMap[i].type='LINK';
                                        ctr.entityMap[i].mutability='MUTABLE'
                                        ctr.entityMap[i].data={
                                            url:'#'
                                        }
                                    }
                                };
                                cs=convertFromRaw(ctr)
                                const { updateTask, task } = this.props;
                                let newTask = { ...task }
                                newTask.desc =stateToMarkdown(cs);
                                if(newTask&&newTask.desc&&newTask.desc.trim().length>0){
                               let isstringavailable=false;
                              for(let i=0;i<ctr.blocks.length;i++){
                                  if(ctr.blocks[i].text.length>0){
                                    isstringavailable=true
                                    break
                                  }
                              }
                             if(isstringavailable){this.setState({textLength:1})}else{
                                 newTask.desc=""
                             }
                                }else{
                                  
                                    
                                    this.setState({textLength:0})
                                }
                                // newTask.desc = ctr;
                                updateTask(this.props.match.params.wId, newTask, "desc").then(res => {
                                    if (res.data.success) {
                                        // this.setState({ taskname: '' });
                                this.setState({ ro: !this.state.ro })
                                    } else {
                                        // this.setState({ errors: res.data.errors });
                                    }
                                })
                            }
                        }
                            >
                             <CheckOutlined
                                // style={{ fontSize: '16px', marginTop: "10px" }}
                                 />
                                 Save
                                </Button>
                        }
                    </div>
                </div>
                <div>
                </div>
            </div>
        );
    }
}
TextInput.propTypes = {
    updateTask: PropTypes.func.isRequired
}
function mapStateToProps(state) {
    return {
        task: state.task.task,
        workspaceMembers: state.skills.members

    };
}

export default withRouter(
    //actions
    connect(
        mapStateToProps,
        {
            updateTask
        }
    )(TextInput)
);
