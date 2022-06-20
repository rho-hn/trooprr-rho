import axios from 'axios';
import { SET_SMART_REMINDERS,
         ADD_SMART_REMINDER,
         UPDATE_SMART_REMINDER,
         DELETE_SMART_REMINDERS,
         GET_SMART_REMINDER_TEMPLATE,
        //  SMART_REMINDERS_RUN_NOW,
         DELETE_SMART_REMINDER
       } 
from './types';

export function setSmartReminders( reminders ) {
   return {
      type:SET_SMART_REMINDERS,
      reminders
   };
 }

export function addSmartReminderStore( reminder ) {
	 return {
		 type:ADD_SMART_REMINDER,
		 reminder
	};
}

export function editSmartReminder( reminder ) {
	 return {
		 type:UPDATE_SMART_REMINDER,
		 reminder
	};
}

export function removeSmartReminder( id ) {
	 return {
		 type:DELETE_SMART_REMINDERS,
		 id
	};
}

export function setSmartRemindersTemplate( template ) {
   return {
     type:GET_SMART_REMINDER_TEMPLATE,
     template
  };
}

export function reminderDelete( id ) {
   return {
     type: DELETE_SMART_REMINDER,
     id
  };
}

// export function reminderRunNow( runNow ) {
//    return {
//       type: SMART_REMINDERS_RUN_NOW,
//       runNow
//    };
//  }

export function getSmartReminderTemplate( ) {
   return dispatch => {
     return axios.get("/bot/skill/getSmartReminderTemplate")
                 .then(res => {
                   if(res.data.success) {
                     dispatch(setSmartRemindersTemplate(res.data.reminders));
                   }
      return res;
    });
  }
}

export function getSmartReminders( wId ) {
   return dispatch => {
     return axios.get("/api/workspace/"+wId+"/getSmartReminder")
                 .then(res => {
                   if(res.data.success) {
                     dispatch(setSmartReminders(res.data.reminders));
                   }
      return res;
    });
  }
}

export function addSmartReminder( wId, data ) {
   return dispatch => {
     return axios.post("/api/workspace/"+wId+"/addSmartReminder",data)
                .then(res => {
                  if(res.data.success) {
                    dispatch(addSmartReminderStore(res.data.reminder));
                  }
      return res;
    });
  }
}

export function updateReminder( wId, rId, data ) {
   return dispatch => {
     return axios.put("/api/workspace/"+wId+"/updateSmartReminder/"+rId,data)
                 .then(res => {
                   if (res.data.success) {
                    dispatch(editSmartReminder(res.data.reminder));
                   }
      return res;
    });
  }
}

export function deleteSmartReminder( wId, rId ) {
   return dispatch => {
     return axios.delete("/api/workspace/"+wId+"/updateReminder/"+rId)
                 .then(res => {
                   if(res.data.success) {
                     dispatch(removeSmartReminder(rId));
                   }
      return res;
    });
  }
}

export function smartReminderRunNow( workspace_id, reminder_id ) {
   return dispatch => {
     return axios.get("/bot/skill/"+workspace_id+"/smartReminderRunNow/"+reminder_id)
                 .then(res => {
                   if(res.data.success) {
                     // dispatch(reminderRunNow(res.d));
                   }
      return res;
    });
  }
}

export function smartReminderDelete( id, rid ) {
   return dispatch => {
     return axios.delete("/bot/skill/"+id+"/deleteReminder/"+rid)
                 .then(res => {
                   if(res.data.success) {
                     dispatch(reminderDelete(rid));
                   }
      return res;
    });
  }
}




