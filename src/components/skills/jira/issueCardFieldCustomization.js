import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Select, Collapse, Switch, Table, Typography, Col, Tabs, Tooltip, message, Popconfirm, Alert } from "antd";
import axios from "axios";
import queryString from "query-string";
import { ExpandAltOutlined, ShrinkOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import IssueCard from "../../../utils/IssueCard";
const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const defaultCompactField = { name: "status", key: "status" };
const defaultValues = {
  project: 1,
  issue_type: 2,
  assignee: 3,
  priority: 4,
  issuetype: 2,
  "issue type": 2,
};

const ignoreFields = {
  summary: 1,
  attachment: 1,
  description: 1,
  comment: 1,
  subtasks: 1,
  worklog: 1,
  issuelinks: 1,
};

const allowedSchemaTypes = (field) => {
  let allowedSchemaTypes = {
    string: 1,
    array: 1,
    number: 1,
    date: 1,
    issuetype: 1,
    issuelink: 1,
    project: 1,
    user: 1,
    priority: 1,
    datetime: 1,
  };
  if (field && field.schema && field.schema.type && allowedSchemaTypes[field.schema.type]) {
    return false;
  }

  return true;
};

const IssueCardFieldCustomization = (props) => {
  // const channelFound = commonChanneldata.find((cha) => cha.channel_id == this.props.channel.id);
  // channelDefault: state.skills.channelDefault,
  const params = queryString.parse(props.location.search);
  const isPersonalPref = props.isPersonalPref
  const channelid = params.channel_id || props.channel_id || null;
  const [fields, setFields] = useState({});
  const [all_issuetype_fields, set_all_issuetype_fields] = useState([]);
  const [currentView, setCurrentView] = useState(1);
  const [buttonActions, setButtonActions] = useState({});
  const [showDescription, setShowDescription] = useState(false);
  const [fieldSelectedCompact, setFieldSelectedCompact] = useState(defaultCompactField);
  const [defaultAttributeValues, setDefaultAttributeValues] = useState(new Array(4));
  const [loading, setLoading] = useState(true);
  const [projectKey, setProjectKey] = useState("");

  const user = useSelector((state) => {
    return state.common_reducer.user;
  });
  const channelDefault = useSelector(
    (state) => state.skills.channelDefault && state.skills.channelDefault.link_info && state.skills.channelDefault.link_info.project_id
  );
  const commonChannelData = useSelector((state) => state.skills.commonChanneldata);

  const channelFound = commonChannelData.find((cha) => (cha && cha.channel_id) == channelid);
  const [currentChannelConfig, setcurrentChannelConfig] = useState(channelFound);

  const [disable, setDisable] = useState(props.channelAdmin || props.workspaceAdmin || isPersonalPref ? false : true);

  useEffect(() => {
    setDisable(props.channelAdmin || props.workspaceAdmin || isPersonalPref ? false : true);
  }, [props.channelAdmin, props.workspaceAdmin]);

  const onReset = () => {
    setShowDescription(false);
    setFieldSelectedCompact(defaultCompactField);
    setButtonActions({});
    setDefaultAttributeValues(new Array(4));
    let data = {
      reset: true,
    };

    handleIssueCardConfigChanges(data);
    let configData = { ...currentChannelConfig };
    configData.issueCardCustomizationInfo = null;
    setcurrentChannelConfig(configData);
  };

  useEffect(() => {
    /* TO DO : checking for change in common channel data to handle personal issue defaults change but it's calling the getIssuefields api everytime commonData updated in channel defaults this should be handled properly  */
    const channelFound = commonChannelData.find((cha) => (cha && cha.channel_id) == channelid);
    setcurrentChannelConfig(channelFound)
  }, [commonChannelData])

  useEffect(() => {
    getIssueFields();
  }, [currentChannelConfig, channelDefault]);

  const getIssueFields = () => {
    axios
      .get(`/bot/skill/${props.match.params.skill_id}/user/${user._id}/issueFieldsOfProject`, {
        params: {
          project_id: props.projectId,

          // params : {project_id : '10026',
          // issueTypeName : 'Task'
        },
      })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          let fields = {};

          let setupDefaultValues = [...defaultAttributeValues];
          let cardCustomizationData = currentChannelConfig.issueCardCustomizationInfo;
          if (cardCustomizationData) {
            setShowDescription(cardCustomizationData.showDescription || false);
            setDefaultAttributeValues(cardCustomizationData.fieldsSelectedDetailed);
            setFieldSelectedCompact(cardCustomizationData.fieldSelectedCompact);
            setButtonActions(cardCustomizationData.buttonActions);
          }
          setProjectKey(res.data.items.projects[0].key);
          const issuetype = res.data.items.projects[0].issuetypes.find((issuetype) => issuetype.name === props.linkedIssue);
          const all_issuetype_fields = [];
          for (let item in issuetype.fields) {
            if (item === "project" || item === "attachment") {
            } else {
              if (!issuetype.fields[item].fieldId) issuetype.fields[item].fieldId = issuetype.fields[item].key;
              all_issuetype_fields.push(issuetype.fields[item]);
            }
          }
          if (issuetype) set_all_issuetype_fields(all_issuetype_fields);

          res.data.items.projects[0].issuetypes.forEach((type) => {
            for (const [key, el] of Object.entries(type.fields)) {
              if (
                ignoreFields[el.name.toLowerCase()] ||
                ignoreFields[(el && el.key && el.key.toLowerCase()) || (el && el.fieldId && el.fieldId.toLowerCase())] ||
                ignoreFields[key]
              ) {
              } else if (allowedSchemaTypes(el)) {
              } else if (!fields[el.name]) {
                let isUsed = false;
                let column = null;
                if (cardCustomizationData && cardCustomizationData.fieldsSelectedDetailed) {
                  let findName = cardCustomizationData.fieldsSelectedDetailed.find((i) => i && i.name === el.name);
                  if (findName) {
                    isUsed = true;
                    column = findName.column;
                  }
                } else if (defaultValues[el.name.toLowerCase()]) {
                  isUsed = true;
                  column = defaultValues[el.name.toLowerCase()];
                }
                fields[el.name] = { isUsed: isUsed, name: el.name, key: el.key || el.fieldId || key, field: el, column: column };

                if (column && !cardCustomizationData) {
                  setupDefaultValues[column - 1] = fields[el.name];
                }
              }
            }
          });
          if (!cardCustomizationData) {
            setDefaultAttributeValues(setupDefaultValues);
            setFieldSelectedCompact({ name: "status", key: "status" });
            setButtonActions({});
          }

          setFields(fields);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //     getIssueFields()
  // },[reset])

  const handleIssueCardConfigChanges = (data) => {
    const skill_id = props.match.params.skill_id;
    data.projectKey = projectKey;

    const wId = props.match.params.wId;
    data = {
      issueCardCustomizationInfo: data,
    };
    axios
      .post(`/bot/api/${wId}/issueCardCustomization/${skill_id}/channel/${channelid}`, data)
      .then((res) => {
        res = res.data;
        if (res && res.success) {
          let channelCommonData = res.channelCommonData;
          if (channelCommonData && channelCommonData.issueCardCustomizationInfo) {
            setShowDescription(channelCommonData.issueCardCustomizationInfo.showDescription);
            setDefaultAttributeValues(channelCommonData.issueCardCustomizationInfo.fieldsSelectedDetailed);
            setFieldSelectedCompact(channelCommonData.issueCardCustomizationInfo.fieldSelectedCompact);
            setButtonActions(channelCommonData.issueCardCustomizationInfo.buttonActions);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Please try again.");
      });
  };

  const onDetailedFieldsSelect = (fieldName, field, index) => {
    let defaultValues = [...defaultAttributeValues];

    let previouslySelectedField = defaultValues[index];
    let allFields = { ...fields };

    if (previouslySelectedField && allFields[previouslySelectedField.name]) {
      allFields[previouslySelectedField.name].isUsed = false;
      allFields[previouslySelectedField.name].column = null;
    }
    let selectedField = allFields[fieldName];
    selectedField.isUsed = true;
    selectedField.column = index + 1;
    allFields[fieldName] = selectedField;
    defaultValues[index] = selectedField;
    setDefaultAttributeValues(defaultValues);
    setFields(allFields);
    let data = {
      showDescription: showDescription,
      fieldsSelectedDetailed: defaultValues,
      fieldSelectedCompact: fieldSelectedCompact,
      buttonActions,
    };

    handleIssueCardConfigChanges(data);
  };

  const onClear = (field, index) => {
    let defaultValues = [...defaultAttributeValues];

    let previouslySelectedField = defaultValues[index];
    let allFields = { ...fields };

    if (previouslySelectedField) {
      allFields[previouslySelectedField.name].isUsed = false;
      allFields[previouslySelectedField.name].column = null;
    }
    defaultValues[index] = undefined;
    setDefaultAttributeValues(defaultValues);
    setFields(allFields);
    let data = {
      showDescription: showDescription,
      fieldsSelectedDetailed: defaultValues,
      fieldSelectedCompact: fieldSelectedCompact,
      buttonActions,
    };

    handleIssueCardConfigChanges(data);
  };

  const descriptionToggle = () => {
    let data = {
      showDescription: !showDescription,
      fieldsSelectedDetailed: defaultAttributeValues,
      fieldSelectedCompact: fieldSelectedCompact,
      buttonActions,
    };
    handleIssueCardConfigChanges(data);
  };
  const onCompactFieldsSelect = (fieldName) => {
    let selectedField;
    if (fieldName === "status") {
      selectedField = { name: "status", key: "status" };
    } else {
      selectedField = fields[fieldName];
      let updatefields = { ...fields };
      updatefields[fieldName].isUsed = true;
      updatefields.column = 5;
    }
    setFieldSelectedCompact(fieldSelectedCompact);
    let data = {
      showDescription: showDescription,
      fieldsSelectedDetailed: defaultAttributeValues,
      fieldSelectedCompact: selectedField,
      buttonActions,
    };

    handleIssueCardConfigChanges(data);
  };

  const columns = [
    {
      key: "number",
      align: "center",
      render: (text, record, index) => <Text>Attribute #{index + 1}</Text>,
      width: "25%",
    },
    {
      title: () => (
        <Text>
          Field{" "}
          <Tooltip title={`If the value for this field is not present for any issue, "Not available" will be shown`}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Text>
      ),
      key: "field",
      align: "center",
      render: (text, record, index) => {
        let defaultField = {};
        let filterFields = Object.values(fields).filter((el) => {
          if (el.isUsed) {
            if (el.column && el.column - 1 === index) {
              defaultField = el;
              return true;
            }
            return false;
          } else {
            return true;
          }
        });
        return (
          <Select
            // defaultValue={fieldsSelectedDetailed.length === 4 &&fieldsSelectedDetailed[index].field.name}
            placeholder='Select a jira field'
            style={{ width: "100%" }}
            value={defaultField.name}
            onSelect={(e) => onDetailedFieldsSelect(e, defaultField, index)}
            showSearch
            allowClear
            onClear={() => onClear(defaultField, index)}
            loading={loading}
            disabled={disable}
          >
            {filterFields.map((field) => {
              return (
                <Option key={field.key} value={field.name}>
                  {field.name}
                </Option>
              );
            })}
          </Select>
        );
      },
      width: "37%",
    },
  ];
  let dataSourceForAttributesList = Array.apply(null, { length: 4 }).map((_, index) => {
    return {
      key: index,
    };
  });

  const handle_select_change = ({ selectKey, option }) => {
    let buttonActions_data = { ...buttonActions };
    if (option === "change_status" || option === "comment") {
      delete buttonActions_data[selectKey];
    } else {
      const field = all_issuetype_fields.find((f) => f.fieldId === option);

      if (field) buttonActions_data[selectKey] = field;
    }

    let data = {
      showDescription,
      fieldsSelectedDetailed: [...defaultAttributeValues],
      fieldSelectedCompact,
      buttonActions: buttonActions_data,
    };

    handleIssueCardConfigChanges(data);
  };

  const span = isPersonalPref ? 24 : 12
  const col_style = isPersonalPref ? {padding : 0} : {}

  return currentChannelConfig ? (
    // <Col span={span} style={col_style}>
      <Collapse size='small' /* defaultActiveKey={'4'} */>
        <Collapse.Panel header='Issue Card Display Customization' key='4' size='small'>
          <div className='card-container'>
            <Text>Currently supported field schema types: String, Array, Number, Date, User.</Text>

            <Tabs
              tabBarExtraContent={
                <Popconfirm title='Are you sure you want to reset to default values?' onConfirm={onReset}>
                  <Button type='primary' disabled={disable}>
                    Reset
                  </Button>
                </Popconfirm>
              }
              onTabClick={(val) => setCurrentView(val)}
            >
              <TabPane
                tab={
                  <span>
                    <ExpandAltOutlined />
                    Detailed View
                  </span>
                }
                key='1'
              >
                <div
                  style={{
                    marginBottom: "10px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ddd5d5",
                  }}
                >
                  <div style={{ marginBottom: "5px" }}>
                    <Text type='secondary'>Preview:</Text>
                  </div>
                  <IssueCard
                    handle_select_change={({ selectKey, option }) => handle_select_change({ selectKey, option })}
                    buttonActions={buttonActions}
                    all_issuetype_fields={all_issuetype_fields}
                    projectKey={projectKey}
                    selectedField={fieldSelectedCompact}
                    isCompact={false}
                    showDescription={showDescription}
                    selectedAttributesDetailed={defaultAttributeValues}
                    disable={disable}
                  />
                </div>
                <div style={{ marginBottom: "10px", borderBottom: "1px solid rgb(221, 213, 213)", paddingBottom: "10px" }}>
                  <Text
                    type='secondary'
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    Show Description
                    <Switch checked={showDescription} onChange={descriptionToggle} disabled={disable} />
                  </Text>
                </div>
                <div>
                  <Table pagination={false} showHeader={true} columns={columns} dataSource={dataSourceForAttributesList} />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ShrinkOutlined />
                    Compact View
                  </span>
                }
                key='2'
              >
                <div
                  style={{
                    marginBottom: "10px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ddd5d5",
                  }}
                >
                  <IssueCard projectKey={projectKey} isCompact={true} selectedField={fieldSelectedCompact} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type='secondary'>
                    Attribute to show:{" "}
                    <Tooltip title={`When this field is not available, "Status" field will be used as fallback.`}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Text>

                  <Select
                    style={{ width: "60%" }}
                    value={fieldSelectedCompact && fieldSelectedCompact.name}
                    onSelect={onCompactFieldsSelect}
                    showSearch
                    loading={loading}
                    disabled={disable}
                  >
                    <Option key='status' value='status'>
                      status
                    </Option>
                    {Object.values(fields)
                      .filter((el) => !el.isUsed)
                      .map((field) => {
                        return (
                          <Option key={field.key} value={field.name}>
                            {field.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Collapse.Panel>
      </Collapse>
    // </Col>
  ) : (
    <Col span={span} style={col_style}>
    <Collapse size='small' /* defaultActiveKey={'4'} */>
    <Collapse.Panel header='Issue Card Display Customization' key='4' size='small'>
    <Alert description={'Configure Issue Defaults to customize Issue card'} type='warning' style={{textAlign : 'center'}} />
    </Collapse.Panel>
    </Collapse>
    </Col>
  );
};

export default withRouter(IssueCardFieldCustomization);
