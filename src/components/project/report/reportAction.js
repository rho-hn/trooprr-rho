import { GETREPORT, REMOVEREPORT } from './types';
import axios from 'axios';

export const getReports = (wId,sId) => {
    return dispatch => {

     
        return axios.get(`/api/${wId}/squad/${sId}/reports`).then((res)=>{
            if(res && res.data.success){
                dispatch({type:GETREPORT,reports:res.data.data})
                return res;
            }else{
                dispatch({type:GETREPORT,reports:null})
            }
        })
    }    
}


export const removeReports = () => {
    return{
        type:REMOVEREPORT
    }
}