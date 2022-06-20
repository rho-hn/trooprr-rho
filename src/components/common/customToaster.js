import { toast } from 'react-toastify';

export default {
  // Keep the signature of the original toast object
  // Doing so you can pass additionnal options
  success(msg, options = {}){
    return toast.success(msg, {
      // Merge additionals options
      ...options
    });
  },
  error(msg, options = {}){
    return toast.error(msg, {
      ...options
    });
  },

  fileTooLarge(msg, options = {}){
  	return toast.error(msg, {
  		...options
  	})
  },
  taskDeleted(msg, options = {}){
    return toast.success(msg, {
      ...options
    })
  },
  sentReport(msg, options ={}){
    return toast.success(msg, {
      ...options
    })
  },
  deletedTaskNotif(msg,options = {}){
    return toast.error(msg, {
      ...options
    })
  },
  sectionDeleted(msg,options = {}){
    return toast.error(msg, {
      ...options
    })
  },
  sectionotNDeleted(msg,options = {}){
    return toast.error(msg, {
      ...options
    })
  },
  projectNotDeleted(msg,options = {}){
    return toast.error(msg, {
      ...options
    })
  },
  newGoogleLogin(msg,options = {}){
    return toast.error(msg, {
      ...options
    })
  },
  projectNotLeave(msg,options =  {}){
    return toast.error(msg,{
      ...options
    })
  }
}
