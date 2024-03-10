import { useState}  from 'react';
import Popup from 'reactjs-popup';
import { useDispatch } from 'react-redux';  // Importing useDispatch
import { login } from '../../pages/userSlice';
import { userLogin } from '../../Services/ApiCalls';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function LoginPopup() {
  const dispatch = useDispatch();  // Initializing useDispatch

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    setCredentials((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
   
  const navigate = useNavigate();
  const handleLogin = () => {
    userLogin(credentials)
      .then((token) => {
        if (!token) {
          navigate("/login");
          return null;
        }
        const decodedToken = jwtDecode(token);

        const data = {
          token: token,
          userData: decodedToken,
        };

        dispatch(login({ credentials: data }));

        const isAdmin = decodedToken.userRoles.includes("admin");
        setTimeout(() => {
          isAdmin ? navigate('/tatuprofile') : navigate('/perfil');
        });

      })
      .catch((err) => console.error("Ha ocurrido un error", err));
  };

  return (
    <Popup
    trigger={<button className="bg-primary btn-lg text-light rounded rounded-3">Login</button>}
    modal // Habilitar modal para oscurecer el fondo
    nested // Anidado para centrar el contenido
    closeButton 
  >
    {(close) => (
      <div className="customForm">
        <button  className="btn bg-primary close btn-sm text-light" onClick={close}>
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

        <button className="btn btn-primary btn-sm col-xs-auto" onClick={() => { handleLogin(); close(); }}>
          Entrar
        </button>
      </div>
    )}
  </Popup>
);
}

export default LoginPopup;