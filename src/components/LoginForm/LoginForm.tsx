import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './LoginForm.scss';
import { Typography, TextField, Button } from '@mui/material';

export const LoginForm = () => {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!(await authContext?.signIn(email, password))) setError(true);
  };

  return (
    <div className="login-form">
      <Typography variant="h4">Connexion</Typography>

      <TextField
        className="sidebar__addresses__field"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <TextField
        className="sidebar__addresses__field"
        label="Mot de passe"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
      />

      <Button onClick={handleLogin} variant="contained">
        Se connecter
      </Button>
    </div>
  );
};
