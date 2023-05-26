import React, { useContext } from 'react';
import './PlaceDetail.scss';
import { MapContext } from '../../contexts/MapContext';
import { Button } from '@mui/material';

type Props = {
  place: any;
};

export const PlaceDetail: React.FC<Props> = ({ place }) => {
  const mapContext = useContext(MapContext);

  const {
    city,
    photos,
    description,
    price,
    livingArea,
    rooms,
    title,
    transportations,
    permalink,
  } = place;

  return (
    <div className="place-detail">
      <div
        className="place-detail__close"
        onClick={() => mapContext?.closeDetail()}
      >
        &#x2717;
      </div>
      <div className="place-detail__city">
        {title} - {city}
      </div>
      <img src={photos[0]} alt="" />
      <p>
        <strong>Description</strong>
        <br />
        {description}
      </p>
      <div className="place-detail__infos">
        <div>{price} &euro;</div>
        <div>
          {livingArea} m<sup>2</sup>
        </div>
        <div>T{rooms}</div>
      </div>
      {transportations.available.length > 0 && <p>Transports disponibles</p>}
      <Button href={permalink} target="_blank" variant="contained">
        Voir sur SeLoger
      </Button>
      <Button
        onClick={() =>
          mapContext?.addFav({ title: title + ' - ' + city, link: permalink })
        }
        variant="outlined"
      >
        Ajouter aux favoris
      </Button>
    </div>
  );
};
