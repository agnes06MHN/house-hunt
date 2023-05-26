import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { IUser } from '../models/user.model';
import { MapContext } from './MapContext';

export interface IAuthContext {
  authToken?: string;

  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const mapContext = useContext(MapContext);

  const [authToken, setAuthToken] = useState<string>();

  async function signIn(email: string, password: string) {
    const response = await fetch('http://localhost:3000/auth/sign_in', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      return null;
    }

    const { accessToken } = (await response.json()) as IUser;
    setAuthToken(accessToken);
    mapContext?.setAccessToken(accessToken);

    const favsResponse = await fetch('http://localhost:3000/favs', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    const favs = await favsResponse.json();
    mapContext?.addFavs(favs);
    console.log(favs);

    return accessToken;
  }

  function signOut() {
    setAuthToken(undefined);
  }

  return (
    <AuthContext.Provider value={{ authToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
