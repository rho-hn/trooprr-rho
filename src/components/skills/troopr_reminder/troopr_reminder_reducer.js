import { SET_SMART_REMINDERS,
    ADD_SMART_REMINDER,
    UPDATE_SMART_REMINDER,
    DELETE_SMART_REMINDERS,
    GET_SMART_REMINDER_TEMPLATE,
    // SMART_REMINDERS_RUN_NOW,
    DELETE_SMART_REMINDER 
} 
from './types';

const initialState = {
smartReminders:[],
smartRemindersTemplate: [],
// reminderRunNow: ''
};

export default (state = initialState, action = {}) => {
switch(action.type) {

case GET_SMART_REMINDER_TEMPLATE:
return {
    ...state,
    smartRemindersTemplate: action.template
};

case DELETE_SMART_REMINDER:
return {
    ...state,
    smartReminders: state.smartReminders.filter((reminder) => (reminder._id !== action.id))
};

// case SMART_REMINDERS_RUN_NOW:
// return {
//       ...state,
//       reminderRunNow: action.runNow
// };

case SET_SMART_REMINDERS:
return {
    ...state,
    smartReminders: action.reminders
};

case ADD_SMART_REMINDER:
return {
    ...state,
    smartReminders: [...state.smartReminders,action.reminder]
}

case  UPDATE_SMART_REMINDER:
return {
    ...state, 
    smartReminders: state.smartReminders.map( (reminder) => (reminder._id === action.reminder._id) ? action.reminder : reminder)
};

 
case DELETE_SMART_REMINDERS:
return{
    ...state,
    smartReminders: state.smartReminders.filter((reminder) => (reminder._id !== action.id))
};

default: 
return state;
}
}
