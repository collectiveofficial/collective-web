const momentTZ = require('moment-timezone');
const models = require('../../database/models/index');
const userUtil = require('./user');
const transactionUtil = require('./transaction');

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
  // const customers = await transactionUtil.getCustomersForDropoff(id); //TODO: create route to grab customer data for dropoff
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
        id,
        intendedShipDate,
        formattedIntendedPickupDateTimeStart,
        formattedIntendedPickupTimeEnd,
        formattedVoteDateTimeBeg,
        formattedVoteDateTimeEnd,
        totalDormPackagesOrdered,
        totalCookingPackagesOrdered,
        totalParticipants,
        netVolumeFromSalesAfterFees,
        status,
      };
      data.push(dropoff);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
