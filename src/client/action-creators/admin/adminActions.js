import actionTypes from './adminActionTypes';
import fileSaver from 'file-saver';
import { firebaseAuth } from '../../config';
import momentTZ from 'moment-timezone';
import _ from 'lodash';

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

export function setAdminFoodItems(dataArr) {
  return {
    type: actionTypes.SET_ADMIN_FOOD_ITEMS,
    dataArr,
  };
}

export function setDownloadFile(dropoffID, dataType) {
  return async (dispatch) => {
    try {
      const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
      const response = await fetch('/admin/data-file/download', {
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
      const blob = await response.blob();
      const formattedCurrentDate = momentTZ.tz(new Date(), 'America/New_York').format('MM_DD_YYYY_hhmm');
      await fileSaver.saveAs(new Blob([blob], { type: 'text/csv' }), `${dataType}${formattedCurrentDate}.csv`);
      return await dispatch({
        type: actionTypes.DOWNLOAD_DATA_FILE,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function setPickupTimeStart(dateTime) {
  return {
    type: actionTypes.SET_PICKUP_TIME_START,
    dateTime,
  };
}

export function setPickupTimeEnd(dateTime) {
  return {
    type: actionTypes.SET_PICKUP_TIME_END,
    dateTime,
  };
}

export function setVoteTimeBeg(dateTime) {
  return {
    type: actionTypes.SET_VOTE_TIME_BEG,
    dateTime,
  };
}

export function setVoteTimeEnd(dateTime) {
  return {
    type: actionTypes.SET_VOTE_TIME_END,
    dateTime,
  };
}

// export function setFoodItems(dateTime) {
//   return {
//     type: actionTypes.SET_FOOD_ITEMS,
//     dateTime,
//   };
// }

export function handlePrev(index) {
  if (index > 0) {
    return {
      type: actionTypes.SET_PREV_STEP,
      index: index - 1,
    };
  }
}

export function handleNext(index, stepProps, newBulkBuyInfo) {
  if (index < stepProps.length - 1) {
    return {
      type: actionTypes.SET_NEXT_STEP,
      index: index + 1,
    };
  } else if (index === stepProps.length - 1) {
    return async (dispatch) => {
      let bulkBuySaved = false;
      try {
        const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
        newBulkBuyInfo.intendedShipDate = newBulkBuyInfo.intendedPickupTimeStart.format('YYYY-MM-DD');
        const response = await fetch('/admin/new-bulk-buy/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            firebaseAccessToken,
            newBulkBuyInfo,
          }),
        });
        const responseData = response.json();
        if (responseData.bulkBuySaved) {
          bulkBuySaved = true;
          console.log('-----> bulkBuySaved: ', bulkBuySaved);
        }
      } catch (err) {
        console.log(err);
      }
      return dispatch({
        type: actionTypes.SUBMIT_NEW_BULK_BUY,
        bulkBuySaved,
      });
    };
  }
}

export function setSelectedFoodItems(dataArr, foodItem) {
  const hasItemAlready = _.some(dataArr, { name: foodItem.name });
  if (!hasItemAlready) {
    dataArr.push(foodItem);
  } else {
    _.remove(dataArr, item =>  JSON.stringify(item) === JSON.stringify(foodItem));
  }
  return {
    type: actionTypes.SET_SELECTED_FOOD_ITEMS,
    dataArr,
  };
}

export function setNewItem(text) {
  return {
    type: actionTypes.SET_NEW_ITEM,
    text,
  };
}

export function setNewImageUrl(text) {
  return {
    type: actionTypes.SET_NEW_IMAGE_URL,
    text,
  };
}
