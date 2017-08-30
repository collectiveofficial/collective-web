const models = require('../../database/models/index');

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
