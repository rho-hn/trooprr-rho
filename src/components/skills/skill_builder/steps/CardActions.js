import axios from 'axios';
import {GET_CARDS,
    GET_TEMPLATE_CARDS,SAVE_CARDS,DELETE_CARD,UPDATE_CARD,ADD_CARD_SKILL,SET_CARD_SKILLS,UPDATE_CARD_SKILLS,DELETE_CARD_SKILL} from '../types';

export function setCardTemplates(cardTemplates) {
    return {
      type: GET_TEMPLATE_CARDS,
      cardTemplates
    };
  }
  export function setCards(cards){
    return{
      type:GET_CARDS,
      cards
    }
  }
  export function saveCards(card){
    return{
      type:SAVE_CARDS,
      card
    }
  }
  export function setDeleteCard(card){
    return{
      type:DELETE_CARD,
      card
    }
  }
  export function setUpdateCard(card){
return {
  type:UPDATE_CARD,
  card
}
  }
  export function setUpdateCardSkills(cardSkill){
    return {
      type:UPDATE_CARD_SKILLS,
      cardSkill
    }
      }
      export function setDeleteCardSkill(cardSkill){
        
        return {
          type:DELETE_CARD_SKILL,
          cardSkill
        }
          }
          export function setCardSkills(cardSkills){
            
            return {
              type:SET_CARD_SKILLS,
              cardSkills
            }
              }

              export function addCardSkill(cardSkill){
                
                return {
                  type:ADD_CARD_SKILL,
                  cardSkill
                }
                  }
 

  


   

  export function getCardTemplates(query){
    return dispatch => {    
       
    return  axios.get("/bot/api/cardTemplates?"+query)
            .then(res =>{
                      if(res.data.success){
                          dispatch(setCardTemplates(res.data.data))
                       }
            return res;
          })
       }
    }

    export function getCards(wid,userId){
      return dispatch => {    
         
      return  axios.get(`/bot/api/${wid}/cards/${userId}`)
              .then(res =>{
                        if(res.data.success){
                            dispatch(setCards(res.data.cards))
                         }
              return res;
            })
         }
      }

      export function saveCard(data){
        return dispatch => {    
        return   axios.post("/bot/api/cardnodes",data)
                .then(res =>{
                  if(res.data.success){         
              dispatch(saveCards(res.data))
                  }        
              return res;
              })
           }
        }

      export function deleteCard(id){
        return dispatch => {    
           
        return  axios.delete(`/bot/api/cards/${id}`)
                .then(res =>{
         if(res.data.success){                
              dispatch(setDeleteCard(res.data))
         }
                           
                return res;
              })
           }
        }

        export function updateCard(id,data){
          return dispatch => {    
             
          return  axios.put(`/bot/api/cards/${id}`,data)
                  .then(res =>{
           if(res.data.success){                
           }
                             
                  return res;
                })
             }
          }



          export function  getCardSkills(wId,type,app,dontSaveInStore){
            return dispatch => {    
              // console.log(data)
              let query="type="+type
              if(app){
                query+="&app="+app
              }
            return axios.get("/bot/api/workspace/"+wId+"/getCardSkills?"+query)
                    .then(res =>{
                      if(res.data.success && !dontSaveInStore){
                        dispatch(setCardSkills(res.data.CardSkills))
                      }
      
           
                    return res;
                  })
               }
            }


           
         
          export function saveCardSkills(data){
            return dispatch => {    
              // console.log(data)
            return   axios.post("/bot/api/addCardSkill",data)
                    .then(res =>{
                      if(res.data.success){
                 dispatch(addCardSkill(res.data.cardSkill))
                      }
                    return res;
                  })
               }
            }
            export function updateCardSkills(data){
              return dispatch => {    
              return axios.put(`/bot/api/updateCardSkill/${data._id}`,data)
                      .then(res =>{
                        if(res.data.success){
                         dispatch(setUpdateCardSkills(res.data.CardSkill))
                        }     
                      return res;
                    })
                 }
              }
            export function checkTriggerPharse(id,trigger,sid){
              return dispatch => { 
                let query="trigger="+trigger 
                if(sid){
                  query+="sId="+sid 
                
                }  
                // console.log(data)
              return   axios.get("/bot/api/"+id+"/checkTriggerPharse?"+query)
                      .then(res =>{
                    // dispatch(saveCards(res.data))
                                 
                      return res;
                    })
                 }
              }
  

      export function deleteCardSkill(id){
        return dispatch => {    
           
        return  axios.delete(`/bot/api/cardskill/${id}`)
                .then(res =>{
         if(res.data.success){                
              dispatch(setDeleteCardSkill(res.data.CardSkill))
         }
                           
                return res;
              })
           }
        }


        export function getUserInfo(){
         
          return dispatch => {    
          return   axios.get(`/bot/api/getUserInfo/${localStorage.getItem("trooprUserId")}`)
                  .then(res =>{
                return res;
                })
             }
          }


         
            
            export function excecuteCardSkill(id){

              return dispatch =>{    
                return   axios.get(`/bot/api/executeCardSkill/${id}`)
                        .then(res =>{
                      return res;
                      })
                   }
                }