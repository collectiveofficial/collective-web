const models = require('../../database/models/index');

module.exports.doesDropoffExist = (id) => {
  return models.Dropoff.findOne({
    where: {
      id,
    }
  })
  .then((doesDropoffExistResult) => {
    if (doesDropoffExistResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.populateDropoff = async (dropoff) => {
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
  })
  .catch(err => console.log(err));
};

module.exports.updateFirstDropoffVoteTimeEnd = async (id, voteDateTimeEnd) => {
  await models.Dropoff.update({
    voteDateTimeEnd,
  }, {
    where: {
      id,
    },
  });
};

module.exports.findPctFeePerPackageForDrop = async (dropoffID) => {
  const findDropoffByIDResult = await models.Dropoff.findOne({
    where: {
      id: dropoffID,
    },
  });
  const pctFeePerPackage = findDropoffByIDResult.dataValues.pctFeePerPackage;
  return pctFeePerPackage;
};

module.exports.findIntendedPickupTimeEnd = async (id, groupID) => {
  const findIntendedPickupTimeEndResult = await models.Dropoff.findOne({
    where: {
      id,
      groupID,
    },
  });
  const intendedPickupTimeEnd = findIntendedPickupTimeEndResult.dataValues.intendedPickupTimeEnd;
  return intendedPickupTimeEnd;
};
