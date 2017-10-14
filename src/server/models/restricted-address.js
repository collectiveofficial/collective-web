const models = require('../../database/models/index');
const googleMapsUtils = require('./utils/google-maps-utils');

module.exports.checkIfRestrictedAddressExist = async (id) => {
  try {
    const restrictedAddress = await models.RestrictedAddress.findOne({
      where: {
        id,
      },
    });
    if (restrictedAddress !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.initializeRestrictedAddresses = async (restrictedAddresses, groupID, dropoffID) => {
  try {
    for (let restrictedAddressName in restrictedAddresses) {
      const unformattedAddressWithoutAptSuite = `${restrictedAddresses[restrictedAddressName].streetAddress},
      ${restrictedAddresses[restrictedAddressName].city}, ${restrictedAddresses[restrictedAddressName].state} ${restrictedAddresses[restrictedAddressName].zipCode}`;
      // find latitude and longitude of full address
      const googleMapsObj = await googleMapsUtils.findFormattedAddressLatLong(unformattedAddressWithoutAptSuite);
      if (googleMapsObj.isValidAddress) {
        await models.RestrictedAddress.create({
          name: restrictedAddressName,
          restrictionType: restrictedAddresses[restrictedAddressName].restrictionType,
          streetAddress: restrictedAddresses[restrictedAddressName].streetAddress,
          aptSuite: restrictedAddresses[restrictedAddressName].aptSuite,
          city: restrictedAddresses[restrictedAddressName].city,
          zipCode: restrictedAddresses[restrictedAddressName].zipCode,
          fullAddress: googleMapsObj.formattedAddress,
          latitude: googleMapsObj.latitude.toString(),
          longitude: googleMapsObj.longitude.toString(),
          groupID,
          dropoffID,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRestrictedAddressLatLong = async (groupID) => {
  const latLongs = {};
  const restrictedAddresses = await models.RestrictedAddress.findAll({
    where: {
      groupID,
    },
  });
  for (let i = 0; i < restrictedAddresses.length; i++) {
    const latLongString = restrictedAddresses[i].dataValues.latitude.toString() + restrictedAddresses[i].dataValues.longitude.toString();
    latLongs[latLongString] = restrictedAddresses[i].dataValues.restrictionType;
  }
  return latLongs;
};

module.exports.checkIfAddressIsDorm = async (userLatLongString, groupID) => {
  try {
    const latLongs = {};
    const restrictedAddresses = await models.RestrictedAddress.findAll({
      where: {
        groupID,
      },
    });
    for (let i = 0; i < restrictedAddresses.length; i++) {
      const latLongString = restrictedAddresses[i].dataValues.latitude.toString() + restrictedAddresses[i].dataValues.longitude.toString();
      latLongs[latLongString] = restrictedAddresses[i].dataValues.restrictionType;
    }
    if (latLongs[userLatLongString] === 'university dorm') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateDropoffID = async (dropoffID, groupID) => {
  try {
    await models.RestrictedAddress.update({
      dropoffID,
    }, {
      where: {
        groupID,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
