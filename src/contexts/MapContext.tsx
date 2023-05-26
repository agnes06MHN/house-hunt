import React, { PropsWithChildren, createContext, useState } from 'react';
import { IComputedPoints } from '../models/computed-points.model';
import { Coords } from 'google-map-react';
import { IFav } from '../models/fav.model';

export const DEFAULT_CENTER: Coords = {
  lat: 48.864716,
  lng: 2.349014,
};

export const DEFAULT_ZOOM = 15;

export interface IMapContext {
  map: any;
  initMap: (map: any) => void;
  center: Coords;
  zoom: number;
  updateZoom: (zoom: number) => void;
  points?: IComputedPoints;
  fetchPlaces: (addresses: string[]) => Promise<IComputedPoints>;
  places: any[];
  clusters: any[];
  addPlace: (places: any) => void;
  clearPlaces: () => void;
  addClusters: (clusters: any[]) => void;
  clearClusters: () => void;
  loading: boolean;
  toggleLoading: () => void;
  detailedPlace?: any;
  detailAPlace: (placeId: number) => void;
  closeDetail: () => void;
  favs: IFav[];
  addFavs: (fav: IFav[]) => void;
  token?: string;
  setAccessToken: (token: string) => void;
  addFav: (fav: IFav) => void;
  removeFav: (favId?: string) => void;
}

export const MapContext = createContext<IMapContext | null>(null);

export const MapContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [map, setMap] = useState<any>();
  const [center, setCenter] = useState<Coords>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [points, setPoints] = useState<IComputedPoints>();
  const [places, setPlaces] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailedPlace, setDetailedPlace] = useState<any>();
  const [favs, setFavs] = useState<IFav[]>([]);
  const [token, setToken] = useState<string>();

  const initMap = (map: any) => {
    setMap(map);
  };

  const updateZoom = (zoom: number) => {
    setZoom(zoom);
  };

  const fetchPlaces = async (addresses: string[]): Promise<IComputedPoints> => {
    let params;

    if (addresses.length > 0) params = 'first_address=' + addresses[0];
    if (addresses.length > 1) params += '&second_address=' + addresses[1];
    if (addresses.length > 2) params += '&third_address=' + addresses[2];

    const res = await fetch(
      `http://localhost:3000/map/points_from_addresses?${params}`,
      {
        headers: {
          method: 'GET',
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = await res.json();
    setPoints(data);
    setCenter({
      lat: data.centeredPoint.latitude,
      lng: data.centeredPoint.longitude,
    });
    return data;
  };

  const clearPlaces = () => {
    setPlaces([]);
  };

  const addPlace = (places: any) => {
    setPlaces((prev) => [...prev, places]);
  };

  const clearClusters = () => {
    setClusters([]);
  };

  const addClusters = (clusters: any[]) => {
    setClusters((prev) => [...prev, ...clusters]);
  };

  const toggleLoading = () => {
    setLoading((prev) => !prev);
  };

  const detailAPlace = async (placeId: number) => {
    const response = await fetch(
      `https://seloger.p.rapidapi.com/properties/detail?id=${placeId}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '23c05b0539msh9a2233de9c0717dp1863dajsnff65aa1ebe9b',
          'X-RapidAPI-Host': 'seloger.p.rapidapi.com',
        },
      }
    );
    const data = await response.json();
    setDetailedPlace(data);
  };

  const closeDetail = () => {
    setDetailedPlace(undefined);
  };

  const addFavs = (fav: IFav[]) => {
    setFavs(fav);
  };

  const addFav = (fav: IFav) => {
    const { title, link } = fav;
    fetch(`http://localhost:3000/favs?title=${title}&link=${link}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    });

    setFavs((prev) => [...prev, fav]);
  };

  const removeFav = (favId?: string) => {
    fetch(`http://localhost:3000/favs/${favId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    setFavs((prev) => prev.filter((fav) => fav.id !== favId));
  };

  const setAccessToken = (token: string) => {
    setToken(token);
  };

  return (
    <MapContext.Provider
      value={{
        points,
        fetchPlaces,
        center,
        zoom,
        updateZoom,
        map,
        initMap,
        places,
        addPlace,
        clearPlaces,
        clusters,
        addClusters,
        clearClusters,
        loading,
        toggleLoading,
        detailedPlace,
        detailAPlace,
        closeDetail,
        favs,
        addFavs,
        addFav,
        token,
        setAccessToken,
        removeFav,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
