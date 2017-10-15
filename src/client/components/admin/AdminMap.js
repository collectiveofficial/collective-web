import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { compose, withProps, withStateHandlers, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import RaisedButton from 'material-ui/RaisedButton';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Clear from 'material-ui/svg-icons/content/clear';
import { Icon } from 'semantic-ui-react';
// import truckIcon from './truck-icon.svg';

let { componentWillMount, componentDidMount, componentWillUnmount, componentDidUpdate }=SearchBox.prototype;
SearchBox.prototype.componentWillMount=function(){
  this._containerElement = document.createElement(`div`);
}
SearchBox.prototype.componentDidMount=function(){
  componentWillMount.call(this);
  setTimeout(()=>{
    /*make sure the state[SEARCH_BOX] exists */
    componentDidMount.call(this);
    this._componentDidMount=true;
  });
}
/*fix eventMap */
SearchBox.prototype.componentDidUpdate=function(prevProps){
  if(this._componentDidMount){
    componentDidUpdate.call(this, prevProps);
  }
}
SearchBox.prototype.handleRenderChildToContainerElement=function(){
  this.containerElement=this._containerElement;
}
SearchBox.prototype.render=function(){
  return ReactDOM.createPortal(
    this.props.children,
    this._containerElement
  );
}
SearchBox.prototype.componentWillUnmount=function(){
  if(this.containerElement){
    componentWillUnmount.call(this);
  }
}

const styles = {
  button: {
    margin: 12,
  },
  marker: {
    backgroundColor: 'rgb(30, 227, 91)',
  },
};

const truck = {
  path: 'M487.932,51.1c-3.613-3.612-7.905-5.424-12.847-5.424h-292.36c-4.948,0-9.233,1.812-12.847,5.424c-3.615,3.617-5.424,7.902-5.424,12.85v54.818h-45.683c-5.14,0-10.71,1.237-16.705,3.711c-5.996,2.478-10.801,5.518-14.416,9.135l-56.532,56.531c-2.473,2.474-4.612,5.327-6.424,8.565c-1.807,3.23-3.14,6.14-3.997,8.705c-0.855,2.572-1.477,6.089-1.854,10.566c-0.378,4.475-0.62,7.758-0.715,9.853c-0.091,2.092-0.091,5.71,0,10.85c0.096,5.142,0.144,8.47,0.144,9.995v91.36c-4.947,0-9.229,1.807-12.847,5.428C1.809,347.076,0,351.363,0,356.312c0,2.851,0.378,5.376,1.14,7.562c0.763,2.19,2.046,3.949,3.858,5.284c1.807,1.335,3.378,2.426,4.709,3.285c1.335,0.855,3.571,1.424,6.711,1.711s5.28,0.479,6.423,0.575c1.143,0.089,3.568,0.089,7.279,0c3.715-0.096,5.855-0.144,6.427-0.144h18.271c0,20.17,7.139,37.397,21.411,51.674c14.277,14.274,31.501,21.413,51.678,21.413c20.175,0,37.401-7.139,51.675-21.413c14.277-14.276,21.411-31.504,21.411-51.674H310.63c0,20.17,7.139,37.397,21.412,51.674c14.271,14.274,31.498,21.413,51.675,21.413c20.181,0,37.397-7.139,51.675-21.413c14.277-14.276,21.412-31.504,21.412-51.674c0.568,0,2.711,0.048,6.42,0.144c3.713,0.089,6.14,0.089,7.282,0c1.144-0.096,3.289-0.288,6.427-0.575c3.139-0.287,5.373-0.855,6.708-1.711s2.901-1.95,4.709-3.285c1.81-1.335,3.097-3.094,3.856-5.284c0.77-2.187,1.143-4.712,1.143-7.562V63.953C493.353,59.004,491.546,54.724,487.932,51.1z M153.597,400.28c-7.229,7.23-15.797,10.854-25.694,10.854c-9.898,0-18.464-3.62-25.697-10.854c-7.233-7.228-10.848-15.797-10.848-25.693c0-9.897,3.619-18.47,10.848-25.701c7.232-7.228,15.798-10.848,25.697-10.848c9.897,0,18.464,3.617,25.694,10.848c7.236,7.231,10.853,15.804,10.853,25.701C164.45,384.483,160.833,393.052,153.597,400.28z M164.45,228.403H54.814v-8.562c0-2.475,0.855-4.569,2.568-6.283l55.674-55.672c1.712-1.714,3.809-2.568,6.283-2.568h45.111V228.403z M409.41,400.28c-7.23,7.23-15.797,10.854-25.693,10.854c-9.9,0-18.47-3.62-25.7-10.854c-7.231-7.228-10.849-15.797-10.849-25.693c0-9.897,3.617-18.47,10.849-25.701c7.23-7.228,15.8-10.848,25.7-10.848c9.896,0,18.463,3.617,25.693,10.848c7.231,7.235,10.852,15.804,10.852,25.701C420.262,384.483,416.648,393.052,409.41,400.28z',
  scale: 0.15,
  fillColor: 'rgb(0, 0, 0)',
  fillOpacity: 0.8,
  // strokeColor: 'gold',
  // strokeWeight: 4,
};

const AdminMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDcBcl_kMHNQwWHrQXAHZIb5Ig5I3mUkm0&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: {
          lat: 40.015157,
          lng: -83.027429,
        },
        // markers: [],
        places: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });

          const center = _.get(places, '0.geometry.location', this.state.center);

          this.setState({
            center,
            places,
          });

          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={14}
    defaultCenter={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: 'border-box',
          border: '1px solid transparent',
          width: '240px',
          height: '32px',
          marginTop: '27px',
          padding: '0 12px',
          borderRadius: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
          outline: 'none',
          textOverflow: 'ellipses',
        }}
      />
    </SearchBox>
    {props.places.map((place, index) =>
      <Marker
        key={index}
        position={place.geometry.location}
        icon={place.formatted_address === props.adminReducers.formattedAddress ? { ...truck, fillColor: 'rgb(14, 142, 58)' } : truck}
        style={styles.marker}
        onClick={() => {
          props.setMarkerAddress(place.formatted_address);
        }}
      >
        {place.formatted_address === props.adminReducers.markerAddress && <InfoWindow onCloseClick={() => { props.setMarkerAddress('') }}>
          <div>
            <div>{place.formatted_address}</div>
            <RaisedButton
              label={place.formatted_address === props.adminReducers.formattedAddress ? 'Deselect Location' : 'Select Location'}
              labelPosition="before"
              primary={true}
              icon={
                place.formatted_address === props.adminReducers.formattedAddress ?
                <Clear
                  color={'rgb(232, 16, 16)'}
                />
                :
                <CheckCircle
                  color={'rgb(30, 227, 91)'}
                />
              }
              style={styles.button}
              onTouchTap={() => {
                if (place.formatted_address === props.adminReducers.formattedAddress) {
                  props.setFormattedAddress('');
                  props.setLocationStreetNumber('');
                  props.setLocationStreetName('');
                  props.setLocationCity('');
                  props.setLocationState('');
                  props.setLocationZipCode('');
                } else {
                  props.setFormattedAddress(place.formatted_address);
                  for (let i = 0; i < place.address_components.length; i++) {
                    const address = place.address_components[i];
                    if (address.types[0] === 'street_number') {
                      props.setLocationStreetNumber(address.short_name);
                    } else if (address.types[0] === 'route') {
                      props.setLocationStreetName(address.short_name);
                    } else if (address.types[0] === 'locality') {
                      props.setLocationCity(address.short_name);
                    } else if (address.types[0] === 'administrative_area_level_1') {
                      props.setLocationState(address.short_name);
                    } else if (address.types[0] === 'postal_code') {
                      props.setLocationZipCode(address.short_name);
                    }
                  }
                }
              }}
            />
            {/* <RaisedButton
              label="Deselect location"
              labelPosition="before"
              primary={true}
              icon={<Clear
                color={'rgb(232, 16, 16)'}
              />}
              style={styles.button}
            /> */}
          </div>
        </InfoWindow>}
      </Marker>
    )}
    {_.uniqBy(props.adminReducers.adminData, 'locationObj.fullAddress').map(data => (
      <Marker
        position={{ lat: data.locationObj.latitude, lng: data.locationObj.longitude }}
        // onClick={props.onToggleOpen}
        icon={data.locationObj.fullAddress === props.adminReducers.formattedAddress ? { ...truck, fillColor: 'rgb(14, 142, 58)' } : truck}
        style={styles.marker}
        onClick={() => {
          props.setMarkerAddress(data.locationObj.fullAddress);
        }}
      >
        {data.locationObj.fullAddress === props.adminReducers.markerAddress && <InfoWindow onCloseClick={() => { props.setMarkerAddress('') }}>
          <div>
            <div>{data.locationObj.fullAddress}</div>
            <RaisedButton
              label={data.locationObj.fullAddress === props.adminReducers.formattedAddress ? 'Deselect Location' : 'Select Location'}
              labelPosition="before"
              primary={true}
              icon={
                data.locationObj.fullAddress === props.adminReducers.formattedAddress ?
                <Clear
                  color={'rgb(232, 16, 16)'}
                />
                :
                <CheckCircle
                  color={'rgb(30, 227, 91)'}
                />
              }
              style={styles.button}
              onTouchTap={() => {
                if (data.locationObj.fullAddress === props.adminReducers.formattedAddress) {
                  props.setFormattedAddress('');
                  props.setLocationStreetNumber('');
                  props.setLocationStreetName('');
                  props.setLocationCity('');
                  props.setLocationState('');
                  props.setLocationZipCode('');
                } else {
                  props.setFormattedAddress(data.locationObj.fullAddress);
                  props.setLocationStreetNumber(data.locationObj.streetNumber);
                  props.setLocationStreetName(data.locationObj.streetName);
                  props.setLocationCity(data.locationObj.city);
                  props.setLocationState(data.locationObj.state);
                  props.setLocationZipCode(data.locationObj.zipCode);
                }
              }}
            />
            {/* <RaisedButton
              label="Deselect location"
              labelPosition="before"
              primary={true}
              icon={<Clear
                color={'rgb(232, 16, 16)'}
              />}
              style={styles.button}
            /> */}
          </div>
        </InfoWindow>}
      </Marker>
      ))}
  </GoogleMap>
));

export default AdminMap;
