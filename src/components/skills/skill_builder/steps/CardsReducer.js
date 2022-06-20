import {
GET_CARDS,
GET_TEMPLATE_CARDS,
SAVE_CARDS,DELETE_CARD,UPDATE_CARD_SKILLS,SET_CARD_SKILLS,ADD_CARD_SKILL,DELETE_CARD_SKILL
}
from "../types"

const initialState = {
   templateCards:[],
   getCards:[],
   card:{},
   deletedCard:{},
   cardSkills:[]

 };

 export default (state = initialState, action = {}) => {
    switch(action.type) {
        case GET_CARDS:
                     return {
                  ...state,
                  getCards:action.cards
              
              };
    case GET_TEMPLATE_CARDS:
    return {
        ...state,
        templateCards:action.cardTemplates

    }
 case SAVE_CARDS:
  //  console.log(action.card.data)
      return {
   ...state,
    card:action.card
      }
      case SET_CARD_SKILLS:
        // console.log(action.card.data)
           return {
        ...state,
           cardSkills:action.cardSkills
           }
           case ADD_CARD_SKILL:
            //
            // console.log("state.cardSkills",state.cardSkills);
            return {
              // automations:[ action.automation,...state.automations]
            ...state,
            cardSkills:[action.cardSkill,...state.cardSkills]
                    
            }
           case UPDATE_CARD_SKILLS:
            // console.log(state,"\what is this",action)
            return {
            ...state,
            cardSkills:state.cardSkills.map((item, index) => {
                    if (item._id===action.cardSkill._id) {

                      return action.cardSkill
                    }
                    return {
                      ...item
                    }
                  })
            }
                  case DELETE_CARD_SKILL:
                        return {
                          ...state,
                          cardSkills:state.cardSkills.filter((item, index) => {
                              return item._id!==action.cardSkill._id
                            })
                          }   




      case DELETE_CARD:
        return {...state,getCards:state.getCards.filter(item => item._id !== action.card.card._id)}
       

         
      default: return state;
    }
  }