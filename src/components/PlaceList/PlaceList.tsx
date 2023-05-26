import { Typography } from '@mui/material';
import './PlaceList.scss';
import { useContext } from 'react';
import { MapContext } from '../../contexts/MapContext';

export const PlaceList = () => {
  const mapContext = useContext(MapContext);

  return (
    <div className="place-list">
      <Typography variant="h4">Liste des logements</Typography>
      {mapContext?.places.map((place) => (
        <div
          className="place-list__item"
          onClick={() => mapContext.detailAPlace(place.id)}
        >
          <img src={place.photoUrl} alt="" />
          <Typography variant="h4">{place.price}</Typography>
        </div>
      ))}
    </div>
  );
};
