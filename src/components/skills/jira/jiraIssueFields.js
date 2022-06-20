import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Select, Input, DatePicker, Row, Col, Tabs, Spin, message, Checkbox } from "antd";
import { Typography } from "antd";
import { getJiraUsers, getJiraIssuePicker, getJiraIssueLinkBlocks, getTaskAssignableUsers, getJiraBoardSprint } from "../skills_action";
import { getEpics } from "../skill_builder/skillBuilderActions";
import moment from "moment";
import _ from "lodash";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

class jiraIssueFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldDefaults: {},
      jiraUsers: [],
      assignableUsers: [],
      autoCompleteData: {},
      selectedIssueTab: "",
      allIssueTypeFields: [],
      fields: [],
      fieldLoading: {},
      hiddenFields: {},
    };
  }

  componentDidMount() {
    const { channelDefault } = this.props;
    // console.log(channelDefault)
    this.props.setClick(this.saveChannelLinking);
    // this.props.project_change(this.handle_project_change);
    // this.props.issue_change(this.handle_issue_change);
    // this.props.resetFieldDefaults(this.resetFieldDefaults);
    if (channelDefault && channelDefault.link_info && channelDefault.link_info.fieldDefaults) {
      this.setState({ fieldDefaults: channelDefault.link_info.fieldDefaults });
    }
    if (this.props.linkedProject) this.getIssueFields();
  }

  componentDidUpdate(prevProps, prevState) {
    const { linkedIssue } = this.props;
    if (prevState.fields !== this.state.fields) {
      // const anyJiraUserField =
      //   this.state.fields.length > 0 &&
      //   this.state.fields.find((field) => field.schema && (field.schema.type === "user" || field.schema.items === "user"));
      // const isAssigneeField = this.state.fields.length > 0 && this.state.fields.find((field) => field.key === "assignee");
      // console.log(isAssigneeField);
      // if (anyJiraUserField) {
      //   this.getJiraUsersData('');
      // }
      // if (isAssigneeField) {
      //   this.getAssignableUsers('');
      // }

      const issueLinksField = this.state.fields.length > 0 && this.state.fields.find((field) => field.schema && field.schema.items === "issuelinks");
      if (issueLinksField) {
        this.getJiraAutoCompletionData({ field: issueLinksField, getIssueLinkBlocks: true });
      }
    }

    if (prevProps.linkedProject !== this.props.linkedProject) {
      this.getIssueFields();
      this.handle_project_change();
    }

    if (prevProps.linkedIssue !== linkedIssue) {
      this.setState({
        selectedIssueTab: linkedIssue,
        // fields: this.state.allIssueTypeFields.find((data) => data.name === linkedIssue)
        //   ? Object.values(this.state.allIssueTypeFields.find((data) => data.name === linkedIssue).fields)
        //   : [],
        fields: this.state.allIssueTypeFields.find((data) => data.name === linkedIssue)
          ? this.getFieldsWithKey(this.state.allIssueTypeFields.find((data) => data.name === linkedIssue).fields)
          : [],
      });
    }

    if (prevProps.board !== this.props.board) {
      this.resetSprintData();
    }
  }

  resetSprintData = () => {
    const { fields, fieldDefaults, selectedIssueTab } = this.state;

    const sprintField = fields.find((field) => field.schema.custom === "com.pyxis.greenhopper.jira:gh-sprint");

    if (sprintField && fieldDefaults && fieldDefaults[selectedIssueTab] && fieldDefaults[selectedIssueTab][sprintField.key]) {
      const fieldDefaults = { ...this.state.fieldDefaults };
      delete fieldDefaults[selectedIssueTab][sprintField.key];
      this.setState({ fieldDefaults });
    }
  };

  // resetFieldDefaults = () => {
  //   if (this.props.channelDefault && this.props.channelDefault.link_info && this.props.channelDefault.link_info.fieldDefaults) {
  //     this.setState({ fieldDefaults: this.props.channelDefault.link_info.fieldDefaults });
  //   } else this.setState({ fieldDefaults: {} });
  // };

  saveChannelLinking = () => {
    const { updateChannelDefaultData, channelDefault } = this.props;
    // console.log(updateChannelDefaultData)
    if (!_.isEmpty(this.state.fieldDefaults) || (!_.isEmpty(this.state.hiddenFields) && updateChannelDefaultData.link_info)) {
      updateChannelDefaultData.link_info.fieldDefaults = this.state.fieldDefaults;
      updateChannelDefaultData.link_info.hiddenFields = this.state.hiddenFields;
      //   channelDefault.link_info && channelDefault.link_info.fieldDefaults ? { ...channelDefault.link_info.fieldDefaults } : {};
      // updateChannelDefaultData.link_info.fieldDefaults[this.state.selectedIssueTab] = this.state.fieldDefaults;
    }

    this.props.saveChannelDefault(updateChannelDefaultData);
  };

  getIssueFields = () => {
    const { channelDefault, linkedProject, linkedIssue } = this.props;
    this.setState({ fieldsLoading: true });
    axios
      .get(`/bot/skill/${this.props.match.params.skill_id}/user/${this.props.user_now._id}/issueFieldsOfProject`, {
        params: {
          project_id: this.props.linkedProject,
          issueTypeName: "",
          // params : {project_id : '10026',
          // issueTypeName : 'Task'
        },
      })
      .then((res) => {
        this.setState({ fieldsLoading: false });
        if (res.data.success) {
          this.setState(
            {
              allIssueTypeFields: res.data.items.projects[0].issuetypes,
              // selectedIssueTab: res.data.items.projects[0].issuetypes[0].name,
            }
            /*           () => this.setState({ fieldsLoading: false }) */
          );
          if (channelDefault && channelDefault.link_info && channelDefault.link_info.project_id) {
            if (channelDefault.link_info.project_id === linkedProject && channelDefault.link_info.issue_id === linkedIssue) {
              const fieldsData = res.data.items.projects[0].issuetypes.find((data) => data.name === linkedIssue);
              this.setState({
                selectedIssueTab: channelDefault.link_info.issue_id,
                // fields: Object.values(fieldsData ? fieldsData.fields : []),
                fields: this.getFieldsWithKey(fieldsData ? fieldsData.fields : {}),
                hiddenFields: channelDefault.link_info.hiddenFields || {},
              });
            } else
              this.setState({
                selectedIssueTab: res.data.items.projects[0].issuetypes[0].name,
                // fields: Object.values(res.data.items.projects[0].issuetypes[0].fields),
                fields: this.getFieldsWithKey(res.data.items.projects[0].issuetypes[0].fields),
              });
          } else
            this.setState({
              selectedIssueTab: res.data.items.projects[0].issuetypes[0].name,
              // fields: Object.values(res.data.items.projects[0].issuetypes[0].fields),
              fields: this.getFieldsWithKey(res.data.items.projects[0].issuetypes[0].fields),
            });
        }
      })
      .catch((e) => {});
  };

  handle_project_change = () => {
    const { channelDefault } = this.props;
    this.setState({ fieldDefaults: {}, fields: [], allIssueTypeFields: [], hiddenFields: {} }, () => {
      if (channelDefault && channelDefault.link_info && channelDefault.link_info.project_id === this.props.linkedProject) {
        if (channelDefault.link_info.fieldDefaults) this.setState({ fieldDefaults: channelDefault.link_info.fieldDefaults });
        if (channelDefault.link_info.hiddenFields) this.setState({ hiddenFields: channelDefault.link_info.hiddenFields });
      }
    });
  };

  getFieldsWithKey = (fields) => {
    let tempArr = Object.entries(fields);
    let fieldsWithKey = tempArr.map((field) => {
      let field_obj = { ...field[1] };
      field_obj.key = field[0];
      return field_obj;
    });
    return fieldsWithKey
  }

  handle_issue_change = (key) => {

    this.setState({
      selectedIssueTab: key,
      // fields: this.state.allIssueTypeFields.find((data) => data.name === key)
      //   ? Object.values(this.state.allIssueTypeFields.find((data) => data.name === key).fields)
      //   : [],
      fields: this.state.allIssueTypeFields.find((data) => data.name === key)
        ? this.getFieldsWithKey(this.state.allIssueTypeFields.find((data) => data.name === key).fields)
        : [],
    });

    // let fieldDefaults = {...this.state.fieldDefaults};
    // if(fieldDefaults.key){

    // }else{
    // if (channelDefault && channelDefault.link_info && channelDefault.link_info.fieldDefaults) {
    //   if (channelDefault.link_info.fieldDefaults[key]) fieldDefaults = channelDefault.link_info.fieldDefaults[key];
    // }
    // }
  };

  getHeader = ({ field }) => {
    return (
      <>
        <Text type='secondary' strong>
          {field.name}
        </Text>
        <br />
      </>
    );
  };

  getSelect = ({ field }) => {
    const { autoCompleteData, fieldDefaults, fieldLoading } = this.state;
    const { boardSprints } = this.props;
    const schemaType = field.schema.type;
    const showSearch = field.schema.custom === "com.pyxis.greenhopper.jira:gh-sprint" ? false : true;
    const allowedValues = field.allowedValues || false;
    const autoCompleteUrl = field.autoCompleteUrl || false;
    let isIssueSelect = false,
      isEpicIssueSelect = false,
      isSprintSelect = false;

    isEpicIssueSelect = field.schema.custom === "com.pyxis.greenhopper.jira:gh-epic-link" ? true : false;
    isSprintSelect = field.schema.custom === "com.pyxis.greenhopper.jira:gh-sprint" ? true : false;

    const isMultiSelect =
      schemaType === "priority" ||
      schemaType === "user" ||
      // field.schema.items === 'user' ||
      schemaType === "option" ||
      schemaType === "resolution" ||
      schemaType === "issuelink" ||
      field.schema.items === "issuelinks" ||
      isEpicIssueSelect ||
      isSprintSelect
        ? false
        : true;

    const getOptions = () => {
      if (allowedValues) {
        return (
          <>
            {allowedValues.map((value) => {
              return (
                <Option key={value.id} value={value.id}>
                  {value.name || value.label || value.value || ""}
                </Option>
              );
            })}
          </>
        );
      } else if (schemaType === "user" || field.schema.items === "user") {
        return (
          <>
            {this.state[field.key === "assignee" ? "assignableUsers" : "jiraUsers"].map((user) => {
              return (
                <Option
                  key={user.accountId || user.key}
                  keyData={user.accountId || user.name} /* id={user.accountId || user.key} displayName={user.displayName || ''} */
                >
                  {user.displayName}
                </Option>
              );
            })}
          </>
        );
      } else if (autoCompleteUrl || field.key === "parent" || isEpicIssueSelect) {
        // console.log(autoCompleteData[field.key]);
        let valueName, key;
        if (field.key === "labels") {
          valueName = "label";
          key = "label";
        } else if (field.key === "issuelinks" || field.key === "parent" || isEpicIssueSelect) {
          valueName = "key";
          key = "key";
          isIssueSelect = true;
        } 
        else if (field.schema.custom === 'com.atlassian.jira.plugin.system.customfieldtypes:labels') {
          valueName = "label";
          key = "label";
        }
        else {
          valueName = "value";
          key = "id";
        }
        if (autoCompleteData[field.key] || isEpicIssueSelect) {
          const data = isEpicIssueSelect ? this.props.epics : autoCompleteData[field.key];
          return (
            <>
              {data.map((value) => {
                return (
                  <Option key={value[key]} value={value[key]}>
                    {isIssueSelect
                      ? "(" + value.key + ") " + (isEpicIssueSelect ? value.fields && value.fields.summary : value.summaryText)
                      : value[valueName]}
                    {/* {isIssueSelect ? "(" + value.key + ") " + 'some data' :''} */}
                  </Option>
                );
              })}
            </>
          );
        }
      } else if (isSprintSelect) {
        const activeSprints = boardSprints.filter((sprint) => sprint.state === "active");
        const futureSprints = boardSprints.filter((sprint) => sprint.state === "future");
        return (
          <>
            {activeSprints.length > 0 && (
              <Select.OptGroup label='Active Sprints'>
                {activeSprints.map((sprint) => {
                  return <Option key={sprint.id}>{sprint.name}</Option>;
                })}
              </Select.OptGroup>
            )}
            {futureSprints.length > 0 && (
              <Select.OptGroup label='Future Sprints'>
                {futureSprints.map((sprint) => {
                  return <Option key={sprint.id}>{sprint.name}</Option>;
                })}
              </Select.OptGroup>
            )}
          </>
        );
      }
    };

    const onSearchChange = (value) => {
      if (schemaType === "user" || field.schema.items === "user") {
        if (field.key === "assignee") this.getAssignableUsers(value, field);
        else this.getJiraUsersData(value, field);
      } else if (autoCompleteUrl || field.key === "parent") this.getJiraAutoCompletionData({ field, query: value });
      else if (isEpicIssueSelect) this.getEpicIssues({ field, query: value });
    };

    const onFocus = () => {
      if (schemaType === "user" || field.schema.items === "user") {
        if (field.key === "assignee") this.getAssignableUsers("", field);
        else this.getJiraUsersData("", field);
      } else if (autoCompleteUrl || field.key === "parent") this.getJiraAutoCompletionData({ field });
      else if (isEpicIssueSelect) this.getEpicIssues({ field, query: "" });
      else if (isSprintSelect && this.props.board) this.props.getJiraBoardSprint(this.props.match.params.wId, this.props.board);
    };

    const isUserInOptions = (id) => {
      const user = this.state[field.key === "assignee" ? "assignableUsers" : "jiraUsers"].find((user) => user.accountId === id || user.key === id);
      return user ? true : false;
    };

    let valueData;

    if (schemaType === "user" || field.schema.items === "user") {
      if (fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key]) {
        if (schemaType === "user") {
          const data = fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key];
          valueData = data && data.key && data[isUserInOptions(data.key) ? "key" : "children"];
        } else {
          valueData = [];
          fieldDefaults[this.state.selectedIssueTab] &&
            fieldDefaults[this.state.selectedIssueTab][field.key].forEach((user) => {
              valueData.push(user[isUserInOptions(user.key) ? "key" : "children"]);
            });
        }
      }
    } else if (isSprintSelect) {
      if (fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key]) {
        const data = fieldDefaults[this.state.selectedIssueTab][field.key];
        const sprintFount = boardSprints.find((sprint) => sprint.id === data.id);
        if (sprintFount) valueData = data.id.toString();
        else valueData = data.name;
      }
    } else {
      valueData = fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key];
    }

    return (
      <>
        {this.getHeader({ field })}
        <Select
          placeholder={this.getPlaceHolderText(field)}
          style={{ width: "100%", marginBottom: "15px" }}
          onFocus={onFocus}
          onSearch={onSearchChange}
          showSearch={showSearch}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          mode={isMultiSelect ? "multiple" : ""}
          value={valueData}
          onChange={(value, optionData) => {
            this.setFieldDefaults({ value, optionData, field, isSprintSelect });
          }}
          allowClear
          notFoundContent={fieldLoading[field.key] ? <Spin size='small' /> : null}
          loading={fieldLoading[field.key]}
          disabled={this.props.disableEdit}
        >
          {getOptions()}
          {/* <Option>111</Option> */}
        </Select>
        <br />
      </>
    );
  };

  getIssueLinkSelects = ({ field }) => {
    const { autoCompleteData, selectedIssueTab, fieldDefaults } = this.state;
    const key = field.key;
    let validOptions = [];
    const getOptions = () => {
      if (autoCompleteData[key] && autoCompleteData[key].issueLinkTypes) {
        autoCompleteData[key].issueLinkTypes.forEach((linkType) => {
          validOptions.push({ id: `inward_${linkType.id}`, value: linkType.inward });

          if (linkType.inward !== linkType.outward) validOptions.push({ id: `outward_${linkType.id}`, value: linkType.outward });
        });
        return validOptions.map((data) => {
          return (
            <Option key={data.id} value={data.id}>
              {data.value}
            </Option>
          );
        });
      }
    };

    const getIssueOptions = () => {
      if (autoCompleteData[key] && autoCompleteData[key].issues) {
        return autoCompleteData[key].issues.map((issue) => {
          return <Option key={issue.key} value={issue.key}>{`(${issue.key}) ${issue.summaryText}`}</Option>;
        });
      }
    };

    // const onFocus = () => {
    //   this.getJiraAutoCompletionData({ field, getIssueLinkBlocks: true });
    // };

    const onIssueFieldFocus = () => {
      this.getJiraAutoCompletionData({ field });
    };

    const onIssueSearch = (value) => {
      this.getJiraAutoCompletionData({ field, query: value });
    };

    const onChange = (value, type) => {
      let fieldDefaults = { ...this.state.fieldDefaults };
      if (!fieldDefaults[selectedIssueTab]) fieldDefaults[selectedIssueTab] = {};
      if (fieldDefaults[selectedIssueTab] && !fieldDefaults[selectedIssueTab][key]) fieldDefaults[selectedIssueTab][key] = {};

      if (type === "issueLink") {
        const linkTypeFound = validOptions.find((data) => data.id === value);
        fieldDefaults[selectedIssueTab][key].linkType = linkTypeFound || {};
      } else if (type === "issue") fieldDefaults[selectedIssueTab][key].issue = value;
      this.setState({ fieldDefaults });
    };

    return (
      <>
        <Text type='secondary' strong>
          Issue Link Type
        </Text>
        <br />
        <Select
          placeholder='Select link type'
          style={{ width: "100%", marginBottom: "15px" }}
          // onFocus={onFocus}
          // onSearch={onSearchChange}
          // showSearch={showSearch}
          // mode={isMultiSelect ? "multiple" : ""}
          value={
            fieldDefaults[this.state.selectedIssueTab] &&
            fieldDefaults[this.state.selectedIssueTab][field.key] &&
            fieldDefaults[this.state.selectedIssueTab][field.key].linkType &&
            fieldDefaults[this.state.selectedIssueTab][field.key].linkType.id
          }
          onChange={(value) => onChange(value, "issueLink")}
          allowClear
          disabled={this.props.disableEdit}
        >
          {getOptions()}
        </Select>
        <br />
        {this.getHeader({ field })}
        <Select
          placeholder='Type key or summary'
          style={{ width: "100%", marginBottom: "15px" }}
          showSearch
          onFocus={onIssueFieldFocus}
          onSearch={onIssueSearch}
          onChange={(value) => onChange(value, "issue")}
          value={
            fieldDefaults[this.state.selectedIssueTab] &&
            fieldDefaults[this.state.selectedIssueTab][field.key] &&
            fieldDefaults[this.state.selectedIssueTab][field.key].issue
          }
          allowClear
          notFoundContent={this.state.fieldLoading[field.key] ? <Spin type='small' /> : null}
          loading={this.state.fieldLoading[field.key]}
          disabled={this.props.disableEdit}
        >
          {getIssueOptions()}
        </Select>
      </>
    );
  };

  // getSprintSelects = ({ field }) => {
  //   const { jiraBoards, boardSprints } = this.props;

  //   const boardOptions = () => {
  //     console.log(jiraBoards);
  //     return jiraBoards.map((board) => {
  //       return <Option key={board.id}>{board.name}</Option>;
  //     });
  //   };
  //   // const onSprintFocus = () => {
  //   //   this.props.getJiraBoardSprint()
  //   // }

  //   return (
  //     <>
  //       {this.getHeader({ field })}
  //       <Row gutter={[16, 16]}>
  //         <Col span={12}>
  //           <Select onFocus={this.onBoardFocus} style={{ width: "100%", marginBottom: "15px" }}></Select>
  //         </Col>
  //         <Col span={12}>
  //           <Select
  //             // onFocus={onSprintFocus}
  //             style={{ width: "100%", marginBottom: "15px" }}
  //           >
  //             {boardOptions()}
  //           </Select>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  // };

  getSelectCasecading = ({ field }) => {
    const { fieldDefaults, selectedIssueTab } = this.state;

    const schemaType = field.schema.type;
    const showSearch = true;
    const allowedValues = field.allowedValues || false;

    // console.log(fieldDefaults[field.key].firstSelectValue);

    const getOptionsFirstSelect = () => {
      if (allowedValues) {
        return (
          <>
            {allowedValues.map((value) => {
              return (
                <Option key={value.id} value={value.id}>
                  {value.value}
                </Option>
              );
            })}
          </>
        );
      }
    };

    const getOptionsSecondSelect = () => {
      if (allowedValues) {
        const fieldData = fieldDefaults[selectedIssueTab] && fieldDefaults[selectedIssueTab][field.key];
        const secondSelectAllowedValuesData = fieldData ? allowedValues.find((value) => value.id === fieldData.firstSelectValue) : false;
        if (secondSelectAllowedValuesData)
          return (
            <>
              {secondSelectAllowedValuesData.children &&
                secondSelectAllowedValuesData.children.map((value) => {
                  return (
                    <Option key={value.id} value={value.id}>
                      {value.value}
                    </Option>
                  );
                })}
            </>
          );
      }
    };

    return (
      <>
        {this.getHeader({ field })}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Select
              placeholder={`Choose ${field.name}`}
              style={{ width: "100%", marginBottom: "15px" }}
              value={
                fieldDefaults[this.state.selectedIssueTab] &&
                fieldDefaults[this.state.selectedIssueTab][field.key] &&
                fieldDefaults[this.state.selectedIssueTab][field.key].firstSelectValue
              }
              allowClear
              onChange={(value) => this.setFieldDefaults({ value, field, cascadeSelect: { firstSelectValue: value } })}
              showSearch={showSearch}
              disabled={this.props.disableEdit}
            >
              {getOptionsFirstSelect()}
            </Select>
          </Col>
          <Col span={12}>
            <Select
              placeholder={"Select a option"}
              style={{ width: "100%", marginBottom: "15px" }}
              allowClear
              disabled={
                this.props.disableEdit
                  ? true
                  : fieldDefaults[this.state.selectedIssueTab] &&
                    fieldDefaults[this.state.selectedIssueTab][field.key] &&
                    fieldDefaults[this.state.selectedIssueTab][field.key].firstSelectValue
                  ? false
                  : true
              }
              value={
                fieldDefaults[this.state.selectedIssueTab] &&
                fieldDefaults[this.state.selectedIssueTab][field.key] &&
                fieldDefaults[this.state.selectedIssueTab][field.key].secondSelectValue
              }
              onChange={(value) => this.setFieldDefaults({ value, field, cascadeSelect: { secondSelectValue: value } })}
              showSearch={showSearch}
            >
              {getOptionsSecondSelect()}
            </Select>
          </Col>
          <br />
        </Row>
      </>
    );
  };

  getInput = ({ field }) => {
    const { fieldDefaults } = this.state;
    const schemaType = field.schema.type;
    let placeHolder = "Enter something";
    if (schemaType === "datetime") placeHolder = "e.g 1996-10-15T23:05";
    return (
      <>
        {this.getHeader({ field })}
        <Input
          value={fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key]}
          onChange={(event) => {
            if (event.target.value && event.target.value.length > 255) message.error(`Only 255 characters are allowed in ${field.name}`);
            else this.setFieldDefaults({ value: event.target.value, field });
          }}
          placeholder={this.getPlaceHolderText(field)}
          style={{ width: "100%", marginBottom: "15px" }}
          allowClear
          disabled={this.props.disableEdit}
        ></Input>
        <br />
      </>
    );
  };

  getTimeTrackingInputs = ({ field }) => {
    const { fieldDefaults, selectedIssueTab } = this.state;

    const originalEstimateValue =
      (fieldDefaults[selectedIssueTab] &&
        fieldDefaults[selectedIssueTab][field.key] &&
        fieldDefaults[selectedIssueTab][field.key].originalEstimate) ||
      null;
    const remainingEstimateValue =
      (fieldDefaults[selectedIssueTab] &&
        fieldDefaults[selectedIssueTab][field.key] &&
        fieldDefaults[selectedIssueTab][field.key].remainingEstimate) ||
      null;
    return (
      <>
        <>
          <Text type='secondary' strong>
            Original Estimate
          </Text>
          <br />
        </>
        <Input
          style={{ width: "100%", marginBottom: "15px" }}
          placeholder='e.g 2w 4d 6h 45m'
          onChange={(event) => this.setFieldDefaults({ field, type: "originalEstimate", value: event.target.value })}
          value={originalEstimateValue}
          allowClear
          disabled={this.props.disableEdit}
        />
        <br />
        <>
          <Text type='secondary' strong>
            Remaining Estimate
          </Text>
          <br />
        </>
        <Input
          style={{ width: "100%", marginBottom: "15px" }}
          placeholder='e.g 2w 4d 6h 45m'
          onChange={(event) => this.setFieldDefaults({ field, type: "remainingEstimate", value: event.target.value })}
          value={remainingEstimateValue}
          allowClear
        />
        <br />
      </>
    );
  };

  getTextArea = ({ field }) => {
    const { fieldDefaults } = this.state;
    return (
      <>
        {this.getHeader({ field })}
        <TextArea
          value={fieldDefaults[this.state.selectedIssueTab] && fieldDefaults[this.state.selectedIssueTab][field.key]}
          onChange={(event) => this.setFieldDefaults({ value: event.target.value, field })}
          placeholder={this.getPlaceHolderText(field)}
          style={{ width: "100%", marginBottom: "15px" }}
          allowClear
          disabled={this.props.disableEdit}
        ></TextArea>
        <br />
      </>
    );
  };

  // getInputNumber = ({ field }) => {
  //   const {fieldDefaults} = this.state
  //   return (
  //     <>
  //       {this.getHeader({ field })}
  //       <InputNumber value={fieldDefaults[field.key]} placeholder='Enter a number' style={{ width: "100%", marginBottom: "15px" }}></InputNumber>
  //       <br />
  //     </>
  //   );
  // };

  getDatePicker = ({ field }) => {
    return (
      <>
        {this.getHeader({ field })}
        <DatePicker
          value={
            this.state.fieldDefaults[this.state.selectedIssueTab] &&
            this.state.fieldDefaults[this.state.selectedIssueTab][field.key] &&
            moment(this.state.fieldDefaults[this.state.selectedIssueTab][field.key])
          }
          allowClear
          onChange={(date, dateString) => this.setFieldDefaults({ value: dateString, field })}
          style={{ width: "100%" }}
          disabled={this.props.disableEdit}
        />
        <br />
        <br />
      </>
    );
  };

  getJiraUsersData = (value, field) => {
    this.setLoadingState({ field, value: true });
    this.props.getJiraUsers(this.props.match.params.skill_id, value || "").then((res) => {
      this.setLoadingState({ field, value: false });
      if (res.success) this.setState({ jiraUsers: res.users });
    });
  };

  getAssignableUsers = (value, field) => {
    const { projects, linkedProject } = this.props;
    const projectFound = projects.find((project) => project.id === linkedProject);
    if (projectFound) {
      this.setLoadingState({ field, value: true });
      getTaskAssignableUsers(this.props.match.params.wId, {
        params: {
          query: value || "",
          project: projectFound.key,
        },
      }).then((res) => {
        this.setLoadingState({ field, value: false });
        if (res.data.success) this.setState({ assignableUsers: res.data.taskAssignableMemebers });
      });
    }
  };

  getEpicIssues = ({ field, query }) => {
    this.setLoadingState({ field, value: true });
    this.props
      .getEpics(this.props.match.params.wId, query || "", this.props.linkedProject)
      .then((res) => this.setLoadingState({ field, value: false }));
  };

  getJiraAutoCompletionData = ({ field, query, getIssueLinkBlocks }) => {
    this.setLoadingState({ field, value: true });
    if ((field.key === "issuelinks" && !getIssueLinkBlocks) || field.key === "parent") {
      this.props.getJiraIssuePicker(this.props.match.params.wId, query || "").then((res) => {
        this.setLoadingState({ field, value: false });
        if (res.data.success) {
          let autoCompleteData = { ...this.state.autoCompleteData };
          if (field.key === "issuelinks") {
            if (!autoCompleteData[field.key]) autoCompleteData[field.key] = {};
            autoCompleteData[field.key].issues = res.data.issues || [];
          } else {
            autoCompleteData[field.key] = res.data.issues || [];
          }
          this.setState({ autoCompleteData });
        }
      });
    } else if (field.schema.items === "issuelinks" && getIssueLinkBlocks) {
      if (
        !this.state.autoCompleteData[field.key] ||
        (this.state.autoCompleteData[field.key] && !this.state.autoCompleteData[field.key].issueLinkTypes)
      ) {
        this.props.getJiraIssueLinkBlocks(this.props.match.params.wId).then((res) => {
          this.setLoadingState({ field, value: false });
          if (res.data.success) {
            let autoCompleteData = { ...this.state.autoCompleteData };
            if (!autoCompleteData[field.key]) autoCompleteData[field.key] = {};
            autoCompleteData[field.key].issueLinkTypes = res.data.jiraIssueLinkBlocksData.issueLinkTypes;
            this.setState({ autoCompleteData });
          }
        });
      }
    } else {
      let link = `/bot/skill/${this.props.match.params.skill_id}/user/${this.props.user_now._id}/getJiraAutoCompleteOptions`;
      axios
        .get(link, {
          params: {
            url: query ? field.autoCompleteUrl + query : field.autoCompleteUrl,
          },
        })
        .then((res) => {
          this.setLoadingState({ field, value: false });
          if (res.data.success) {
            let autoCompleteData = Object.assign(this.state.autoCompleteData);
            // if(field.key === 'issuelinks') autoCompleteData[field.key] = res.data.data.sections[0].issues
            // else
            autoCompleteData[field.key] = res.data.data.suggestions;
            this.setState({ autoCompleteData });
          }
        });
    }
  };

  setLoadingState = ({ field, value }) => {
    let fieldLoading = { ...this.state.fieldLoading };
    fieldLoading[field.key] = value;
    this.setState({ fieldLoading });
  };

  setFieldDefaults = ({ value, field, optionData, cascadeSelect, isSprintSelect, type }) => {
  //  console.log(value, field, optionData, cascadeSelect, isSprintSelect, type)
    const { selectedIssueTab } = this.state;
    const { boardSprints } = this.props;
    let fieldDefaults = Object.assign(this.state.fieldDefaults);
    let fieldKey = field.key;
    if (cascadeSelect) {
      // if (cascadeSelect.firstSelectValue && fieldDefaults[this.state.selectedIssueTab][fieldKey]) delete fieldDefaults[this.state.selectedIssueTab][fieldKey].secondSelectValue;
      // fieldDefaults[this.state.selectedIssueTab][fieldKey] = { ...fieldDefaults[this.state.selectedIssueTab][fieldKey], ...cascadeSelect };
      if (!fieldDefaults[selectedIssueTab]) fieldDefaults[selectedIssueTab] = {};
      if (!fieldDefaults[selectedIssueTab][fieldKey]) fieldDefaults[selectedIssueTab][fieldKey] = {};

      if (fieldDefaults[selectedIssueTab][fieldKey]) delete fieldDefaults[selectedIssueTab][fieldKey].secondSelectValue;

      fieldDefaults[selectedIssueTab][fieldKey] = { ...fieldDefaults[selectedIssueTab][fieldKey], ...cascadeSelect };
    } else {
      if (field.schema.type === "user" || field.schema.items === "user") {
        value = optionData;
      } else if (field.schema.type === "timetracking") {
        let timeTrackingData = {};
        if (fieldDefaults[selectedIssueTab] && fieldDefaults[selectedIssueTab][field.key]) {
          timeTrackingData = { ...fieldDefaults[selectedIssueTab][field.key] };
        }

        timeTrackingData[type] = value;
        value = timeTrackingData;
      } else if (isSprintSelect) {
        const findSprint = optionData ? boardSprints.find((sprint) => sprint.id.toString() === optionData.key) : false;
        if (findSprint) value = findSprint;
        else value = undefined;
      }

      if (!fieldDefaults[selectedIssueTab]) fieldDefaults[selectedIssueTab] = {};
      fieldDefaults[selectedIssueTab][fieldKey] = value;

      if (fieldDefaults[selectedIssueTab][fieldKey] === undefined || fieldDefaults[selectedIssueTab][fieldKey].length === 0)
        delete fieldDefaults[selectedIssueTab][fieldKey];

      // if (fieldDefaults[selectedIssueTab]) {
      //   fieldDefaults[selectedIssueTab][fieldKey] = value;
      // } else {
      //   fieldDefaults[selectedIssueTab] = {};
      //   fieldDefaults[selectedIssueTab][fieldKey] = value;
      // }
    }
    // console.log(fieldDefaults)
    this.setState({ fieldDefaults });
  };

  getPlaceHolderText = (field) => {
    let placeholder = "";
    const type = field.schema.type;
    const name = field.name;
    if (field.schema.custom === "com.pyxis.greenhopper.jira:gh-sprint") placeholder = "Choose Sprint";
    else if (field.schema.custom === "com.pyxis.greenhopper.jira:gh-epic-link" || type === "issuelink") placeholder = "Type Key or Summary";
    else if (type === "number") placeholder = "Enter a number";
    else if (type === "issuetype") placeholder = `Select a ${name}`;
    else if (type === "string" || type === "comments-page") placeholder = `Write something`;
    else if (type === "option") placeholder = `Choose ${name}`;
    else if (type === "priority") placeholder = `Choose an priority`;
    else if (type === "user") placeholder = `Start typing Jira username`;
    else if (type === "date") placeholder = `Select a date`;
    else if (type === "datetime") placeholder = `e.g 1996-10-15T23:05`;
    else if (type === "resolution") placeholder = `Type resolution`;
    else if (type === "resolution") placeholder = `Type resolution`;
    else if (type === "array") {
      if (field.schema.items === "group") placeholder = "Format :- 1,2,3,4";
      else placeholder = `Choose ${name}`;
    }

    return placeholder;
  };

  handle_checkbox_change = (e, issueKey) => {
    const { selectedIssueTab, fields, hiddenFields } = this.state;

    const HiddenFields = { ...hiddenFields };

    if (!HiddenFields || (HiddenFields && !HiddenFields[selectedIssueTab])) HiddenFields[selectedIssueTab] = [];

    if (e.target.checked) {
      const index = HiddenFields && HiddenFields[selectedIssueTab].findIndex((val) => val === issueKey);
      HiddenFields[selectedIssueTab].splice(index, 1);
      if(HiddenFields[selectedIssueTab].length === 0) delete HiddenFields[selectedIssueTab]
    } else HiddenFields[selectedIssueTab].push(issueKey);

    this.setState({ hiddenFields: HiddenFields });
  };

  render() {
    let { fields, hiddenFields, selectedIssueTab } = this.state;
    // console.log(JSON.stringify(fields));
    if (fields[0] && fields[0].key !== "summary") {
      const summaryIndex = fields.findIndex((field) => field.key === "summary" || field.fieldId === "summary");
      if (summaryIndex) {
        const element = fields[summaryIndex];
        fields.splice(summaryIndex, 1);
        fields.splice(0, 0, element);
      }
    }

    return !this.state.fieldsLoading ? (
      <div>
        <Tabs activeKey={this.state.selectedIssueTab} onChange={this.handle_issue_change} type='card'>
          {this.state.allIssueTypeFields.map((issueType) => {
            return (
              <TabPane tab={issueType.name} key={issueType.name}>
                <Tabs defaultActiveKey={"field_defaults"}>
                  <TabPane tab='Field Defaults' key='field_defautls'>
                    {fields.map((field) => {
                      if (!field.key) {
                        field.key = field.fieldId;
                      }
                      const isAllowedValueEmpty = field.allowedValues && field.allowedValues.length === 0 ? true : false;
                      let isFieldHidden = false
                      if(hiddenFields && hiddenFields[selectedIssueTab] && hiddenFields[selectedIssueTab].includes(field.key)) isFieldHidden = true
                      if (
                        field.key !== "issuetype" &&
                        field.key !== "attachment" &&
                        field.key !== "project" &&
                        !(
                          field.schema &&
                          (field.schema.custom == "com.pyxis.greenhopper.jira:gh-lexo-rank" ||
                            field.schema.custom == "com.atlassian.jira.plugins.jira-development-integration-plugin:devsummarycf")
                        ) &&
                        !isFieldHidden &&
                        !isAllowedValueEmpty
                      ) {
                        const field_schema = field.schema;
                        const schemaType = field.schema.type || "";
                        const custom = field.schema.custom || "";

                        if (field_schema.custom && field_schema.custom === "com.pyxis.greenhopper.jira:gh-sprint") {
                          // return this.getSprintSelects({ field });
                          return this.getSelect({ field });
                        } else if (schemaType === "number") {
                          // return this.getInputNumber({ field });
                          return this.getInput({ field });
                        } else if (schemaType === "string") {
                          const customType = field_schema.custom ? field_schema.custom.split(":")[1] : "";
                          const system = field_schema.system || "";
                          if (customType == "textarea" /* || system == "summary" */ || system == "environment" || system == "description")
                            return this.getTextArea({ field });
                          else return this.getInput({ field });
                        } else if (schemaType === "issuetype") {
                          return this.getSelect({ field });
                        } else if (schemaType === "array" || schemaType === "priority" || field.schema.type === "option") {
                          if (field_schema.items === "issuelinks") {
                            return this.getIssueLinkSelects({ field });
                          } else {
                            if (field_schema.items === "group") return this.getInput({ field });
                            else return this.getSelect({ field });
                          }
                        } else if (schemaType === "user") {
                          return this.getSelect({ field });
                        } else if (schemaType === "date") {
                          return this.getDatePicker({ field });
                        } else if (schemaType === "datetime") {
                          return this.getInput({ field });
                        } else if (custom === "com.pyxis.greenhopper.jira:gh-epic-link") {
                          return this.getSelect({ field });
                          // } else if (custom === "com.atlassian.servicedesk:vp-origin") {
                          //   return this.getSelect({ field });
                        } else if (schemaType === "comments-page") {
                          return this.getInput({ field });
                        } else if (schemaType === "sd-request-lang") {
                          return this.getInput({ field });
                        } else if (schemaType === "option-with-child") {
                          return this.getSelectCasecading({ field });
                        } else if (schemaType === "resolution") {
                          return this.getSelect({ field });
                        } else if (schemaType === "issuelink") {
                          return this.getSelect({ field });
                        } else if (schemaType === "timetracking") {
                          return this.getTimeTrackingInputs({ field });
                        } else {
                          console.warn("un handled field", field);
                        }
                      }
                    })}
                  </TabPane>
                  <TabPane tab='Show Fields' key='show_fields'>
                    {/* <div className='customize_fields_checkboxes'>
                      <Checkbox.Group
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                        value={selected_checkboxes}
                        options={fields.map((field) => {
                          return { label: field.name, value: field.key, disabled: field.required };
                        })}
                        onChange={this.handle_checkbox_change}
                      />
                    </div> */}

                    <Row gutter={[16, 16]}>
                      {fields.map((field) => {
                      const isAllowedValueEmpty = field.allowedValues && field.allowedValues.length === 0 ? true : false;

                        if(
                          field.key !== "issuetype" &&
                          field.key !== "attachment" &&
                          field.key !== "project" &&
                          !(
                            field.schema &&
                            (field.schema.custom == "com.pyxis.greenhopper.jira:gh-lexo-rank" ||
                              field.schema.custom == "com.atlassian.jira.plugins.jira-development-integration-plugin:devsummarycf")
                          ) &&
                          !isAllowedValueEmpty
                        ) return (
                          <Col span={24}>
                            <Checkbox
                              checked={
                                hiddenFields && hiddenFields[selectedIssueTab]
                                  ? !hiddenFields[selectedIssueTab].includes(field.key || field.fieldId)
                                  : true
                              }
                              disabled={field.required}
                              onChange={(e) => this.handle_checkbox_change(e, field.key || field.fieldId)}
                            >
                              {field.name}
                            </Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </TabPane>
                </Tabs>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    ) : (
      <Spin style={{ display: "block" }} />
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user_now: store.common_reducer.user,
    projects: store.skills.projects,
    epics: store.skill_builder.epics,
    jiraBoards: store.skills.jiraBoards,
    boardSprints: store.skills.jiraSprints,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getJiraUsers,
    getJiraIssuePicker,
    getJiraIssueLinkBlocks,
    getEpics,
    getJiraBoardSprint,
  })(jiraIssueFields)
);