import { 
      SET_SKILLSSET_DATA,
      UPDATE_SKILL_NODE,
      ADD_SKILL_NODE, 
      SET_CURRENT_NODE_OPERATION,
      SET_CURRENT_SKILL, 
      SET_CURRENT_SKILL_NODES,
      SET_SKILLSSET_SKILLS, 
      SET_SKILLSET_SKILL_DATA,
      SET_SKILL_SERVICES,
      SET_CUREENT_SERVICE_OPERATIONS,
      CREATE_SKILL, 
      SET_SKILL_TEMPLATES,
      SET_SERVICE_OPERATIONS, 
      SET_SKILL_TEMPLATE_NODE ,
      DELETE_SKILL_NODE,
      SET_FIELDS,
      SET_EPICS,
      ADD_EPICS
  } from './types';


const initialState = {
   skillSetData: {},
   skillSetSkills: [],
   skillsetSkillData: {},
   services:[],
   operations:[],
   currentSkillNodes:[],
   currentSkill:{},
   skill:{},
   skillTemplates: [],
   skillTemplateNodes: {},
   currentNodeOperation:{},
   operations: [],
   fields:[],
   epics:[]
};

export default (state = initialState, action = {}) => {
        switch(action.type) {

        case SET_SKILLSSET_DATA:
        return {
             ...state, 
             skillSetData: action.ssData
         };

         case SET_SKILLSSET_SKILLS:
         return {
             ...state, 
             skillSetSkills: action.ssSkills
        };

        case SET_SKILLSET_SKILL_DATA:
        return {
             ...state, 
             skillsetSkillData: action.sssData
         };
      
        case SET_CUREENT_SERVICE_OPERATIONS:
        return {
                ...state, 
                operations: action.operations
              };

         case SET_SKILL_SERVICES:
         return {
                ...state, 
                services: action.services
         };

         case SET_CURRENT_SKILL_NODES:
        
         return {
                   ...state, 
                   currentSkillNodes: action.nodes
         };

              case ADD_SKILL_NODE:
                let skillNodes=state.currentSkillNodes
                skillNodes.push(action.data.new_skill_node)
                if(action.data.updated_child_node){
                        skillNodes=skillNodes.map(node=>(  node._id===action.data.updated_child_node._id? action.data.updated_child_node: node)  )      
                }
                return {
                        ...state, 
                        currentSkillNodes:skillNodes
                   };
              case UPDATE_SKILL_NODE:
        //       console.log("this is node seeting condition")
     
                return {
                        ...state, 
                        currentSkillNodes: state.currentSkillNodes.map(node=>(  node._id===action.node._id? action.node: node))
                   };
                case DELETE_SKILL_NODE:
                //    console.log("this is node seeting condition")
                        let nodes=state.currentSkillNodes
                        let newskillNodes=[]
                        nodes.forEach(node=>{
                               if(node._id!==action.data.deleted_node_id){
                                        if(action.data.updated_node &&action.data.updated_node._id===node._id ){
                                                        node=action.data.updated_node
                                        }
                                        newskillNodes.push(node)
                                }
                        })
                        return {
                           ...state, 
                           currentSkillNodes:newskillNodes
                      };
                   
                 
            
         case SET_CURRENT_SKILL:
         return {
                  ...state, 
                  currentSkill: action.skill
         };

         case CREATE_SKILL:
         return {
                 ...state, 
                 skill: action.create_skill
         };

         case SET_CURRENT_NODE_OPERATION:
         return {
                 ...state, 
                 currentNodeOperation: action.operation
         };

         case SET_SKILL_TEMPLATES:
         return {
                 ...state, 
                 skillTemplates: action.skill_templates
         };

         case SET_SKILL_TEMPLATE_NODE:
         return {
                 ...state, 
                 skillTemplateNodes: action.skill_template_nodes
        };

        case SET_SERVICE_OPERATIONS:
         return {
                 ...state, 
                 operations: action.operations
        };
        case   SET_FIELDS:
        return {
                ...state, 
                fields: action.fields
       };
       case          SET_EPICS:
        return {
                ...state, 
                epics:action.epics
       };
       case   ADD_EPICS:
        return {
                ...state, 
                epics:state.epics.concat(action.epics)
       };



   

        default: return state;
        }   
    }
