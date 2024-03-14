import { useState } from 'react';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, userData } from '../../pages/userSlice';
import { userLogin } from '../../Services/ApiCalls';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function LoginPopup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRdxData = useSelector(userData);
  const token = userRdxData.credentials.token;

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    setCredentials((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = () => {
    userLogin(credentials)
      .then((token) => {
        if (!token) {
          navigate('/login');
          return null;
        }

        const decodedToken = jwtDecode(token);
        const data = {
          token: token,
          userData: decodedToken,
        };

        dispatch(login({ credentials: data }));

        const isAdmin = decodedToken.userRoles.includes('admin');
        setTimeout(() => {
          isAdmin ? navigate('/profile') : navigate('/perfil');
        });
      })
      .catch((err) => console.error('Ha ocurrido un error', err));
  };

  const logMeOut = () => {
    dispatch(logout({ credentials: { token: null, userData: null } }));
    navigate('/');
  };

  const isLoggedIn = () => {
    if (token) {
      try {
        let decodeToken = jwtDecode(token);
        return decodeToken;
      } catch (error) {
        console.error('No estás registrado');
      }
    }
  };

  return (
    <>
      {!token ? (
        <Popup
          trigger={
            <button className="bg-primary btn-lg text-light rounded rounded-3">
              Login
            </button>
          }
          modal
          nested
          closeButton
          onOpen={() => setCredentials({ email: '', password: '' })}
        >
          {(close) => (
            <div className="customForm">
              <button
                className="btn bg-primary close btn-sm text-light"
                onClick={close}
              >
                <span>&times;</span>
              </button>

              <label>Email:</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange}
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
              />

              <button
                className="btn btn-primary btn-sm col-xs-auto"
                onClick={() => {
                  handleLogin();
                  close();
                }}
              >
                Entrar
              </button>
            </div>
          )}
        </Popup>
      ) : (
        <button
          className="bg-primary btn-lg text-light rounded rounded-3"
          onClick={logMeOut}
        >
          Logout
        </button>
      )}
    </>
  );
}

export default LoginPopup;