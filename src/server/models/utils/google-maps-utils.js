const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise, // 'Promise' is the native constructor.
});

module.exports.findFormattedAddressLatLong = async (unformattedFullAddressWithoutAptSuite) => {
  const googleMapsObj = {
    isValidAddress: false,
  };
  const googleMapsGeocodeResponse = await googleMapsClient.geocode({
    address: unformattedFullAddressWithoutAptSuite,
  })
  .asPromise();
  const googleMapsGeocodeResponseResults = googleMapsGeocodeResponse.json.results;
  if (googleMapsGeocodeResponseResults.length !== 0) {
    const googleMapsGeocodeResponseResult = googleMapsGeocodeResponse.json.results[0];
    const formattedAddress = googleMapsGeocodeResponseResult.formatted_address;
    const latitude = googleMapsGeocodeResponseResult.geometry.location.lat;
    const longitude = googleMapsGeocodeResponseResult.geometry.location.lng;
    googleMapsObj.isValidAddress = true;
    googleMapsObj.formattedAddress = formattedAddress;
    googleMapsObj.latitude = latitude;
    googleMapsObj.longitude = longitude;
  }
  return googleMapsObj;
};
