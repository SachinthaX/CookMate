import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/api';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);

      getProfile()
        .then(res => {
          setUser(res.data);
          navigate('/home');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
