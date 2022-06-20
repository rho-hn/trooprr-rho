import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


class UpsertSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      errors: {}
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  
  }
  componentDidUpdate(){
    if(!this.props.update){
      this.input.focus();
    }
  }
  componentDidMount(){
    if(!this.props.update){
      this.input.focus();
    }
  }
    
 

  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data.name)) {
      errors.name = 'This field is required';
    }

    this.setState({ errors: errors });
    return isEmpty(errors);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    const { id, updateStatus, toggle,wId ,pId} = this.props;
    // console.log(this.props)
    this.setState({ errors: {} });
    e.preventDefault();
    if (this.isValid(this.state)) {
     
  let promise={}
  if(this.props.add){
    promise= updateStatus(wId,pId, this.state)
  }else{
    promise= updateStatus(wId,pId,this.props.id, this.state)
  }
  promise.then((response) => {
        if (response.data.success) {
          if (this.props.add) {
            this.setState({ name: '' });
            
          }
          if (!this.props.isVisible && this.props.update) {
            toggle();
          }
        } else {
          this.setState({ errors: response.data.errors });
        }
      });
    }
  }

  onClose() {
    const { name, isVisible, toggle, add } = this.props;
    if (!isVisible) {
      if (add) {
        this.setState({ name: '' });
      } else {
        this.setState({ name: name });
      }
      toggle();
    }
  }

  render() {
    const { errors, name } = this.state;
    const { isVisible,style } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classnames('cancel',{ 'hidden-xl-down': isVisible })}>
        <div className={classnames(' form-group '+style,{ 'has-danger': errors.name })}>
          <input  type="text" onChange={this.onChange} onBlur={this.props.update ? this.onSubmit :this.onClose} value={name} name="name" className="form-control  cursor_upsert" placeholder="enter list name..." ref={input => {this.input=input}} autoComplete="off"/> 
          {errors.name && <span className="form-control-feedback">{errors.name}</span>}
        </div>
      </form>
    );
  }
}

UpsertSection.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  updateStatus: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  // toggle: PropTypes.func.isRequired,
  add: PropTypes.bool
}

UpsertSection.defaultProps = {
  name: ''
}

export default UpsertSection; 