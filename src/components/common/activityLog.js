import axios from "axios";

export function addActivityLog(wid, msg, type, value) {
  // console.log("sending activity log request")
  axios.post("/bot/api/" + wid + "/activityLog", { msg, type, value });
}
