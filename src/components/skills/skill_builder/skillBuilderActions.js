//Use the URL to bypass CORS issue :
import axios from 'axios';
import { 
      SET_CURRENT_SKILL,
      ADD_SKILL_NODE,
      UPDATE_SKILL_NODE,
      SET_CURRENT_NODE_OPERATION, 
      SET_CURRENT_SKILL_NODES, 
      CREATE_SKILL,
      SET_SKILL_SERVICES,
      SET_CUREENT_SERVICE_OPERATIONS,
      // GET_SKILL,  
      SET_SKILL_TEMPLATES,
      SET_SKILL_TEMPLATE_NODE,
      SET_SERVICE_OPERATIONS, 
      DELETE_SKILL_NODE,
      SET_FIELDS,
      SET_EPICS,
      ADD_EPICS
     } 
from './types';


  export function  setAllSkillService(services) {

    return {
      type: SET_SKILL_SERVICES,
      services
    };
  }

  export function setCurrentServiceOperation(operations) {
    return {
      type: SET_CUREENT_SERVICE_OPERATIONS,
      operations
    };
  }

  export function  updateCurrentSkill(skill) {
  // console.log(services)
  return {
    type: SET_CURRENT_SKILL,
    skill
  };
}

  export function setCurrentSkill(skill) {
    return {
      type: SET_CURRENT_SKILL,
      skill
    };
  }


  export function setCurrentSkillNodes(nodes) {
    return {
      type: SET_CURRENT_SKILL_NODES,
      nodes
    };
  }
 

    export function setCreateSkill(create_skill) {
    return {
      type: CREATE_SKILL,
      create_skill
    };
  }

  export function setSkillTemplates(skill_templates) {
    return {
      type: SET_SKILL_TEMPLATES,
      skill_templates
    };
  }

  export function setSkillTemplateNodes(skill_template_nodes) {
    return {
      type: SET_SKILL_TEMPLATE_NODE,
      skill_template_nodes
    };
  }

  export function  setCurrentNodeOperation(operation) {
    return {
      type: SET_CURRENT_NODE_OPERATION,
      operation
    };
  }

  export function  updateCurrentSkillNode(node) {
    return {
      type: UPDATE_SKILL_NODE,
      node
    };
  }
  export function addSkillNode(data) {
    return {
      type: ADD_SKILL_NODE,
      data
    };
  }

  export function setServiceOperation(operations) {
    return {
      type: SET_SERVICE_OPERATIONS,
      operations
    };
  }

  export function   removeSkillNode(data) {
    return {
      type: DELETE_SKILL_NODE,
      data
    };
  }
  export function  setFields(fields) {
    return {
      type: SET_FIELDS,
      fields
    };
  }
  export function    setEpics(epics) {
    return {
      type: SET_EPICS,
      epics
    };
  }

  export function    addEpics(epics) {
    return {
      type:ADD_EPICS,
      epics
    };
  }



export function getAllSkillService(){
return dispatch => {    
     return axios.get('/bot/api/services')
              .then(res =>{
                if(res.data.success){
                     dispatch(setAllSkillService(res.data.services))
                 }
      return res;
    })
 }
}

export function getServiceOperations(id){
return dispatch =>{    
       return axios.get(`/bot/api/services/${id}/operation`)
                .then(res => {
                  if(res.data.success){
                       dispatch(setCurrentServiceOperation(res.data.operations))
                   }
        return res;
      })
   }
  }

//Create empty skill
 export function createEmptySkill( id, skill ){
 return dispatch =>{    
       return axios.post('/bot/api/'+id+'/skills', skill)
                .then(res =>{
                  if(res.data.success){
                       dispatch(setCreateSkill(res.data.skill))
                       dispatch(setCurrentSkill(res.data.skill))
                   }
        return res;
      })
   }
  }

//Create skill with template data
 export function createSkill(wId, tId){
 return dispatch => {    
       return axios.post(`/bot/api/${wId}/skills/skill_template/${tId}`)
                 .then(res =>{
                    if(res.data.success){
                         /*dispatch(setSkillTemplateNodes(res.data.skill_template))
                         dispatch(setCurrentSkillNodes(res.data.skill_template))*/
                         dispatch(setCreateSkill(res.data.skill))
                         dispatch(setCurrentSkill(res.data.skill))
                     }
          return res;
        })
     }
  }

