import React, { useContext, useLayoutEffect, useState } from 'react';
import { Coords } from 'google-map-react';
import { SimpleMarker } from './SimpleMarker';
import './Pin.scss';
import { MapContext } from '../../contexts/MapContext';

interface IProps extends Coords {
  requestmarker?: boolean;
  place?: any;
  cluster?: any;
}

export const Pin: React.FC<IProps> = ({ requestmarker, place, cluster }) => {
  const mapContext = useContext(MapContext);

  const [animate, setAnimate] = useState<boolean>(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, Math.random() * 1000);
  }, []);

  const detailPlace = () => {
    if (!!place) {
      mapContext?.detailAPlace(place.id);
    }
  };

  return (
    <div className={`pin ${animate ? 'pin--show' : ''}`} onClick={detailPlace}>
      <SimpleMarker
        isplace={!!place}
        iscluster={!!cluster}
        requestmarker={requestmarker}
      />

      {!!place && (
        <div className="pin__content">
          <img src={place.photoUrl} alt="" />
          <p>{place.price}</p>
        </div>
      )}

      {!!cluster && (
        <div className="pin__content">
          <div className="pin__content__container">
            <h3>{cluster.name}</h3>
            <p>
              plus de {cluster.listingCount} addresses disponible{' '}
              <strong>SeLoger</strong> dans ces alentours!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
