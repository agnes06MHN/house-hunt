import React, { useContext } from 'react';
import './Map.scss';
import GoogleMapReact from 'google-map-react';
import { Pin } from './components/Map/Pin';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MapContext,
} from './contexts/MapContext';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { PlaceDetail } from './components/PlaceDetail/PlaceDetail';
import { PlaceList } from './components/PlaceList/PlaceList';

export const Map: React.FC = () => {
  const mapContext = useContext(MapContext);

  const apiIsLoaded = (map: any) => {
    mapContext?.initMap(map);
  };

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCLQkWa3aZjC6TyXcFugxzCSDH9ghUlIi0' }}
        defaultCenter={DEFAULT_CENTER}
        center={mapContext?.center}
        defaultZoom={DEFAULT_ZOOM}
        options={{
          minZoom: 13,
          maxZoom: 16,
        }}
        zoom={mapContext?.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => apiIsLoaded(map)}
      >
        {mapContext?.points?.inputPoints.map((point) => {
          return <Pin lat={point.latitude} lng={point.longitude} />;
        })}
        {mapContext?.points && (
          <Pin
            lat={mapContext.points.centeredPoint.latitude}
            lng={mapContext.points.centeredPoint.longitude}
            requestmarker
          />
        )}
        {mapContext?.places.map((place) => {
          return (
            <Pin
              key={place.id}
              lat={place.coordinates.latitude}
              lng={place.coordinates.longitude}
              place={place}
            />
          );
        })}
        {mapContext?.clusters.map((cluster) => {
          return (
            <Pin
              key={cluster.id}
              lat={cluster.latitude}
              lng={cluster.longitude}
              cluster={cluster}
            />
          );
        })}
      </GoogleMapReact>
      {mapContext?.loading && <LoadingSpinner />}
      {mapContext?.places.length && <PlaceList />}
      {mapContext?.detailedPlace && (
        <PlaceDetail place={mapContext.detailedPlace} />
      )}
    </div>
  );
};
