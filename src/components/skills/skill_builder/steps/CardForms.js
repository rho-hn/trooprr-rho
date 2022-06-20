import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getProject, getJiraBoards } from "../../skills_action";
import "./skillCardDetails.css";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Button, Select, Input, message, Tooltip,Typography } from "antd";
import axios from "axios";
import { getJiraIssueNodeFields } from "../../skill_builder/skillBuilderActions";
import {
  getProjectText,
  jqlTemplates,
  getFields,
  errors,
  Daterange
} from "./getProjectText";
import { saveCard, updateCard } from "./CardActions";
import JiraDynamicFieldSelect from "./jiraDynamicFieldSelect";
import BoardSprintSelect from "./boadSprintSelect";
import EpicSelect from "./epic_select";
import NumberField from "./numberFiled";
import { BorderOutlined, BulbFilled, BulbOutlined, LineChartOutlined,BarChartOutlined,PieChartOutlined,OrderedListOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;
const {Text} = Typography



class CardForms extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      primaryView: true,
      generatedJQL: "",
      errors: {},
      editmode: false,
      cardId: "",
      custom_jql: "",
      loadBoard:"",
      isCustomJQLTemplate:false,
      onSaveLoad:false
      
    };
  }

  componentDidMount() {
    if (
      this.props.data &&
      this.props.data.cardInformation &&
      this.props.data.cardInformation.cardInformation &&
      this.props.data.cardInformation.cardInformation.custom_jql
    ) {
      this.setState({
        // primaryView: false,
        custom_jql: this.props.data.cardInformation.cardInformation.custom_jql
      });
    }
    if (this.props.data.cardInformation.cardInformation) {
      this.setState({
        data: this.props.data.cardInformation.cardInformation,
        editmode: true,
        cardId: this.props.data._id,
        primaryView:this.props.data.cardInformation.cardInformation.primaryView==false?false:true
      });
      if((this.props.data.cardInformation.cardInformation.projects && this.props.data.cardInformation.cardInformation.projects[0]) ||  (this.props.data.cardInformation.cardInformation.project_id)){
       
          this.setState({loadBoard:true})
          let proj=this.props.data.cardInformation.cardInformation.project_id?this.props.data.cardInformation.cardInformation.project_id:this.props.data.cardInformation.cardInformation.projects[0]
          let query="projectKeyOrId="+proj
          this.props.getJiraBoards(this.props.match.params.wId,query).then(res => {
            this.setState({loadBoard:false})
          })
      }
    } else {
      let data=this.props.template.defaultValues ? this.props.template.defaultValues
      : {}
      if(this.props.template.meta && this.props.template.meta.sub_type){

        data.sub_type=this.props.template.meta.sub_type
      }
  
      this.setState({
        data:data
         
      });
    }

    this.props.getProject(this.props.match.params.wId).then(res => {
      // console.log(res)
    });
    let query = "";
    // let wId=localStorage.getItem("")
    this.props
      .getJiraIssueNodeFields(this.props.match.params.wId, query)
      .then(res => {
        // console.log(res);
      });

      this.props.template.fields.forEach(field => {
        // console.log(field)
  if(field.type=="boards_select"){
    this.props.getJiraBoards(this.props.match.params.wId,"type=scrum,simple").then(res => {});
  
  }
  })
  }

  handleChange = (value, type) => {
   if(!value ){
     let objkey=type=="boardId"?"board":type
    //  if( type==="select_template_jql")
    this.setState({data:{...this.state.data,[objkey]:null}})
     return
  //  }else {

  //  }
   }
    if (type) {
      if(type=="projects" || type=="project_id"){
      
        let data=this.state.data
        data.boardId=""
        data.board={}
        data.projectInfo=this.props.projects.find(item=>item.key==value)
        this.setState({loadBoard:true,  data: data})
        let proj=(type=="project_id")?value:value[0]
        let query="projectKeyOrId="+proj
        this.props.getJiraBoards(this.props.match.params.wId,query).then(res => {
          this.setState({loadBoard:false})
        });

      }
  //  if(type=="jql_days"){
  //    if()
  //  }
     
      if(type==="custom_jql"||type=="send_as"||type==="mention"){
        let errors=this.state.errors;
        delete errors["custom_jql"]
        this.setState({
          data: { ...this.state.data, [type]: value.target.value },
          errors: { ...errors }
        });
          }
       
      else if(type==="select_template_jql"){
        let errors=this.state.errors;
        delete errors["type"]
        this.setState({primaryView:false,data:{...this.state.data,custom_jql:value,select_template_jql:value}})
      }
      else if (type === 'x-axis-field'){
        // this.setState({data:{...this.state.data,'x-axis-field': value[0]}})
        const type = value[0].split('.')[2]
        let data = {...this.state.data}
        data['x-axis-field'] = value[0]
        if(type === 'assignee') data.select_template_jql =  'resolution=Unresolved'
        if(type === 'issuetype') data.select_template_jql =  'resolution=Unresolved'
        if(type === 'priority') data.select_template_jql =  'resolution=Unresolved'
        if(type === 'reporter') data.select_template_jql =  'resolution=Unresolved'
        if(type === 'status') data.select_template_jql =  ''
        if(type === 'resolution') data.select_template_jql =  ''
        
        const fields = getFields(this.props.fields, "x-axis");
        data['x-axis-type'] = fields.find(field => field && field.value === value[0])
        this.setState({data})

      }   
      else if (type === 'y-axis-field'){
        let fields = getFields(this.props.fields, "y-axis");
        
        this.setState({data:{...this.state.data,'y-axis-field': value[0],'y_axis_type': fields.find(field => field.value === value[0])}})
      }
      else if(type === "report_name"){
        const name = value.target.value
        this.setState({data : {...this.state.data,report_name:name}})
      }
      else if(type === "velocity_estimation"){
        this.setState({data:{...this.state.data,'velocity_estimation': value}})
      }
      else if(type === 'report_theme'){
        this.setState({data: {...this.state.data,report_theme:value.target.value}})
        // this.props.template.defaultValues.theme = value.target.value
      }
      else if (type === 'report_type'){
        this.setState({data: {...this.state.data,report_type:value.target.value}})
      }
      else {
        let errors = this.state.errors;

        delete errors[type];

        let data={ ...this.state.data, [type]:value}
        if(type=="boardId"){
      // console.log("nbcijwnwjwboard")
          let board=this.props.boards.find(board=>board.id==value)
          // console.log("nbcijwnwjwboard",board)
            data.board=board
        }
        this.setState({
          data: data,
          errors: { ...errors }
        });
      }
    } else {
      let errors = this.state.errors;
      delete errors[type];
     
      this.setState({
        data: { ...this.state.data, [type]: value.target.value },
        errors: { ...errors }
      });
      

    
    }
  };
  onChange = e => {
    let data={primaryView: !this.state.primaryView,errors:{}}
    if(this.state.primaryView){
  
      let info=this.state.data
      info.custom_jql= getProjectText(this.state.data,this.state.editmode)

      data.data = info;
    // }
  }
    this.setState(data);
  
  };

