// src/components/OAuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const fetchUserProfile = async (token) => {
    const res = await fetch('http://localhost:8080/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch profile: ${errorText}`);
    }

    return await res.json();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');

    if (!token) {
      console.error('Missing token in URL');
      navigate('/login?error=missing-token');
      return;
    }

    localStorage.setItem('token', token);
    console.log("OAuth token:", token);
    console.log("OAuth name/email:", name, email);

    fetchUserProfile(token)
      .then((profile) => {
        if (!profile?.email) {
          console.error("Profile fetch succeeded but missing data", profile);
          navigate('/login?error=invalid-profile');
          return;
        }

        localStorage.setItem("userId", profile.id);
        console.log("Logged in as:", profile.name, "| ID:", profile.id);

        setUser({ ...profile, token });
        navigate('/');
      })
      .catch((err) => {
        console.error('Profile fetch failed:', err.message);
        navigate('/login?error=oauth-profile');
      });
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <CircularProgress />
      <Typography variant="body1" mt={3}>
        Logging you in with your social account...
      </Typography>
    </Box>
  );
};

export default OAuthSuccess;
