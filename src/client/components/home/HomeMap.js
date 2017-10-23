import React from 'react';
import {
  compose,
  withProps,
} from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

const HomeMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDcBcl_kMHNQwWHrQXAHZIb5Ig5I3mUkm0&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{
      lat: props.homeReducers.currentFutureDropoffs[0].locationObj.latitude,
      lng: props.homeReducers.currentFutureDropoffs[0].locationObj.longitude,
    }}
  >
    <Marker
      position={{
        lat: props.homeReducers.currentFutureDropoffs[0].locationObj.latitude,
        lng: props.homeReducers.currentFutureDropoffs[0].locationObj.longitude,
      }}
      onClick={() => { props.toggleHomeMap(); }}
    >
      {props.homeReducers.showHomeMap && <InfoWindow onCloseClick={() => { props.toggleHomeMap(false); }}>
        <div>{props.homeReducers.currentFutureDropoffs[0].locationObj.fullAddress}</div>
      </InfoWindow>}
    </Marker>
  </GoogleMap>
);

export default HomeMap;