checkRequired=(cardInformation)=>{
  let isError=false
 this.props.template.fields.forEach((field, index) => {
   if (field.required){
      if(field.type==="JQL"&&this.props.template&&this.props.template.meta&&this.props.template.meta.custom_jql){

      }

    else if(field.type === "JQL"){
// console.log(cardInformation.projects , cardInformation.board,this.state.data)
      if(cardInformation.primaryView && !(cardInformation.projects && cardInformation.projects[0] )){
        isError= true
      }
    }else if(!this.state.data[field.key]){
      isError=  true

     }
 
  
    }
})
return isError
}
  onSave = () => {
    const {template} = this.props
    let cardInformation = this.state.data;
    cardInformation.primaryView=this.state.primaryView
  //  console.log(this.checkRequired(cardInformation));
      //x and y axis missing error
    if(template.key === "custom_report_2"){
        if((this.state.data["x-axis-field"]===undefined || this.state.data["y-axis-field"]=== undefined)){
          message.error("x and y axis cant be empty.")
        }
      }
    if(this.checkRequired(cardInformation))  {
      this.setState({ errors: {type:"field_missing"} })

    }
   
    else{
      
      this.setState({ errors: {} })
      // console.log(this.state.isCustomJQLTemplate)
      if(this.state.primaryView===false ||this.state.isCustomJQLTemplate){
        if(!(this.state.custom_jql||this.state.data.custom_jql)){
          this.setState({ errors: { custom_jql: "JQL is required" } })
          return;
         } 

      }
     

    
    // cardInformation.jql = this.state.data["custom_jql"]||getProjectText(this.state.data);
    cardInformation.jql = getProjectText(this.state.data);
    if (this.props.template.meta && this.props.template.meta.x_axis) {
      if(this.props.template.key === 'custom_report' || this.props.template.key === 'custom_report_2') {
        let temp = '';
        // <<<< to remove  "issues" from "this.state.data['x-axis-field']" >>>>>
        this.state.data['x-axis-field'].split('.').forEach((str,index) => {
          if(index != 0) temp += str
          if(index != 0 && index != this.state.data['x-axis-field'].split('.').length-1) temp += '.'
        })
        cardInformation.x_axis = temp
        cardInformation.x_axis_type = this.state.data['x-axis-type']
      }
      else cardInformation.x_axis = this.props.template.meta.x_axis;
    }
    if (this.props.template.meta && this.props.template.meta.y_axis) {
      if(this.props.template.key === 'custom_report_2'){
        let temp = '';
        // <<<< to remove  "issues" from "this.state.data['x-axis-field']" >>>>>
        this.state.data['y-axis-field'].split('.').forEach((str,index) => {
          if(index != 0) temp += str
          if(index != 0 && index != this.state.data['y-axis-field'].split('.').length-1) temp += '.'
        })
        cardInformation.y_axis = temp
        // cardInformation.y_axis_type = this.state.data['x-axis-type']
        // console.log(this.state.data['y-axis-type']);
      }
      else cardInformation.y_axis = this.props.template.meta.y_axis;
    }

    if(this.props.template && this.props.template.key == "custom_report_2"){
      this.props.template.name = this.state.data.report_name || 'Custom Report'
    }

    this.props.data.cardInformation.card_template_id = this.props.template._id;
    this.props.data.cardInformation.key = this.props.template.key;
    this.props.data.cardInformation.cardInformation = cardInformation;
    //  if(this.state.primaryView==false&&cardInformation.jql==""){
    //   this.setState({ errors: { jql: "JQL is required" } })
    //  }
this.setState({onSaveLoad:true})
        if (cardInformation.jql||cardInformation.custom_jql) {
          let isCustomJQL=(this.state.primaryView&&!this.state.isCustomJQLTemplate)?false:true
        
          if(isCustomJQL){
            this.props.data.cardInformation.cardInformation.primaryView=false
          }
        let jqlToValidate=isCustomJQL?cardInformation.custom_jql:cardInformation.jql
          axios
            .post(
              "/bot/api/skill/" +
                this.props.match.params.wId +
                "/verifyJql/" +
                this.props.match.params.wId,
              { jql: jqlToValidate }

            )
            .then(res => {
              this.setState({onSaveLoad:false})
              if (res.data.success) {
                if(res.data.items.total > res.data.items.maxResults * 20) {
                  if(template.key !== 'get_issues_by_jql'){
                    message.warning(`JQL has issues more than report limit. Max issue limit: ${res.data.items.maxResults * 20}`,5)
                  }
                }
                this.props.nextStep();
              } else {
                // console.log(res.data.error)
                this.setState({ errors: {[isCustomJQL?"custom_jql":"jql"]: res.data.error.message } });
              }
            });
          // app.post("/skill/:id/verifyJql/:user_id", Jira.verifyJqlApi)
        }
        else {
          // if(this.validateProjects()){
            this.props.nextStep();
       
          // }
        }

      
    }          
  };

  getOptions = key => {
    const children = [];
    if (key === "get_projects") {
      this.props.projects.forEach((project, index) => {
        children.push(
          <Option key={index} name={key} value={project.key}>
            {project.name+ ` (${project.key})`}
          </Option>
        );
      });
    } else if (key === "select_JQL_template") {
      jqlTemplates().forEach((template, index) => {
        children.push(
          <Option key={index} name="select_template_jql" value={template.value}>
            {template.name}
          </Option>
        );
      });
    } else if (key === "x-axis-field") {
      let fields = getFields(this.props.fields, "x-axis");
      fields.forEach((field, index) => {
        field && field.value && children.push(
          <Option key={index} name="x-axis-field" value={field.value}>
            {field.name}
          </Option>
        );
      });
    } else if (key === "y-axis-field") {
      let fields = getFields(this.props.fields, "y-axis");
      fields.forEach((field, index) => {
        field && field.value && children.push(
          <Option key={index} name="y-axis-field" value={field.value}>
            {field.name}
          </Option>
        );
      });
    } else if (key === "date_range") {
      let range = Daterange();
      range.forEach((field, index) => {
        children.push(
          <Option key={index} name="date_range" value={field.value}>
            {field.name}
          </Option>
        );
      });
    } else if (key === "board") {
      this.props.boards.forEach((board, index) => {
        children.push(
          <Option key={index} name="boardId" value={board.id}>
            {board.name + ` (${board.type})`}
          </Option>
        );
      });
    } else if (key == "project_id") {
      this.props.projects.forEach((project, index) => {
        children.push(
          <Option key={index} name="project_id" value={project.key}>
            {project.name+` (${project.key})`}
          </Option>
        );
      });
    } else if (key == "days" || key == "jql_days") {


      let daysArr=[{name:"1 day",value:1},{name:"2 days",value:2},{name:"3 days",value:3},{name:"4 days",value:4},{name:"5 days",value:5},{name:"1 week",value:7},{name:"2 week",value:14}]
      daysArr.forEach((item, index) => {
        children.push(
          <Option key={item.value} name="days" value={item.value}>
            {item.name}
          </Option>
        );
      });
    }

    return children;
  };

  getThemeField = ({index}) => {
    return (
      <div key={index}>
        <div className='form-divide'>
          <b>Select Theme</b>
        </div>

        <Radio.Group value={this.state.data.report_theme} onChange={(e) => this.handleChange(e, "report_theme")}>
          <Tooltip title='Dark'>
            <Radio.Button value='dark'>
              <BulbFilled />
            </Radio.Button>
          </Tooltip>
          <Tooltip title='Light'>
            <Radio.Button value='default'>
              <BulbOutlined />
            </Radio.Button>
          </Tooltip>
        </Radio.Group>
      </div>
    );
  };

  getReporTypeField = ({index}) => {
    return <div key={index}>
              <div className="form-divide"><b>Report Type</b></div>
            <Radio.Group value = {this.state.data.report_type} onChange={e => this.handleChange(e, 'report_type')}>
            <Tooltip title="Bar chart">
              <Radio.Button value="column">
                <BarChartOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Line chart">
              <Radio.Button value="line">
                <LineChartOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Pie chart">
              <Radio.Button value="pie">
                <PieChartOutlined />
              </Radio.Button>
            </Tooltip>
            {/* <Tooltip title="Summary text">
              <Radio.Button value="summary">
                <OrderedListOutlined />
              </Radio.Button>
            </Tooltip> */}
          </Radio.Group>
              </div>
  }

  render() {
    // console.log(this.props.template);
    const forms = this.props.template.fields.map((field, index) => {
      if (field && field.type == "JQL" && this.props.template.meta && this.props.template.meta.custom_jql) {
        this.setState({ isCustomJQLTemplate: true })

        return <div key={index}>
          <div className="form-divide" style={{ fontWeight: 'bold' }}>Custom JQL Template (optional)</div>

          <Select
            showSearch
            // defaultValue={defaultTemplateJql}
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => { this.handleChange(value, "select_template_jql") }}
            placeholder="Select JQL Filter"
            value={this.state.data.select_template_jql}
            name="select_template_jql"
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
            {this.getOptions("select_JQL_template")}
          </Select>
          <div className="form-divide" style={{ fontWeight: 'bold' }}>Enter Your JQL</div>
          <TextArea
            className="custom_text_area"
            style={{ width: "100%" }}
            autoSize={{ minRows: 2 }}
            name="custom_jql"
            onChange={(value) => this.handleChange(value, "custom_jql")}
            placeholder={"Enter value"}
            value={this.state.data.custom_jql || this.state.data.jql}
          />
          {<span className="form-error">{this.state.errors.custom_jql}</span>}

        </div>
      }
      else if (field.type === "JQL") {

        return (
          <div key={index}>
            <div className="form-grouping">Issue Filters</div>
            <Radio.Group
              onChange={this.onChange}
              value={this.state.primaryView ? "Basic View" : "Custom JQL"}
            >
              <Radio value="Basic View" name="BasiccView">
                Basic View
              </Radio>
              <Radio value="Custom JQL" name="Custom JQL">
                Custom JQL
              </Radio>
            </Radio.Group>

            {this.state.primaryView ? (
              <div>
                <div className="form-divide"><b>Select A Project</b></div>

                <div className={this.state.errors.type == "field_missing" && !(this.state.data.projects && this.state.data.projects[0]) ? "ant-form-item-has-error" : ""}>

                  <Select
                    showSearch
                    autoClearSearchValue
                    // mode="tags"
                    style={{ width: "100%" }}
                    onChange={(e) => this.handleChange([e], "projects")}
                    placeholder="Select project"
                    // tokenSeparators={[","]}
                    name="projects"
                    value={this.state.data.projects ? this.state.data.projects[0] : null}
                    required={true}
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
                    {this.getOptions("get_projects")}
                  </Select>
                  {this.state.errors.type == "field_missing" && !(this.state.data.projects && this.state.data.projects[0]) && <span className="ant-form-item-explain">Project is required</span>}

                </div>
                <div className="form-divide"><b>Select Board (Optional)</b></div>
                {/* <div className={this.state.errors.type=="field_missing" && !(this.state.data.boardId ) ?"ant-form-item-has-error":""}> */}
                <Select
                  showSearch
                  autoClearSearchValue
                  allowClear={true}
                  style={{ width: "100%" }}
                  value={this.state.data.board ? this.state.data.board.id : ""}
                  onChange={(e) => this.handleChange(e, "boardId")}
                  placeholder="select a board"
                  name="boardId"
                  loading={this.state.loadBoard}
                  disabled={!(this.state.data["projects"] && this.state.data["projects"].length > 0)}
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
                  {this.getOptions("board")}

                </Select>
                {/* { this.state.errors.type=="field_missing"&& !(this.state.data.boardId ) && <span className="ant-form-item-explain">Board is required</span>} */}
                {/* </div> */}
                {/* <div className="form-divide">Custom JQL template</div> */}
                {/* 
                <Select
                showSearch
                  // defaultValue={defaultTemplateJql}
                  allowClear
                  style={{ width: "100%" }}
                  onChange={(value)=>{this.handleChange(value,"select_template_jql")}}
                  placeholder="Select JQL Filter"
                  value={this.state.data.select_template_jql}
                  name="select_template_jql"
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
                  {this.getOptions("select_JQL_template")}
                </Select> */}
                {<div className="form-divide">
                  <div>Generated JQL (Read only)</div>
                  <textarea
                    // className="custom_text_area"
                    className={localStorage.getItem('theme') == "dark" ? " custom_text_area_dark" : "custom_text_area"}
                    style={{ width: "100%" }}
                    name="Generated_jql"
                    readOnly
                    value={getProjectText(
                      this.state.data,
                      this.state.editmode,
                      //bellow value not used in "onsave"
                      // field.default_jql
                    )}
                    placeholder="Enter value"
                  />
                  {<span className="form-error">{this.state.errors.jql}</span>}
                </div>}
              </div>
            ) : (
              <div className="form-divide" key={index}>
                <div className="form-divide">Enter your JQL</div>
                <TextArea
                  className="custom_text_area"
                  style={{ width: "100%" }}
                  name="custom_jql"
                  onChange={(value) => this.handleChange(value, "custom_jql")}
                  placeholder={"Enter value"}
                  rows={this.state.data.custom_jql && this.state.data.custom_jql.length > 100 ? 4 : 2}
                  // value={this.state.data.custom_jql ? this.state.data.custom_jql : getProjectText(this.state.data,this.state.editmode)}
                  value={this.state.data.custom_jql}
                // value={getProjectText(
                //   this.state.data,
                //   this.state.editmode,
                //   //bellow value not used in "onsave"
                //   // field.default_jql
                // )}
                />
                {<span className="form-error">{this.state.errors.custom_jql}</span>}
                {
                  this.props.template.fields.find(field => field.key === 'report_theme') && this.getThemeField({ index })
                }
                {this.props.template.fields.find(field => field.key === 'report_type') && this.getReporTypeField({ index })}

              </div>
            )}
          </div>
        );
      } else if (field.type === "dynamic_jira_fields_report") {
        let fieldKey = field.key;

        return (
          <div className="form-divide" key={index}>
            {fieldKey === "x-axis-field" && (
              <div className="form-grouping1"><b>Report Chart Details</b></div>
            )}
            {fieldKey === "x-axis-field" && (
              <div>
                <div className="form-divide">
                  X-Axis{" "}
                  {
                    <span className="form-error">
                      {this.state.errors["x-axis-field"]}
                    </span>
                  }
                </div>

                <Select
                  showSearch
                  autoClearSearchValue
                  style={{ width: "100%" }}
                  onChange={(e) => this.handleChange([e], 'x-axis-field')}
                  placeholder="X-Axis"
                  value={this.state.data["x-axis-field"]}
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
                  {this.getOptions("x-axis-field")}
                </Select>
              </div>
            )}
            {fieldKey === "y-axis-field" && (
              <div>
                <div className="form-divide">
                  Y-Axis{" "}
                  {
                    <span className="form-error">
                      {this.state.errors["y-axis-field"]}
                    </span>
                  }
                </div>

                <Select
                  showSearch
                  autoClearSearchValue
                  style={{ width: "100%" }}
                  onChange={(e) => this.handleChange([e], 'y-axis-field')}
                  placeholder="Y-Axis"
                  value={this.state.data["y-axis-field"]}
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
                  {this.getOptions("y-axis-field")}
                </Select>
              </div>
            )}
          </div>
        );
      } else if (this.state.primaryView == true) {



        let fieldHtml = ""

        if (field.type === "report-title") {

          // fieldHtml=     <div key={index}>
          //       <div className="form-divide">
          //         Report Title
          //         <span className="optional">(Optional)</span>
          //       </div>
          //       <textarea
          //         className="custom_text_area"
          //         style={{ width: "100%" }}
          //         name="report-title"
          //         onChange={this.handleChange}
          //         placeholder={"Enter title"}
          //         value={this.state.data["report-title"]}
          //       />
          //     </div>

          fieldHtml = <div key={index}>
            <div className="form-divide"><b>Report Title</b></div>
            <Input required value={this.state.data.report_name} onChange={e => this.handleChange(e, 'report_name')} placeholder='Report Name' />
          </div>

        } else if (field.type === "dynamic_jira_fields_select") {

          fieldHtml = <JiraDynamicFieldSelect
            template={this.props.template}
            field={field}
            fields={this.props.fields}
            data={this.state.data}
          />

        } else if (field.type === "number_field") {

          fieldHtml = <NumberField
            template={this.props.template}
            field={field}
            data={this.state.data}
          />

        } else if (field.type === "board_sprint_select") {
          fieldHtml = <BoardSprintSelect
            template={this.props.template}
            field={field}
            fields={this.props.fields}
            boardId={this.state.data.boardId}
            data={this.state.data}
          />

        } else if (field.type === "epic_select") {

          fieldHtml = <EpicSelect
            template={this.props.template}
            field={field}
            data={this.state.data}
          />

        } else if (field.type === "date_range") {

          fieldHtml = <div key={index}>
            <div className="form-divide">
              Date Range{" "}
              {
                <span className="form-error">
                  {this.state.errors["date_range"]}
                </span>
              }
            </div>

            fieldHtml=     <Select
              showSearch
              autoClearSearchValue
              style={{ width: "100%" }}
              onChange={this.handleChange}
              placeholder="Date Range"
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
              {this.getOptions("date_range")}
            </Select>
          </div>

        } else if (field.type === "boards_select" || field.type === "project_board_select") {

          fieldHtml = <div key={index}>
            <div className={index !== 0 ? "form-divide" : ""}>
              Select a Board{" "}
              {/* {
                <span className="form-error">
                  {this.state.errors["boards"]}
                </span>
              } */}
            </div>
            <Select
              showSearch
              autoClearSearchValue
              style={{ width: "100%" }}
              value={this.state.data["boardId"]}
              onChange={(e) => this.handleChange(e, "boardId")}
              placeholder="select a board"
              name="boardId"
              loading={this.state.loadBoard}
              disabled={field.type === "project_board_select" && !this.state.data.project_id}
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
              {this.getOptions("board")}
            </Select>
          </div>

        }
        else if (field.type === 'velocity_estimation_select') {
          fieldHtml = <div key={index}>
            <div className={index !== 0 ? "form-divide" : ""}>
              Estimation Statistic{" "}
              {/* {
            <span className="form-error">
              {this.state.errors["boards"]}
            </span>
          } */}
            </div>
            <Select
              style={{ width: "100%" }}
              value={this.state.data.velocity_estimation}
              onChange={(e) => this.handleChange(e, "velocity_estimation")}
            // placeholder="select a board"
            // name="boardId"
            // loading={this.state.loadBoard}
            // disabled={ field.type === "project_board_select" &&  !this.state.data.project_id}
            >
              <Option key={'story_points'} value={'story_points'}>Story Points</Option>
              <Option key={'original_time_estimate'} value={'original_time_estimate'}>Original Time Estimate</Option>
              <Option key={'issue_count'} value={'issue_count'}>Issue Count</Option>
            </Select><br />
            <Text type='secondary'>This field should match the one configured in the corresponding board in Jira</Text>
          </div>
        }
        else if (field.type === "project_select") {

          fieldHtml = <div key={index}>
            <div className="form-divide">
              <b>Select a project</b>{" "}
              {
                <span className="form-error">
                  {this.state.errors["boards"]}
                </span>
              }
            </div>
            <Select
              showSearch
              autoClearSearchValue
              style={{ width: "100%" }}
              value={this.state.data.project_id}
              onChange={(e) => this.handleChange(e, "project_id")}
              placeholder="Select a project"
              name="project_id"
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
              {this.getOptions("project_id")}
            </Select>
          </div>

        }
        else if (field.type === 'project_select_custom') {
          fieldHtml = <div key={index}>
            <div className="form-divide"><b>Select A Project</b></div>

            <div className={this.state.errors.type == "field_missing" && !(this.state.data.projects && this.state.data.projects[0]) ? "ant-form-item-has-error" : ""}>

              <Select
                showSearch
                autoClearSearchValue
                // mode="tags"
                style={{ width: "100%" }}
                onChange={(e) => this.handleChange([e], "projects")}
                placeholder="Select project"
                // tokenSeparators={[","]}
                name="projects"
                value={this.state.data.projects ? this.state.data.projects[0] : null}
                required={true}
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
                {this.getOptions("get_projects")}
              </Select>
              {/* { this.state.errors.type=="field_missing"&& !(this.state.data.projects && this.state.data.projects[0]) && <span className="ant-form-item-explain">Project is required</span>} */}

            </div>
          </div>
        }
        else if (field.type === 'project_board_select_custom') {
          fieldHtml = <div key={index}>
            <div className="form-divide"><b>Select Board (Optional)</b></div>
            {/* <div className={this.state.errors.type=="field_missing" && !(this.state.data.boardId ) ?"ant-form-item-has-error":""}> */}
            <Select
              showSearch
              autoClearSearchValue
              allowClear={true}
              style={{ width: "100%" }}
              value={this.state.data.board ? this.state.data.board.id : ""}
              onChange={(e) => this.handleChange(e, "boardId")}
              placeholder="select a board"
              name="boardId"
              loading={this.state.loadBoard}
              disabled={!(this.state.data["projects"] && this.state.data["projects"].length > 0)}
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
              {this.getOptions("board")}

            </Select>

            <div className='form-divide'>
              <div>Generated JQL (Read only)</div>
              <textarea
                // className="custom_text_area"
                className={localStorage.getItem("theme") == "dark" ? " custom_text_area_dark" : "custom_text_area"}
                style={{ width: "100%" }}
                name='Generated_jql'
                readOnly
                value={getProjectText(
                  this.state.data,
                  this.state.editmode
                  //bellow value not used in "onsave"
                  // field.default_jql
                )}
                placeholder='Enter value'
              />
              {<span className='form-error'>{this.state.errors.jql}</span>}
            </div>
          </div>
        }
        else if (field.type === 'report-type') {
          //     fieldHtml = <div key={index}>
          //     <div className="form-divide"><b>Report Type</b></div>
          //   <Radio.Group value = {this.state.data.report_type} onChange={e => this.handleChange(e, 'report_type')}>
          //   <Tooltip title="Bar chart">
          //     <Radio.Button value="column">
          //       <BarChartOutlined />
          //     </Radio.Button>
          //   </Tooltip>
          //   <Tooltip title="Line chart">
          //     <Radio.Button value="line">
          //       <LineChartOutlined />
          //     </Radio.Button>
          //   </Tooltip>
          //   <Tooltip title="Pie chart">
          //     <Radio.Button value="pie">
          //       <PieChartOutlined />
          //     </Radio.Button>
          //   </Tooltip>
          //   {/* <Tooltip title="Summary text">
          //     <Radio.Button value="summary">
          //       <OrderedListOutlined />
          //     </Radio.Button>
          //   </Tooltip> */}
          // </Radio.Group>
          //     </div>
          fieldHtml = this.getReporTypeField({ index })
        }
        else if (field.type === 'report-theme') {
          //     fieldHtml = <div key={index}>
          //     <div className="form-divide"><b>Select Theme</b></div>

          //   <Radio.Group value = {this.state.data.report_theme} onChange={e => this.handleChange(e, 'report_theme')}>
          //   <Tooltip title="Dark">
          //     <Radio.Button value="dark">
          //       <BulbFilled />
          //     </Radio.Button>
          //   </Tooltip>
          //   <Tooltip title="Light">
          //     <Radio.Button value="default">
          //       <BulbOutlined/>
          //     </Radio.Button>
          //   </Tooltip>
          // </Radio.Group>
          //     </div>

          fieldHtml = this.getThemeField({ index })
        }
        else if (field.type === "jql_days") {

          fieldHtml = <div key={index}>
            <div className="form-divide">
              <b>Select Days</b>{" "}
              {
                <span className="form-error">
                  {this.state.errors["boards"]}
                </span>
              }
            </div>
            <Select
              showSearch
              autoClearSearchValue
              style={{ width: "100%" }}
              value={this.state.data.days}
              onChange={(e) => this.handleChange(e, "days")}
              placeholder="Select days"
              name="project_id"
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
              {this.getOptions("days")}
            </Select>
          </div>


        }

        return <div className={this.state.errors.type == "field_missing" && field.required && !this.state.data[field.key] ? "ant-form-item-has-error" : ""}>
          {fieldHtml}
          {this.state.errors.type == "field_missing" && field.required && !this.state.data[field.key] && <span className="ant-form-item-explain">Field is required</span>}
        </div>
      }
    });
    let { key } = this.props.template
    return (
      <div>
        {/* <Input
         
          style={{ width: "70%" }}
          name="Card_name"
          onChange={this.handleChange}
          placeholder={"Enter card name"}
          required
          value={this.state.data["Card_name"]}
        /> */}

        {forms}
        
        {(key==="jira_count_graph")&&this.props.skill_type != "app_home"?<div className="flex_column"  style={{marginBottom:10,marginTop:10}}>
                               <div className="form_group_label" >Send As</div>
     <Form.Item style={{margin:0}}>
    <Radio.Group onChange={(e)=>this.handleChange(e,"send_as")}  value={this.state.data.send_as||"graph"} name="send_as" style={{display:"flex"}}>
       <Radio className="radio_styl" value="graph">Graph</Radio>
       <Radio className="radio_styl" value="summary">Summary</Radio>
         </Radio.Group>
         </Form.Item></div>:""}
         {(key==="get_issues_by_jql")&&this.props.skill_type != "app_home"?<div className="flex_column"  style={{marginBottom:10,marginTop:10}}>
                               <div className="form_group_label" >Mention Assignee</div>
     <Form.Item style={{margin:0}}>
    <Radio.Group onChange={(e)=>this.handleChange(e,"mention")}  value={this.state.data.mention||null} name="mention" style={{display:"flex"}}>
       <Radio className="radio_styl" value="assignee">Yes</Radio>
       <Radio className="radio_styl" value={null}>No</Radio>
         </Radio.Group>
         </Form.Item></div>:""}
        <div
          style={{
            marginBottom: 2,
            display: "flex",
            justifyContent: "end",
            marginTop: "24px"
          }}
        >
          {/* <Button type="default" onClick={this.storeValues} style={{marginLeft:"10px"}} >
                   Back
               </Button> */}
          <Button
            type="primary"
            loading={this.state.onSaveLoad}
            onClick={this.onSave}
            style={{ marginLeft: "400px" }}
          >
            {this.props.skill_type == "app_home"
              ? this.props.mode === "edit"
                ? "Update"
                : "Save"
              : "Next"}
          </Button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  // console.log(state);
  return {
    projects: state.skills.projects,
    fields: state.skill_builder.fields,
    boards: state.skills.jiraBoards
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getProject,
    getJiraIssueNodeFields,
    saveCard,
    updateCard,
    getJiraBoards
  })(CardForms)
);
