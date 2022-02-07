import {
  IonApp, IonButton,
  IonModal,
  setupIonicReact,
  IonText
} from '@ionic/react';
import {GoogleMap, useJsApiLoader , DirectionsService ,
  DirectionsRenderer, Marker, Polyline} from '@react-google-maps/api';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import React from 'react'
import Clock from 'react-live-clock';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


setupIonicReact();


const GoogleMapsAPI = 'AIzaSyDwPUWDW8ZW0KGj57zUGOAQcd1Wn5Janic';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 37.772,
  lng: -122.214
};


//Hardcoded destination
const destinationTo = {
  lat: 21.291,
  lng: -157.821
}


//straighline joining two Points
const linePath = 
  [
    {
      lat: 37.772,
      lng: -122.214
    },
    {
      lat: 21.291,
      lng: -157.821
    }
];



const lineOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};


const App: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GoogleMapsAPI
  })
  // const [travelMode, settravelMode] = React.useState();
  const [apiResponse, setapiResponse] = React.useState(null);
  const directionsCallback = (response:any) => {
    console.log(response)
  
    if (response !== null) {
      if (response.status === 'OK') {
        setapiResponse(response);
        console.log('response: sucess ', response)
  
      } else {
        console.log('response: failed ', response)
      }
    }
  }
  
  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const [mapModal, setMapModal] = React.useState({isOpen:false});
  const [timeEnded, setTimeEnded] = React.useState<string>();
  const [timeStarted, setTimeStarted] = React.useState<string>();

  var [originFrom, setOriginFrom] = React.useState<google.maps.LatLng | google.maps.LatLngLiteral>(destinationTo);

  const changeLoad  = () => {
    let dateTime = new Date().toString()
    console.log(dateTime); 
    setTimeEnded(dateTime);
  };
  const getLocation = async () => {
    try {
        const position = await Geolocation.getCurrentPosition();
        let lats = position.coords.latitude;
        let lons = position.coords.longitude;
        let temp = {
          lat: lats,
          lng: lons
        }
        console.log(temp);
        setOriginFrom(temp);

    } catch (e) {
      console.log('OH NO');
    }
  }

  return isLoaded ? (
  <IonApp>
    <IonModal isOpen={mapModal.isOpen}>Navigation
      <IonButton  onClick={() => {setMapModal({isOpen:false}); setTimeEnded(new Date().toString());}}>Close</IonButton>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >{ 
        (originFrom !== null) &&
         (
        <DirectionsService
          // required
          //eslint-disable react-perf/jsx-no-new-object-as-prop
          options={{ 
            destination: destinationTo,
            origin: originFrom,
            travelMode: google.maps.TravelMode.DRIVING
          }}
          // required
          callback={directionsCallback}
        />
      ) }
      {
              apiResponse !== null 
              && (
                <DirectionsRenderer
                //eslint-disable react-perf/jsx-no-new-object-as-prop
                    options={{directions: apiResponse}}
                />
              )
            }
        <></>      
        <Marker
        position={originFrom}
        />
        <Marker
        position={destinationTo}
        />

      </GoogleMap>
    </IonModal>
    <IonButton expand="full" onClick={() => {setMapModal({isOpen:true}); getLocation(); setTimeStarted(new Date().toString());}}>
      Start Navigation-- Time:
      <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} />
      </IonButton>
    <IonText>
      <p>
        Time Started: {timeStarted}
        <br />
        Time Ended: {timeEnded}
      </p>
    </IonText>
  </IonApp>
  ): <></>
  }

// export default React.memo(MyComponent)
export default App;