import React, { Component, createClass } from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import close from '../../../../media/shape-copy-13.svg';
import { addTaskTag, deleteTaskTag, addTaskMyTag,deleteMyTaskTag } from './TagAction';



var _ENTER = 13;
var _COMMA = 188;
var _BACKSPACE = 8; 
class Tag extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
       e.stopPropagation();
        this.props.removeTag(this)
    }
    render() {
        return <li key={this.props.key} className={classnames("d-flex", [this.props.tag.color])} > <div className="tag_name">{this.props.tag.name} </div><img className="tag_img" src={close} onClick={this.handleClick} /> </li>;
    }
}
class TagList extends Component {
    render() {
        var self = this;
        var tags = this.props.tags.map(function (tag, i) {
            return <Tag key={tag._id} tag={tag} removeTag={self.props.removeTag} />;
        });
        return <ul className="tagUl" >{tags} </ul>;
    }
}
class TagForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: this.getSuggestions(''),
            name: ''
        }
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.addTag = this.addTag.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
    }
    escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    getSuggestions(value) {
        const escapedValue = this.escapeRegexCharacters(value.trim());
        const regex = new RegExp('\\b' + escapedValue, 'i');
        return this.props.workspaceTags.filter(wt => regex.test(wt.name));
    }
    handleKeyUp(e) {
        var key = e.keyCode;
        if (key === _ENTER || key === _COMMA) {
            this.addTag(this.state.name);
        }
    }
    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    }
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: this.getSuggestions('')
        });
    }

    getSuggestionValue(suggestion) {
        return suggestion;
    }

    renderSuggestion(suggestion, { query }) {
        return (
            <div className="d-flex suggestion-content suggestion-sidebar  ">
                <div className="member-info">
                    <h5>{suggestion.name}</h5>
                </div>
            </div>
        );
    }

    addTag(name) {
        var tag = name.trim();
        tag = tag.replace(/,/g, '');
        if (!tag) return;
        this.props.addTag(tag);
        this.setState({ name: '' })
    }
    onChangeName(e, { newValue, method }) {

        if (method === 'click') {
            this.addTag(newValue.name);
        } else
            this.setState({ name: e.target.value });
    }

    render() {
        const inputProps = {
            type: "text",
            placeholder: "Add tag...",
            ref: "tag",
            className: "tag-input",
            onKeyUp: this.handleKeyUp,
            onChange: this.onChangeName,
            value: this.state.name,
            onBlur:this.props.onBlur,
            autoFocus:true
        };
        return <div><Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps} />
        </div>
    }
}
class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            hide: false,
            addTag:false,
        }
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.click = this.click.bind(this);
        this.change = this.change.bind(this);
        this.toggle=this.toggle.bind(this);
        this.onBlur=this.onBlur.bind(this);
    }
toggle(){
this.setState({addTag:true})

}
onBlur(){
this.setState({addTag:false})

}
    componentDidMount() {
        
        var _tags = this.props.data.tag_id
        this.setState({ data: _tags });
    }

    addTag(tag) {
        var tags = this.state.data;
        var newTags = tags.concat([tag]);
        if (this.props.location) {
            if (this.props.data.status) {
                this.props.addTaskMyTag({
                    "name": tag,
                    "color": "tag_blue",
                    "owner_id": this.props.data.status.project_id.workspace_id._id,
                    "task_id": this.props.data._id
                });
            }
            else {
                this.props.addTaskMyTag({
                    "name": tag,
                    "color": "tag_blue",
                    "owner_id": this.props.data.user_id._id,
                    "task_id": this.props.data._id
                });
            }
        }
        else {
            this.props.addTaskTag({
                "name": tag,
                "color": "tag_blue",
                "owner_id": this.props.data.status.project_id.workspace_id._id,
                "task_id": this.props.data._id
            });
        }
        this.setState({ data: newTags });
    }

    removeTag(tag) {
if (this.props.data.status) {
        this.props.deleteTaskTag({
            id: tag.props.tag._id,
            task_id: this.props.data._id
        })
    }else{
        this.props.deleteMyTaskTag({
            id: tag.props.tag._id,
            task_id: this.props.data._id
        })
            }

    }
    change() {
        this.setState({ hide: false })
    }
    click() {
        if (this.state.hide === false) {
            this.setState({ hide: true })
        }
    }
    render() {
        return (


           <div className={classnames("tags_container", { "active" :this.state.addTag})} onClick={this.toggle}>
                <div className="tags">
                 {this.props.data.tag_id.length > 0 ?<TagList tags={this.props.data.tag_id} removeTag={this.removeTag} />:!this.state.addTag && <div> add tag</div>}
                    {this.state.addTag && <TagForm addTag={this.addTag} workspaceTags={this.props.workspaceTags} onBlur={this.onBlur}/>}
                </div>
            </div>

        );
    }
}

function mapStateToProps(state){
  return{
    isTag: state.tags.showTags  
  }
}

export default connect(null, { addTaskTag, deleteMyTaskTag,deleteTaskTag, addTaskMyTag })(Tags);
