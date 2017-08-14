const models = require('../../database/models/index');

module.exports.doesFirstDropoffExist = () => {
  return models.Dropoff.findOne({
    where: {
      id: 1,
    }
  })
  .then((doesFirstDropoffExistResult) => {
    if (doesFirstDropoffExistResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.populateDropoff = (user) => {
  models.Dropoff.create({
    intendedShipDate: user.intendedShipDate,
    intendedPickupTimeStart: user.intendedPickupTimeStart,
    intendedPickupTimeEnd: user.intendedPickupTimeEnd,
    shipDate: user.shipDate,
    voteDateTimeBeg: user.voteDateTimeBeg,
    voteDateTimeEnd: user.voteDateTimeEnd,
    pricePerDormPackage: user.pricePerDormPackage,
    pricePerCookingPackage: user.pricePerCookingPackage,
    totalDormPackagesOrdered: user.totalDormPackagesOrdered,
    totalCookingPackagesOrdered: user.totalCookingPackagesOrdered,
    totalDollarAmount: user.totalDollarAmount,
    pctFeePerPackage: user.pctFeePerPackage,
    totalRevenueBeforeStripe: user.totalRevenueBeforeStripe,
    totalRevenueAftereStripe: user.totalRevenueAftereStripe,
  })
  .catch(err => console.log(err));
};
