const momentTZ = require('moment-timezone');
const json2csv = require('json2csv');
const fs = require('fs');
const dotenv = require('dotenv').config();
const models = require('../../database/models/index');
const userUtil = require('./user');
const transactionUtil = require('./transaction');
const ballotUtil = require('./ballot');
const foodUtil = require('./food');
const groupUtil = require('./group');
const locationUtil = require('./location');

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();

module.exports.doesDropoffExist = async (id) => {
  try {
    const doesDropoffExistResult = await models.Dropoff.findOne({
      where: {
        id,
      },
    });
    if (doesDropoffExistResult !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.populateDropoff = async (dropoff) => {
  try {
    await models.Dropoff.create({
      intendedShipDate: dropoff.intendedShipDate,
      intendedPickupTimeStart: dropoff.intendedPickupTimeStart,
      intendedPickupTimeEnd: dropoff.intendedPickupTimeEnd,
      shipDate: dropoff.shipDate,
      voteDateTimeBeg: dropoff.voteDateTimeBeg,
      voteDateTimeEnd: dropoff.voteDateTimeEnd,
      pricePerDormPackage: dropoff.pricePerDormPackage,
      pricePerCookingPackage: dropoff.pricePerCookingPackage,
      totalDormPackagesOrdered: dropoff.totalDormPackagesOrdered,
      totalCookingPackagesOrdered: dropoff.totalCookingPackagesOrdered,
      totalDollarAmount: dropoff.totalDollarAmount,
      pctFeePerPackage: dropoff.pctFeePerPackage,
      totalRevenueBeforeStripe: dropoff.totalRevenueBeforeStripe,
      totalRevenueAftereStripe: dropoff.totalRevenueAftereStripe,
      groupID: dropoff.groupID,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateFirstDropoffVoteTimeEnd = async (id, voteDateTimeEnd) => {
  try {
    await models.Dropoff.update({
      voteDateTimeEnd,
    }, {
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.findPctFeePerPackageForDrop = async (dropoffID) => {
  try {
    const findDropoffByIDResult = await models.Dropoff.findOne({
      where: {
        id: dropoffID,
      },
    });
    const pctFeePerPackage = findDropoffByIDResult.dataValues.pctFeePerPackage;
    return pctFeePerPackage;
  } catch (err) {
    console.log(err);
  }
};

module.exports.findIntendedPickupTimeEnd = async (id, groupID) => {
  try {
    const findIntendedPickupTimeEndResult = await models.Dropoff.findOne({
      where: {
        id,
        groupID,
      },
    });
    const intendedPickupTimeEnd = findIntendedPickupTimeEndResult.dataValues.intendedPickupTimeEnd;
    return intendedPickupTimeEnd;
  } catch (err) {
    console.log(err);
  }
};

module.exports.updatePickupTimeOnDropoff = async (id, pickupTimes) => {
  try {
    await models.Dropoff.update({
      intendedPickupTimeStart: pickupTimes.intendedPickupTimeStart,
      intendedPickupTimeEnd: pickupTimes.intendedPickupTimeEnd,
    }, {
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateDropoff = async (dropoff) => {
  try {
    await models.Dropoff.update({
      intendedShipDate: dropoff.intendedShipDate,
      intendedPickupTimeStart: dropoff.intendedPickupTimeStart,
      intendedPickupTimeEnd: dropoff.intendedPickupTimeEnd,
      voteDateTimeBeg: dropoff.voteDateTimeBeg,
      voteDateTimeEnd: dropoff.voteDateTimeEnd,
    }, {
      where: {
        id: dropoff.id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.findDeliveriesOrderedCount = async (id) => {
  try {
    const dropoffResult = await models.Dropoff.findOne({
      where: {
        id,
      },
    });
    if (dropoffResult !== null) {
      const deliveriesOrderedCount = dropoffResult.dataValues.deliveriesOrderedCount;
      return deliveriesOrderedCount;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.changeDeliveriesOrderedCount = async (id, deliveriesOrderedCount) => {
  try {
    await models.Dropoff.update({
      deliveriesOrderedCount,
    }, {
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.changeAllergiesCount = async (id, allergiesCount) => {
  try {
    await models.Dropoff.update({
      allergiesCount,
    }, {
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.findDropoffDateByID = async (id) => {
  try {
    const dropoff = await models.Dropoff.findOne({
      where: {
        id,
      },
    });
    const dropoffDate = dropoff.dataValues.intendedShipDate;
    return dropoffDate;
  } catch (err) {
    console.log(err);
  }
};

module.exports.findDateTimesByID = async (id) => {
  try {
    const dropoff = await models.Dropoff.findOne({
      where: {
        id,
      },
    });
    const dropoffObj = {
      intendedShipDate: dropoff.dataValues.intendedShipDate,
      intendedPickupTimeStart: dropoff.dataValues.intendedPickupTimeStart,
      intendedPickupTimeEnd: dropoff.dataValues.intendedPickupTimeEnd,
    };
    return dropoffObj;
  } catch(err) {
    console.log(err);
  }
};

module.exports.updatePackagesOrdered = async () => {
  try {
    for (let id = 1; id < 5; id++) {
      const dropoffPackagesOrdered = await transactionUtil.getDropoffPackagesOrdered(id);
      const totalDormPackagesOrdered = dropoffPackagesOrdered.dormPackagesOrdered;
      const totalCookingPackagesOrdered = dropoffPackagesOrdered.cookingPackagesOrdered;
      await models.Dropoff.update({
        totalDormPackagesOrdered,
        totalCookingPackagesOrdered,
      }, {
        where: {
          id,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateDropoffPackagesOrdered = async (id) => {
  try {
    const dropoffPackagesOrdered = await transactionUtil.getDropoffPackagesOrdered(id);
    const totalDormPackagesOrdered = dropoffPackagesOrdered.dormPackagesOrdered;
    const totalCookingPackagesOrdered = dropoffPackagesOrdered.cookingPackagesOrdered;
    await models.Dropoff.update({
      totalDormPackagesOrdered,
      totalCookingPackagesOrdered,
    }, {
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAdminData = async (uid) => {
  try {
    let data = [];
    const groupID = await userUtil.findGroupIDByUID(uid);
    const dropoffData = await models.Dropoff.findAll({
      where: {
        groupID,
      },
    });
    for (let i = 0; i < dropoffData.length; i++) {
      const id = dropoffData[i].dataValues.id;
      const locationID = dropoffData[i].dataValues.locationID;
      const locationObj = await locationUtil.findLocationByID(locationID);
      const intendedShipDate = dropoffData[i].dataValues.intendedShipDate;
      const intendedPickupDateTimeStart = await momentTZ.tz(dropoffData[i].dataValues.intendedPickupTimeStart, 'America/New_York');
      const intendedPickupDateTimeEnd = await momentTZ.tz(dropoffData[i].dataValues.intendedPickupTimeEnd, 'America/New_York');
      const voteDateTimeBeg = await momentTZ.tz(dropoffData[i].dataValues.voteDateTimeBeg, 'America/New_York');
      const voteDateTimeEnd = await momentTZ.tz(dropoffData[i].dataValues.voteDateTimeEnd, 'America/New_York');

      const formattedIntendedPickupDateTimeStart = await intendedPickupDateTimeStart.format('MM/DD/YYYY hh:mm A');
      const formattedIntendedPickupTimeEnd = await intendedPickupDateTimeEnd.format('hh:mm A');
      const formattedVoteDateTimeBeg = await voteDateTimeBeg.format('MM/DD/YYYY hh:mm A');
      const formattedVoteDateTimeEnd = await voteDateTimeEnd.format('MM/DD/YYYY hh:mm A');

      const foodItems = await ballotUtil.getFoodItemsByDropoffID(id);

      const totalDormPackagesOrdered = dropoffData[i].dataValues.totalDormPackagesOrdered;
      const totalCookingPackagesOrdered = dropoffData[i].dataValues.totalCookingPackagesOrdered;
      const customers = await transactionUtil.getCustomersForDropoff(id);
      const totalParticipants = customers.length;
      const netVolumeFromSalesAfterFees = await transactionUtil.findSalesAfterFeesByDropoffID(id);

      const currentDateTime = await momentTZ.tz(new Date(), 'America/New_York');
      let status = 'Incomplete';
      if (await currentDateTime.isBetween(voteDateTimeBeg, voteDateTimeEnd)) {
        status = 'Voting In Progress';
      }
      if (await currentDateTime.isBetween(voteDateTimeEnd, intendedPickupDateTimeStart)) {
        status = 'Voting Closed. Data Finalized For Admin.';
      }
      if (await currentDateTime.isBetween(intendedPickupDateTimeStart, intendedPickupDateTimeEnd)) {
        status = 'Bulk Buy In Progress';
      }
      if (await currentDateTime.isAfter(intendedPickupDateTimeEnd)) {
        status = 'Complete';
      }

      const dropoff = {
        id,
        locationObj,
        intendedShipDate,
        intendedPickupDateTimeStart,
        intendedPickupDateTimeEnd,
        voteDateTimeBeg,
        voteDateTimeEnd,
        formattedIntendedPickupDateTimeStart,
        formattedIntendedPickupTimeEnd,
        formattedVoteDateTimeBeg,
        formattedVoteDateTimeEnd,
        foodItems,
        totalDormPackagesOrdered,
        totalCookingPackagesOrdered,
        totalParticipants,
        netVolumeFromSalesAfterFees,
        status,
      };
      data.push(dropoff);
    }
    data = data.sortBy(dropoff => -new Date(dropoff.intendedPickupTimeStart));
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getDataFile = async (requestBody) => {
  try {
    let fields;
    let data;
    if (requestBody.dataType === 'summary') {
      fields = ['Date', 'Voting Window', 'Location','Dorm Packages Ordered', 'Cooking Packages Ordered', 'Total Packages Ordered', 'Total Participants', 'Net Volume from Sales', 'Status'];
      let summaryData = [];
      const groupID = await userUtil.findGroupIDByUID(requestBody.uid);
      const dropoffData = await models.Dropoff.findAll({
        where: {
          groupID,
        },
      });
      for (let i = 0; i < dropoffData.length; i++) {
        const id = dropoffData[i].dataValues.id;
        const locationID = dropoffData[i].dataValues.locationID;
        const locationObj = await locationUtil.findLocationByID(locationID);
        const location = locationObj.fullAddress;
        const intendedShipDate = dropoffData[i].dataValues.intendedShipDate;
        const intendedPickupDateTimeStart = await momentTZ.tz(dropoffData[i].dataValues.intendedPickupTimeStart, 'America/New_York');
        const intendedPickupDateTimeEnd = await momentTZ.tz(dropoffData[i].dataValues.intendedPickupTimeEnd, 'America/New_York');
        const voteDateTimeBeg = await momentTZ.tz(dropoffData[i].dataValues.voteDateTimeBeg, 'America/New_York');
        const voteDateTimeEnd = await momentTZ.tz(dropoffData[i].dataValues.voteDateTimeEnd, 'America/New_York');

        const formattedIntendedPickupDateTimeStart = await intendedPickupDateTimeStart.format('MM/DD/YYYY hh:mm A');
        const formattedIntendedPickupTimeEnd = await intendedPickupDateTimeEnd.format('hh:mm A');
        const formattedVoteDateTimeBeg = await voteDateTimeBeg.format('MM/DD/YYYY hh:mm A');
        const formattedVoteDateTimeEnd = await voteDateTimeEnd.format('MM/DD/YYYY hh:mm A');

        const totalDormPackagesOrdered = dropoffData[i].dataValues.totalDormPackagesOrdered;
        const totalCookingPackagesOrdered = dropoffData[i].dataValues.totalCookingPackagesOrdered;
        const customers = await transactionUtil.getCustomersForDropoff(id);
        const totalParticipants = customers.length;
        const netVolumeFromSalesAfterFees = await transactionUtil.findSalesAfterFeesByDropoffID(id);

        const currentDateTime = await momentTZ.tz(new Date(), 'America/New_York');
        let status = 'Incomplete';
        if (await currentDateTime.isBetween(voteDateTimeBeg, voteDateTimeEnd)) {
          status = 'Voting In Progress';
        }
        if (await currentDateTime.isBetween(voteDateTimeEnd, intendedPickupDateTimeStart)) {
          status = 'Voting Closed. Data Finalized For Admin.';
        }
        if (await currentDateTime.isBetween(intendedPickupDateTimeStart, intendedPickupDateTimeEnd)) {
          status = 'Bulk Buy In Progress';
        }
        if (await currentDateTime.isAfter(intendedPickupDateTimeEnd)) {
          status = 'Complete';
        }
        const dropoff = {
          Date: `${formattedIntendedPickupDateTimeStart} - ${formattedIntendedPickupTimeEnd}`,
          'Voting Window': `${formattedVoteDateTimeBeg} - ${formattedVoteDateTimeEnd}`,
          Location: location,
          'Dorm Packages Ordered': totalDormPackagesOrdered,
          'Cooking Packages Ordered': totalCookingPackagesOrdered,
          'Total Packages Ordered': totalDormPackagesOrdered + totalCookingPackagesOrdered,
          'Total Participants': totalParticipants,
          'Net Volume from Sales': netVolumeFromSalesAfterFees,
          Status: status,
        };
        summaryData.push(dropoff);
      }
      data = summaryData;
    }
    if (requestBody.dataType === 'ballot') {
      fields = ['Food Name', 'Vote Count'];
      data = await ballotUtil.getFoodNamesAndVoteCounts(requestBody.dropoffID);
    }
    if (requestBody.dataType === 'participant') {
      fields = ['Last Name', 'First Name', 'Date of Birth', 'Email', 'Phone Number', 'Dorm Packages Ordered', 'Cooking Packages Ordered', 'Allergies', 'Delivery Address'];
      // csv in ascending alphabetical order
      data = await transactionUtil.getUserInfoAndPackagesOrdered(requestBody.dropoffID);
    }
    const csv = json2csv({ data, fields });
    return csv;
  } catch(err) {
    console.log(err);
  }
};

module.exports.saveNewOrEditBulkBuy = async (requestBody) => {
  let bulkBuySaved = false;
  try {
    const groupID = await userUtil.findGroupIDByUID(requestBody.uid);
    const intendedShipDate = requestBody.newBulkBuyInfo.intendedShipDate;
    const intendedPickupTimeStart = requestBody.newBulkBuyInfo.intendedPickupTimeStart;
    const intendedPickupTimeEnd = requestBody.newBulkBuyInfo.intendedPickupTimeEnd;
    const voteDateTimeBeg = requestBody.newBulkBuyInfo.voteDateTimeBeg;
    const voteDateTimeEnd = requestBody.newBulkBuyInfo.voteDateTimeEnd;
    const locationID = await locationUtil.getLocationIdByFindOrCreate(requestBody.newBulkBuyInfo.locationObj);
    const selectedFoodItems = requestBody.newBulkBuyInfo.selectedFoodItems;
    const pricePerDormPackage = requestBody.newBulkBuyInfo.pricePerDormPackage;
    const pricePerCookingPackage = requestBody.newBulkBuyInfo.pricePerCookingPackage;
    const totalDormPackagesOrdered = requestBody.newBulkBuyInfo.totalDormPackagesOrdered;
    const totalCookingPackagesOrdered = requestBody.newBulkBuyInfo.totalCookingPackagesOrdered;
    const totalDollarAmount = requestBody.newBulkBuyInfo.totalDollarAmount;
    const pctFeePerPackage = requestBody.newBulkBuyInfo.pctFeePerPackage;
    const totalRevenueBeforeStripe = requestBody.newBulkBuyInfo.totalRevenueBeforeStripe;
    const totalRevenueAftereStripe = requestBody.newBulkBuyInfo.totalRevenueAftereStripe;
    const userWantsEditDropoff = requestBody.newBulkBuyInfo.userWantsEditDropoff;
    const editDropoffID = requestBody.newBulkBuyInfo.editDropoffID;
    if (userWantsEditDropoff) {
      const editBulkBuyData = {
        groupID,
        intendedShipDate,
        intendedPickupTimeStart,
        intendedPickupTimeEnd,
        voteDateTimeBeg,
        voteDateTimeEnd,
        locationID,
      };
      await models.Dropoff.update(editBulkBuyData, {
        where: {
          id: editDropoffID,
          groupID,
        },
      });
      const dropoff = await models.Dropoff.findOne({
        where: {
          id: editDropoffID,
          groupID,
        }
      })
      await foodUtil.editFoodItemsBallots(selectedFoodItems, dropoff.dataValues);
      editBulkBuyData.dropoffID = dropoff.id;
      await groupUtil.scheduleVotingDropoffSwitch(editBulkBuyData);
    } else {
      const newBulkBuyData = {
        groupID,
        intendedShipDate,
        intendedPickupTimeStart,
        intendedPickupTimeEnd,
        voteDateTimeBeg,
        voteDateTimeEnd,
        locationID,
        pricePerDormPackage,
        pricePerCookingPackage,
        totalDormPackagesOrdered,
        totalCookingPackagesOrdered,
        totalDollarAmount,
        pctFeePerPackage,
        totalRevenueBeforeStripe,
        totalRevenueAftereStripe,
      };
      const dropoff = await models.Dropoff.create(newBulkBuyData);
      await foodUtil.populateFoodItemsBallots(selectedFoodItems, null, dropoff.dataValues);
      newBulkBuyData.dropoffID = dropoff.id;
      groupUtil.scheduleVotingDropoffSwitch(newBulkBuyData);
    }
    bulkBuySaved = true;
  } catch(err) {
    console.log(err);
  }
  return bulkBuySaved;
};

module.exports.getAllDropoffs = async () => {
  let dropoffs;
  try {
    dropoffs = models.Dropoff.findAll();
  } catch (err) {
    console.log(err);
  }
  return dropoffs;
};

module.exports.getCurrentFutureDropoffs = async (groupID) => {
  let currentFutureDropoffs = [];
  try {
    const dropoffs = await models.Dropoff.findAll({
      where: {
        groupID,
      },
    });
    for (let i = 0; i < dropoffs.length; i++) {
      const dropoff = dropoffs[i].dataValues;
      const voteDateTimeEnd = dropoff.voteDateTimeEnd;
      const tzVoteDateTimeEnd = momentTZ.tz(voteDateTimeEnd, 'America/New_York');
      const currentTzDate = momentTZ.tz(new Date(), 'America/New_York');
      if (tzVoteDateTimeEnd.isAfter(currentTzDate)) {
        const currentFutureDropoff = {};
        const id = dropoff.id;
        const voteDateTimeBeg = dropoff.voteDateTimeBeg;
        const intendedPickupTimeStart = dropoff.intendedPickupTimeStart;
        const intendedPickupTimeEnd = dropoff.intendedPickupTimeEnd;
        const locationID = dropoff.locationID;
        const locationObj = await locationUtil.findLocationByID(locationID);
        currentFutureDropoff.id = id;
        currentFutureDropoff.intendedPickupTimeStart = intendedPickupTimeStart;
        currentFutureDropoff.intendedPickupTimeEnd = intendedPickupTimeEnd;
        currentFutureDropoff.voteDateTimeBeg = voteDateTimeBeg;
        currentFutureDropoff.voteDateTimeEnd = voteDateTimeEnd;
        currentFutureDropoff.locationObj = locationObj;
        currentFutureDropoffs.push(currentFutureDropoff);
      }
    }
  } catch (err) {
    console.log(err);
  }
  currentFutureDropoffs = currentFutureDropoffs.sortBy(dropoff => new Date(dropoff.intendedPickupTimeStart));
  return currentFutureDropoffs;
};

module.exports.stopJobOnEditDropoff = async (job, id) => {
  await models.Dropoff.beforeUpdate(async (dropoff) => {
    if (dropoff.id === id) {
      await job.stop();
    }
  });
};

module.exports.scheduleDropoffs = async () => {
  try {
    const dropoffs = await models.Dropoff.findAll();
    for (let i = 0; i < dropoffs.length; i++) {
      const dropoff = dropoffs[i].dataValues;
      const bulkBuyData = {
        voteDateTimeBeg: dropoff.voteDateTimeBeg,
        voteDateTimeEnd: dropoff.voteDateTimeEnd,
        dropoffID: dropoff.id,
        groupID: dropoff.groupID,
      }
      await groupUtil.scheduleVotingDropoffSwitch(bulkBuyData);
    }
  } catch (err) {
    console.log(err);
  }
};
