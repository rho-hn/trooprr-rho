

export function getProjectText(data,edit,jql){
   let resultJql=""
let projectText=""
if(data.projects){
let projects=data.projects
let text=projects.map(pro=>{
return `${pro}`
})
 projectText=text.length>0&&`Project in('${text}')`

} 
let templateText=""
  let selectTemplate=data.select_template_jql
  if(data.sub_type=="closed_issues" && data.days){
   
   templateText="resolution != Unresolved AND (status changed to Done after -"+data.days+"d)"
  }else if(data.sub_type=="issue_progressed" && data.days){
   templateText="status changed during (-"+data.days+"d,now())"
  }else if(data.sub_type=="issue_due"&& data.days ){
// if()


   templateText=data.days>1?"due > "+ (data.days-1)+"d AND due <="+ data.days+"d And resolution=Unresolved":"due > now() AND due <= 1d And resolution=Unresolved"

  }else if(data.sub_type=="missing_updates" && data.days){

   templateText= "resolution=Unresolved AND updated<=-"+data.days+"d"
  }else if(selectTemplate){
   templateText=data.select_template_jql
    }
 
    let connectingText=(projectText.length>0&&templateText.length>0)?" And ":""
    // console.log(projectText,"lkkk");
    
    resultJql=(projectText?projectText:"") +connectingText+templateText 
    if(!edit &&jql){
      
      resultJql+=(resultJql?" And "+jql:jql)

   }
   return resultJql
}

export function jqlTemplates(){
return [
{name:"Recently Closed Issues",
value:"resolution != Unresolved AND (status changed to Done after -1d)"},
{name:"Issues Closed Past Week",
value:"resolution != Unresolved AND (status changed to Done after -7d)"},
{name:"Issues Not Updated over a week",
value:"resolution=Unresolved  AND updated<=-7d ORDER BY created ASC"},
{name:"Overdue Issues",
value:"resolution=Unresolved  AND duedate <now()"},
{name:"Recently created issues",
value:"created > -1d"},
{name:"Issues due today",
value:"DueDate >= startOfDay() and DueDate <= endOfDay() And resolution=Unresolved "},

{name:"Issues Progressed yesterday",
value:"status changed during (-1d,now())"},
{name:"Issues Missing Estimates",
value:"resolution=Unresolved  AND originalEstimate is EMPTY ORDER BY created DESC"},
{name:"Issues ready for QA",
value:"status = 'Ready for QA' ORDER BY created DESC"},

// {name:"Daily Briefing",
// value:"assignee in (currentUser()) ORDER BY created DESC"},





]



}
export function getFields(data,path){
   // console.log(data)
if(data.length>0&&path==="x-axis"){
   let mapdata=[{
      name:"Assignee",value:""
   }
,
{
   "name":"Components",
   "value":""
},
{
   "name":"Issue Type",
   "value":""
},
{
   "name":"Priority",
   "value":""
},
// {
//    "name":"Project",
//    "value":""
// },
{
   "name":"Reporter",
   "value":""
},
// {
//    "name":"Resolution",
//    "value":""
// },
{
   "name":"Status",
   "value":""
},
{
   "name":"Labels",
   "value":""
},
// {
//    "name":"Sprint",
//    "value":""
// },
// {
//    "name":"Creator",
//    "value":""
// },

{
   "name":"Epic Link",
   "value":""
},
// {
//    "name":"Epic Status",
//    "value":"",

// },
//additions for custom report
{
   "name":"Affects versions",
   "value": "",
   "type":""
},
{
   "name": "Environment",
   "value": ""
},
{
   "name": "Fix versions",
   "value": ""
},
{
   "name":"Summary",
   "value":""
},
{
   "name":"Creator"
},
{
   "name": "Resolution"
},
{
   "name":"Issue color"
},
{
   "name":"Created"
},
{
   "name":"Change start date"
},
{
   "name":"Change completion date"
},
{
   "name":"Updated"
},
{
   "name":"Due date"
},
{
   "name":"Sprint"
},

{
   "name":"this is not a field just for testing"
}
// {
//    "name":"Flagged"
// }
]
let fields=mapdata.map(field=>{
let fieldName=field.name;


let fieldValue=data.find(el=>el.text===fieldName)

if(fieldValue){
   return {
      name:fieldName,
      value:fieldValue.value,
      type:fieldValue.type
   }
}

})
// let fieldValues=[...fields,{name:'Date Range',value:'issues.fields.troopr_date_range'}]
let fieldValues=[...fields]
return fieldValues
}
else if(data.length>0) {
// let fields=data.filter(field=>field.type==="number").map(item=>{
   
//    return{name:item.text,value:item.value}})
// return fields


// <<< custom report >>>
const yfields = [
   {
      "name":"Story Points"
   },
   {
      "name":"Σ Original Estimate"
   },
   {
      "name":"Remaining Estimate"
   },
   {
      "name" : "Time Spent"
   }
]

let fields = yfields.map(field => {
   const fieldFount = data.find(Field => Field.text === field.name)

   if(fieldFount){
      return {
         name:fieldFount.text,
         value:fieldFount.value,
         type:fieldFount.type
      }
   }
})

let fieldValues=[{name:'Issue Count',value:'issues.fields.issue_count',type:'number'},...fields]
return fieldValues

// return [{name:'Issue Count',value:'issues.fields.issue_count',type:'number'}]

}
return []
}



export function Daterange(){

return [
   {
      "name" : "Daily",
      "value" : "daily",
      
  }, 
  {
      "name" : "Weekly",
      "value" : "weekly"
     
  }, 
  {
      "name" : "Monthly",
      "value" : "monthly"

  }
]

}
export function errors(err){
   // console.log(err)
   let obj={}
  err.forEach(el=>{
     let keys=Object.keys(el)
     let val=Object.values(el)
  obj[keys[0]]=val[0]
  })
return obj
}