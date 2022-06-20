import React, { Component } from "react";
import { connect } from "react-redux";
import { getEpics } from "../skillBuilderActions";
import { withRouter } from "react-router-dom";
import { Select, Spin } from "antd";
const { Option } = Select;

class EpicSelect extends Component {
  state = {
    fetching: false,
    [this.props.field.key]: [],
    done:false
    
  };

  componentDidMount = () => {
    this.setState({ fetching: true });
    this.props.getEpics(this.props.match.params.wId, "").then(data => { 
      this.setState({ fetching: false });
    });
  };

  getOptions = () => {
    let keyArr = {};
    let selectArr = [];
    this.props.epics.forEach(item => {
      if (!keyArr[item.key]) {
        keyArr[item.key] = item.key;

        selectArr.push(
          <Option key={item.id} value={item.key}>
            {"(" + item.key + ") " + item.fields.summary}
          </Option>
        );
      }
    });

    return selectArr;
  };

  onSearch = val => {
    this.setState({ fetching: true });
    this.props.getEpics(this.props.match.params.wId, val).then(data => {
      this.setState({ fetching: false });
    });
  };

  onChange = value => {
    // console.log(value)
    this.props.data[this.props.field.key] = value;
    // console.log(this.props.data)
    this.setState({
      [this.props.field.key]: value
    });
  };

  render() {
 
if(!this.state.done&&this.props.data&&this.props.data.epicIds){
  this.setState({[this.props.field.key]:this.props.data.epicIds,done:true})
}

  


    return (
      <div>
        {this.props.field.label}

        <Select
          showSearch
          style={{ width: "100%" }}
          name={this.props.template.key}
          placeholder="Select a value"
          mode="multiple"
          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
          value={this.state[this.props.field.key]}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.onSearch}
          filterOption={(input, option) => {
            // console.log(option)
            if (typeof option.props.children == "string") {
              return (
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              );
            } else {
              return (
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              );
            }
          }}
        >
          {this.getOptions()}
        </Select>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    epics: state.skill_builder.epics
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getEpics
  })(EpicSelect)
);
