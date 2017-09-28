import actionTypes from './adminActionTypes';
import fileSaver from 'file-saver';
import { firebaseAuth } from '../../config';
import momentTZ from 'moment-timezone';

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

export function setDownloadFile(dropoffID, dataType) {
  return async dispatch => {
    try {
      const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
      const response = await fetch('/admin/download/data-file', {
        method: 'POST',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          firebaseAccessToken,
          dropoffID,
          dataType,
        }),
      });

      fileSaver.saveAs(new Blob([await response.blob()], {type: "text/csv"}), `${dataType}${momentTZ.tz(new Date(), 'America/New_York').format('MM_DD_YYYY_hhmm')}.csv`);
      return await dispatch({
        type: actionTypes.DOWNLOAD_DATA_FILE,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
