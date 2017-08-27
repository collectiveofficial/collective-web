const models = require('../../database/models/index');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise, // 'Promise' is the native constructor.
});

module.exports.initializeRestrictedAddresses = async (restrictedAddresses, groupID, dropoffID) => {
  try {
    for (let restrictedAddressName in restrictedAddresses) {
      const unformattedRestrictedFullAddress = restrictedAddresses[restrictedAddressName].aptSuite.length > 0 ?
      `${restrictedAddresses[restrictedAddressName].streetAddress}, ${restrictedAddresses[restrictedAddressName].aptSuite}, ${restrictedAddresses[restrictedAddressName].city},
      ${restrictedAddresses[restrictedAddressName].state} ${restrictedAddresses[restrictedAddressName].zipCode}` : `${restrictedAddresses[restrictedAddressName].streetAddress},
      ${restrictedAddresses[restrictedAddressName].city}, ${restrictedAddresses[restrictedAddressName].state} ${restrictedAddresses[restrictedAddressName].zipCode}`;
      // find latitude and longitude of full address
      const googleMapsGeocodeResponse = await googleMapsClient.geocode({
        address: unformattedRestrictedFullAddress,
      })
      .asPromise();
      const googleMapsGeocodeResponseResult = googleMapsGeocodeResponse.json.results[0];
      const googleMapsFormattedAddress = googleMapsGeocodeResponseResult.formatted_address;
      const latitude = googleMapsGeocodeResponseResult.geometry.location.lat;
      const longitude = googleMapsGeocodeResponseResult.geometry.location.lng;
      await models.RestrictedAddress.create({
        name: restrictedAddressName,
        restrictionType: restrictedAddresses[restrictedAddressName].restrictionType,
        streetAddress: restrictedAddresses[restrictedAddressName].streetAddress,
        aptSuite: restrictedAddresses[restrictedAddressName].aptSuite,
        city: restrictedAddresses[restrictedAddressName].city,
        zipCode: restrictedAddresses[restrictedAddressName].zipCode,
        fullAddress: googleMapsFormattedAddress,
        latitude,
        longitude,
        groupID,
        dropoffID,
      });
    }
  } catch(err) {
    console.log(err);
  }
};
