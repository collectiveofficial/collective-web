import actionTypes from './adminActionTypes';
import { firebaseAuth } from '../../config';

export function selectDashboardPage(text) {
  return {
    type: actionTypes.SELECT_DASHBOARD_PAGE,
    text,
  };
}

export function setAuthorizeAdmin(bool) {
  return {
    type: actionTypes.AUTHORIZE_ADMIN,
    bool,
  };
}

export function setAdminData(dataArr) {
  return {
    type: actionTypes.SET_ADMIN_DATA,
    dataArr,
  };
}

export async function setDownloadUrl(dropoffID, dataType) {
  // const isSummary = false;
  // const isFoodBallots = false;
  // const isParticipantData = false;
  const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
  const response = await fetch('/admin/download', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      firebaseAccessToken,
      dropoffID,
      dataType,
    }),
  });
  const responseData = await response.json();
  const url = responseData.url;
  return {
    type: actionTypes.DOWNLOAD_PARTICIPANT_DATA,
    url,
  };
}
