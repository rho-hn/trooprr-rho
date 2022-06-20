import React, { Component } from 'react'

 class Forms extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
export default Forms


// const forms = this.props.data.fields.map((field,index) => {

//     if (field.type === "JQL") {
//       let forms = this.state.primaryView ? (
       
//         <div className="form-divide" key={index}>
          
//           <div className="">
//             Select A Project {<span className="form-error">{this.state.errors.jql}</span>}
//           </div>
       
//           <Select
//             autoClearSearchValue
//             mode="tags"
//             style={{ width: "100%" }}
//             onChange={this.handleChange}
//             placeholder="Select project"
//             tokenSeparators={[","]}
//             // defaultValue={this.state.data.projects}
//           >
//             {this.getOptions("get_projects")}
//           </Select>

//           <div  className="form-divide">
//             Custom JQl template 
//             {<span className="form-error">{this.state.errors.jql}</span>}
//           </div>
         
//           <Select
//             autoClearSearchValue
//             style={{ width: "100%" }}
//             onChange={this.handleChange}
//             placeholder="Select JQL Filter"
//             // defaultValue={this.state.data.select_template_jql}
//           >
//             {this.getOptions("select_JQL_template")}
//           </Select>


//           <div className="form-divide">
//           <div >
//             Generated JQL (Read only)
//           </div>
         
//           <textarea
         
//             className="custom_text_area"
//             style={{ width: "100%" }}
//             name="Generated_jql"
//             readOnly
//            value={getProjectText(this.state.data)}
//             placeholder="Enter value"
//           />
      
//         </div>
//         </div>
//       ) : (
//         <div className="form-divide" key={index}>
//           <div className="form-divide">
//             Enter your JQL   {<span className="form-error">{this.state.errors.jql}</span>}
//           </div>
        
//           <textarea
//             className="custom_text_area"
//             style={{ width: "100%" }}
//             name="custom_jql"
//             onChange={this.handleChange}
//             placeholder={"Enter value"}
//           />
//         </div>
//       );
//       return forms;
//     } else if (field.type === "dynamic_jira_fields_report") {
//       let fieldKey = field.key;

//       return (
//         <div className="form-divide" key={index}>
//           {fieldKey === "x-axis-field" &&<div className="form-grouping1">Report Chart Details</div>}
//           {fieldKey === "x-axis-field" && (
//             <div>

//           <div className="form-divide">
//             X-Axis {<span className="form-error">{this.state.errors["x-axis-field"]}</span>}
//           </div>
     
//               <Select
//                 autoClearSearchValue
//                 style={{ width: "100%" }}
//                 onChange={this.handleChange}
//                 placeholder="X-Axis"
//                 // defaultValue={this.state.data["x-axis-field"]}
//               >
//                 {this.getOptions("x-axis-field")}
//               </Select>
//             </div>
//           )}
//           {fieldKey === "y-axis-field"&&<div>

//           <div className="form-divide">
//             Y-Axis {<span className="form-error">{this.state.errors["y-axis-field"]}</span>}
//           </div>
       
//           <Select
//                 autoClearSearchValue
//                 style={{ width: "100%" }}
//                 onChange={this.handleChange}
//                 placeholder="Y-Axis"
//                 // defaultValue={this.state.data["y-axis-field"]}
//               >
//                 {this.getOptions("y-axis-field")}
//               </Select>
//           </div>}
//         </div>
//       );
//     }
//     else if(field.type==="report-title"){
//       return <div key={index}>
//       <div className="form-divide">
//         Report Title
//          <span className="optional">(Optional)</span>
//       </div>
//       <textarea
//         className="custom_text_area"
//         style={{ width: "100%" }}
//         name="report-title"
//         onChange={this.handleChange}
//         placeholder={"Enter title"}
//         // defaultValue={this.state.data["report-title"]}
//       />
//     </div>
//     }else if(field.type==="date_range"){
// return <div key={index}> 

// <div className="form-divide">
// Date Range {<span className="form-error">{this.state.errors["date_range"]}</span>}
// </div>

// <Select
//     autoClearSearchValue
//     style={{ width: "100%" }}
//     onChange={this.handleChange}
//     placeholder="Date Range"
//   >
//     {this.getOptions("date_range")}
//   </Select>
// </div>
//     }
//   });