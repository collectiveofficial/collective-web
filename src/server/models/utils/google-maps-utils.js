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


module.exports.findDistance = async (origin, destination) => {
  const units = 'imperial';
  const googleMapsDistanceMatrix = await googleMapsClient.distanceMatrix({
    origins: [origin],
    destinations: [destination],
    units,
  })
  .asPromise();
  const googleMapsDistanceMatrixResult = googleMapsDistanceMatrix.json;
  const regex = /(?:^|\s)(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?!\S)/;
  const distanceFromUserAddressText = googleMapsDistanceMatrixResult.rows[0].elements[0].distance.text;
  let distanceFromUserAddressInMiles = regex.exec(distanceFromUserAddressText)[1];
  distanceFromUserAddressInMiles = distanceFromUserAddressInMiles.replace(',', '');
  return distanceFromUserAddressInMiles;
};
