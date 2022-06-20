import axios from "axios";

export function getWorkspaceActivityLog(wId) {
  return (dispatch) => {
    return axios.get(`/bot/api/workspace/${wId}/workspaceActivityLog`).then((res) => res);
  };
}

export function getWorkspaceCkecInActivies(wId) {
  return (dispatch) => {
    return axios.get(`/api/workspace/${wId}/workspaceCheckInActivities`).then((res) => res);
  };
}

export function getWorkspaceJiraNotificationsLog(wId) {
  return (dispatch) => {
    return axios.get(`/bot/api/workspace/${wId}/workspaceJiraNotificationsLog`).then((res) => res);
  };
}

export function getWorkspaceActiveUsers(wId) {
  return (dispatch) => {
    return axios.get(`/bot/api/workspace/${wId}/workspaceActiveUsers`).then((res) => res);
  };
}

export function updateGridMetrics(id) {
  return axios.get(`/bot/api/enterprise/${id}/updateGridMetrics`).then((res) => res.data);
}

export function getGridMetrics(id) {
  return axios.get(`/api/enterprise/${id}/getGridMetrics`).then((res) => res.data);
}

export function getGridLevelUsermapping(id) {
  return axios.get(`/bot/api/enterprise/${id}/getGridLevelUsermapping`).then((res) => res.data);
}

export function getGridDateWiseActivities(id) {
  return axios.get(`/bot/api/enterprise/${id}/getGridDateWiseActivities`).then((res) => res.data);
}

export const getWorkspaceDashboardChartData = (wId) => {
  return axios.get(`/bot/api/${wId}/getWorkspaceDashboardChartData`).then((res) => res.data);
};

// axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspacesActivityLog`)
// axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceJiraNotificationsLog`)
// axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceActiveUsers`)
// axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceCheckInActivities`)
