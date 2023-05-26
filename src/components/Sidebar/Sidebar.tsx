import { Box, Button, Slider, TextField, Typography } from '@mui/material';
import './Sidebar.scss';
import { useCallback, useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';

export const Sidebar = () => {
  const mapContext = useContext(MapContext);

  const [firstAddress, setFirstAddress] = useState<string>('');
  const [secondAddress, setSecondAddress] = useState<string>('');
  const [thirdAddress, setThirdAddress] = useState<string>('');

  const [livingArea, setLivingArea] = useState<number[]>([10, 150]);
  const [maxPrice, setMaxPrice] = useState<number>(800);
  const [rooms, setRooms] = useState<number>(3);

  const [activitiesRadius, setActivitiesRadius] = useState<number>(1);
  const [activitiesCount, setActivitiesCount] = useState<number>(0);

  const handleSearch = useCallback(async () => {
    mapContext?.toggleLoading();
    const addresses = [firstAddress];
    if (secondAddress.length > 0) addresses.push(secondAddress);
    if (thirdAddress.length > 0) addresses.push(thirdAddress);

    const syncPoints = await mapContext?.fetchPlaces(addresses);

    setTimeout(async () => {
      mapContext?.clearPlaces();
      mapContext?.clearClusters();

      const bounds = mapContext?.map.getBounds();
      const northWestLatLong = getNorthWest(
        bounds.getNorthEast(),
        bounds.getSouthWest()
      );
      const southEastLatLong = getSouthEast(
        bounds.getNorthEast(),
        bounds.getSouthWest()
      );

      let url = `https://seloger.p.rapidapi.com/properties/list-in-boundary?zipCodes=${syncPoints?.centeredPoint.zipCode?.slice(
        0,
        2
      )}&northWestLatitude=${northWestLatLong.lat}&northWestLongitude=${
        northWestLatLong.lng
      }&southEastLatitude=${southEastLatLong.lat}&southEastLongitude=${
        southEastLatLong.lng
      }&minimumLivingArea=${livingArea[0]}&maximumLivingArea=${
        livingArea[1]
      }&maximumPrice=${maxPrice}&minimumNumberOfRooms=${rooms}`;

      const seLogerResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '23c05b0539msh9a2233de9c0717dp1863dajsnff65aa1ebe9b',
          'X-RapidAPI-Host': 'seloger.p.rapidapi.com',
        },
      });
      const seLogerData = await seLogerResponse.json();

      await seLogerData.listings.forEach(async (listing: any) => {
        if (activitiesCount === 0) {
          console.count('test');
          mapContext?.addPlace(listing);
          return;
        }

        const searchBounds = calculateBoundingBox(
          listing.coordinates.latitude,
          listing.coordinates.longitude,
          activitiesRadius * 1000
        );

        const amenityResponse = await fetch(
          'https://www.overpass-api.de/api/interpreter',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: `[out:json][timeout:25];(node["amenity"="exhibition_centre"](${searchBounds.join(
              ','
            )}););out body;>;out skel qt;`,
          }
        );
        const amenityData = await amenityResponse.json();
        console.log(amenityData);
        if (amenityData.elements.length > activitiesCount) {
          mapContext?.addPlace(listing);
        }
      });

      mapContext?.toggleLoading();
      mapContext?.addClusters(seLogerData.clusters);
    }, 1000);
  }, [
    firstAddress,
    secondAddress,
    thirdAddress,
    mapContext,
    livingArea,
    maxPrice,
    rooms,
    activitiesCount,
    activitiesRadius,
  ]);

  return (
    <div className="sidebar">
      <div className="sidebar__addresses">
        <Typography variant="h4">House hunt</Typography>

        <TextField
          className="sidebar__addresses__field"
          label="Rechercher une adresse"
          variant="filled"
          value={firstAddress}
          onChange={(e) => setFirstAddress(e.target.value)}
        />

        {firstAddress.length > 0 && (
          <TextField
            className="sidebar__addresses__field"
            label="Rechercher une deuxième adresse"
            variant="filled"
            value={secondAddress}
            onChange={(e) => setSecondAddress(e.target.value)}
          />
        )}

        {secondAddress.length > 0 && (
          <TextField
            className="sidebar__addresses__field"
            label="Rechercher une troisième adresse"
            variant="filled"
            value={thirdAddress}
            onChange={(e) => setThirdAddress(e.target.value)}
          />
        )}

        <Box>
          <Typography>Surface</Typography>
          <Slider
            value={livingArea}
            onChange={(_, newValue) => setLivingArea(newValue as number[])}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography>Prix max</Typography>
          <Slider
            value={maxPrice}
            max={2000}
            onChange={(_, newValue) => setMaxPrice(newValue as number)}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography>Nombre de pièces</Typography>
          <Slider
            value={rooms}
            min={1}
            max={10}
            onChange={(_, newValue) => setRooms(newValue as number)}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography>Rayon de présence d'activité en KM</Typography>
          <Slider
            value={activitiesRadius}
            min={1}
            max={5}
            onChange={(_, newValue) => setActivitiesRadius(newValue as number)}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography>Nombre d'activités minimum dans le rayon</Typography>
          <Slider
            value={activitiesCount}
            min={0}
            max={50}
            onChange={(_, newValue) => setActivitiesCount(newValue as number)}
            valueLabelDisplay="auto"
          />
        </Box>

        <Button onClick={handleSearch} variant="contained">
          Rechercher
        </Button>
      </div>
      <div className="sidebar__favs">
        <Typography variant="h4">Favoris</Typography>
        {mapContext?.favs.map((fav) => (
          <div className="sidebar__favs__item">
            <Typography>{fav.title}</Typography>

            <div className="sidebar__favs__item__buttons">
              <Button href={fav.link} variant="outlined" size="small">
                Voir sur SeLoger
              </Button>
              <Button
                onClick={() => mapContext?.removeFav(fav.id)}
                size="small"
                variant="outlined"
                color="error"
              >
                X
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getNorthWest(northEastLatLong: any, southWestLatLong: any) {
  return {
    lat: northEastLatLong.lat(),
    lng: southWestLatLong.lng(),
  };
}

function getSouthEast(northEastLatLong: any, southWestLatLong: any) {
  return {
    lat: southWestLatLong.lat(),
    lng: northEastLatLong.lng(),
  };
}

function calculateBoundingBox(
  latitude: number,
  longitude: number,
  radius: number
) {
  const latitudeDifference = radius / 111320;
  const longitudeDifference =
    radius / (111320 * Math.cos((latitude * Math.PI) / 180));

  const minLatitude = latitude - latitudeDifference;
  const maxLatitude = latitude + latitudeDifference;
  const minLongitude = longitude - longitudeDifference;
  const maxLongitude = longitude + longitudeDifference;

  return [minLatitude, minLongitude, maxLatitude, maxLongitude];
}
