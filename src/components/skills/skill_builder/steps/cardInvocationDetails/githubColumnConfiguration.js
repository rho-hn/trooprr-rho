import React, { Component } from "react";
import {
  getProjectColumns,
  getOrgAndRepoProject
} from "../../../github/gitHubAction";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Select, Row } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
const { Option } = Select;
class GithubColumnConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project_column: {},
      project: {}
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getOrgAndRepoProject(this.props.match.params.wId);
    if (this.props.mode !== "save") {
    this.props.template.meta.type !== "issues_by_graph"&&this.props.getProjectColumns(this.props.match.params.wId,this.props.data.cardInformation.cardInformation.project.id)
    
    this.setState({
        project_column: {
          ...this.props.data.cardInformation.cardInformation.project_column
        },
        project: { ...this.props.data.cardInformation.cardInformation.project }
      });  
  } else{
    if(this.props.data){  
        this.setState({...this.props.data.cardInformation.cardInformation})
    }
 
 }

  }
  onChange(value, data, type) {
      let empty;
      this.setState({[type]:{name:data.props.children,id:value}})
    
    if(type==="project"){
        this.props.template.meta.type !== "issues_by_graph"  &&this.props.getProjectColumns(this.props.match.params.wId,value)
    this.props.form.setFieldsValue({
        column:empty
    })
}

    
  }
  onAdd = () => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let data = Object.assign({}, this.state);

        this.props.data.cardInformation.card_template_id = this.props.template._id;
        this.props.data.cardInformation.key = this.props.template.key;
        this.props.data.cardInformation.cardInformation = data;
        this.props.nextStep();
      }
    });
  }

  render() {
    const { columns, orgrepoProjects } = this.props;
    const { getFieldDecorator} = this.props.form;
    return (
      <Form layout="vertical">
        <br />

        <Form.Item label="Select A Project">
          {getFieldDecorator("project", {
            rules: [{ required: true, message: "Field is Required" }],
            onChange: (value, data) => this.onChange(value, data, "project"),
            initialValue: this.state.project.id
          })(
            <Select showSearch placeholder="Select a project">
              {orgrepoProjects.map(item => (
                <Option key={item.id} value={item.id} number={item.number}>
                  {`${item.parentName}/${item.name}`}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        {this.props.template.meta.type !== "issues_by_graph" && (
          <Form.Item label="Select A Column">
            {getFieldDecorator("column", {
              rules: [{ required: true, message: "Field is Required" }],
              onChange: (value, data) =>
                this.onChange(value, data, "project_column"),
              initialValue: this.state.project_column.id
            })(
              <Select showSearch placeholder="Select a column">
                {columns.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )}
        <Row type="flex" justify="end">
          <Button onClick={this.onAdd} type="primary">
          {this.props.skill_type==="app_home"?this.props.mode === "edit" ? "Update" : "Save":"Next"}  {" "}
          </Button>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    columns: state.github.columns,
    orgrepoProjects: state.github.orgrepoProjects
  };
};

export default withRouter(
  connect(mapStateToProps, { getProjectColumns, getOrgAndRepoProject })(
    Form.create({ name: "step_open" })(GithubColumnConfiguration)
  )
);