export function getCustomSKill(wid,sid){
return dispatch => {    
     return axios.get(`/bot/api/${wid}/skills/${sid}`)
                .then(res =>{
                  if(res.data.success){
                       dispatch(setCurrentSkill(res.data.skill))
                      }
                    })
                 }
             }

export function getCustomSKillNodes(wid,sid){
return dispatch =>{    
      return axios.get(`/bot/api/${wid}/skills/${sid}/skill_nodes`)
                  .then(res =>{
                    if(res.data.success){
                         dispatch(setCurrentSkillNodes(res.data.skill_nodes))
                     }
          return res;
        })
     }
 }

 //Get skill templates
export function getSkillTemplates(){
return dispatch =>{    
      return axios.get(`/bot/api/skill_templates`)
                  .then(res =>{
                    if(res.data.success){
                         dispatch(setSkillTemplates(res.data.skill_templates))
                     }
          return res;
        })
     }
  }

    
export function getNodeOperation(wid,sid,name){
return dispatch =>{    
       return axios.get(`/bot/api/${wid}/skills/${sid}/operation?name=${name}`)
                   .then(res =>{
                      if(res.data.success && res.data.operation){
                           dispatch(setCurrentNodeOperation(res.data.operation))
                       }
            return res;
          })
       }
    }

 export function updateNode(wid,snid,data){
 return dispatch => {    
       return axios.put(`/bot/api/${wid}/skill_nodes/${snid}`,data)
                   .then(res =>{
                      if(res.data.success){
                            dispatch(updateCurrentSkillNode(res.data.skill_node));
                        }
            return res;
          })
       }
   }

  export function createNode(wid,data){
  return dispatch => {    
               return axios.post(`/bot/api/${wid}/skill_nodes`,data)
                        .then(res =>{
                          if(res.data.success){
                               dispatch(addSkillNode(res.data))
                           }
                return res;
              })
          }
      }

  export function getServiceOperationsTriggers( ){
  return dispatch => {    
               return axios.get(`/bot/api/services_operations`)
                        .then(res =>{
                          if(res.data.success){
                               dispatch(setServiceOperation(res.data.operations))
                           }
                return res;
              })
          }
      }

  export function deleteNode(wid,snid){
  return dispatch => {    
                 return axios.delete(`/bot/api/${wid}/skill_nodes/${snid}`)
                          .then(res =>{
                            if(res.data.success){
                              res.data.deleted_node_id=snid              
                                 dispatch(removeSkillNode(res.data))
                             }
                return res;
              })
           }
       }
  
//skills 


    export function updateSkill(wid,sid,data){
      return dispatch => {    
            return axios.put(`/bot/api/${wid}/skills/${sid}`,data)
                        .then(res =>{
                           if(res.data.success){
                                 dispatch(updateCurrentSkill(res.data.skill))
                             }
                 return res;
               })
            }
        }

        export function deleteSkill(wid,sid){
          return dispatch => {    
                return axios.delete(`/bot/api/${wid}/skills/${sid}`)
                            .then(res =>{
                               if(res.data.success){

                                // /api/:wid/skills/:sid
                                     dispatch(setCurrentSkill({}))
                                 }
                     return res;
                   })
                }
            }


        export function getJiraIssueNodeFields(wid,query){
          return dispatch => {    
            return axios.get(`/bot/api/${wid}/getNodeFields?type=${query}`)
                     .then(res =>{
                       if(res.data.success){
                            dispatch(setFields(res.data.fields))
                        }
             return res;
           })
       }


            }

            export function getEpics(wid,query,project_id){
              return dispatch => {    
                return axios.get(`/bot/api/workspace/${wid}/epicPicker?epic_name=${query}&project_id=${project_id || ''}`)
                         .then(res =>{
                           if(res.data.success){
                             if(query){
                              dispatch(addEpics(res.data.epics))
                             }else{
                              dispatch(setEpics(res.data.epics))
                             }       
                            }
                 return res;
               })
           }
    
    
                }
    
    
          
         

  
 

       
  
 

