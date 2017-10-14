const models = require('../../database/models/index');
const googleMapsUtils = require('./utils/google-maps-utils');

module.exports.findDoesLocationExist = async () => {
  let doesLocationExist = false;
  try {
    const location = await models.Location.findOne({
      where: {
        id: 1,
      },
    });
    if (location !== null) {
      doesLocationExist = true;
    }
  } catch (err) {
    console.log(err);
  }
  return doesLocationExist;
};

module.exports.initializeLocations = async (locations) => {
  try {
    for (let i = 0; i < locations.length; i++) {
      const groupID = locations[i].groupID;
      const streetAddress = locations[i].streetAddress;
      const aptSuite = locations[i].aptSuite;
      const city = locations[i].city;
      const state = locations[i].state;
      const zipCode = locations[i].zipCode;
      const unformattedAddressWithoutAptSuite = `${streetAddress}, ${city}, ${state} ${zipCode}`;
      const googleMapsObj = await googleMapsUtils.findFormattedAddressLatLong(unformattedAddressWithoutAptSuite);
      const isValidAddress = googleMapsObj.isValidAddress;
      if (isValidAddress) {
        const fullAddress = googleMapsObj.formattedAddress;
        const latitude = googleMapsObj.latitude;
        const longitude = googleMapsObj.longitude;
        await models.Location.create({
          groupID,
          streetAddress,
          aptSuite,
          city,
          state,
          zipCode,
          fullAddress,
          latitude,
          longitude,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.findLocationByID = async (id) => {
  const locationObj = {};
  try {
    const location = await models.Location.findOne({
      where: {
        id,
      },
    });
    // console.log('---> location with id ', id, ': ', location);
    const streetAddress = location.dataValues.streetAddress;
    for (let i = 0; i < streetAddress.length; i++) {
      if (streetAddress[i] === ' ') {
        locationObj.streetNumber = streetAddress.slice(0, i);
        locationObj.streetName = streetAddress.slice(i + 1, streetAddress.length);
        break;
      }
    }
    locationObj.city = location.dataValues.city;
    locationObj.state = location.dataValues.state;
    locationObj.zipCode = location.dataValues.zipCode;
    locationObj.fullAddress = location.dataValues.fullAddress;
    locationObj.latitude = Number(location.dataValues.latitude);
    locationObj.longitude = Number(location.dataValues.longitude);
  } catch (err) {
    console.log(err);
  }
  return locationObj;
};

module.exports.getLocationIdByFindOrCreate = async (locationObj) => {
  let locationID;
  try {
    const formattedAddress = locationObj.formattedAddress;
    const location = await models.Location.findOne({
      where: {
        fullAddress: formattedAddress,
      },
    });
    if (location !== null) {
      locationID = location.dataValues.id;
    } else {
      const streetNumber = locationObj.streetNumber;
      const streetName = locationObj.streetName;
      const streetAddress = `${streetNumber} ${streetName}`;
      const city = locationObj.city;
      const state = locationObj.state;
      const zipCode = locationObj.zipCode;
      const unformattedAddressWithoutAptSuite = `${streetAddress}, ${city}, ${state} ${zipCode}`;
      const googleMapsObj = await googleMapsUtils.findFormattedAddressLatLong(unformattedAddressWithoutAptSuite);
      const newLocation = await models.Location.create({
        streetAddress,
        city,
        state,
        zipCode,
        fullAddress: googleMapsObj.formattedAddress,
        latitude: googleMapsObj.latitude,
        longitude: googleMapsObj.longitude,
      });
      locationID = newLocation.dataValues.id;
    }
  } catch (err) {
    console.log(err);
  }
  return locationID;
};
