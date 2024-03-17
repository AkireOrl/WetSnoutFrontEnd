import { useState } from 'react';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, userData } from '../../pages/userSlice';
import { userLogin, userRegister } from '../../Services/ApiCalls';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function RegisterPopUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRdxData = useSelector(userData);
  const token = userRdxData.credentials.token;

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const inputHandler = (event) => {
    setRegisterData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(event.target.value);
  };

  const buttonHandler = () => {
    //definimos las credenciales para el futuro login con los datos de registro
    const credentials = {
      email: registerData.email,
      password: registerData.password,
    };
    userRegister(registerData)
      .then(() => {

        userLogin(credentials)
          .then((token) => {
            if (!token) {
              navigate("/login");
              return null;
            }
            const decodedToken = jwtDecode(token)

            const data = {
              token: token,
              userData: decodedToken
            }
            dispatch(login({ credentials: data }))
            setTimeout(() => {
              navigate('/perfil')
            });

          })
          .catch((err) => console.error("Ha ocurrido un error", err))
      });
  }
  
  return (
    <>
      {!token ? (
        <Popup
          trigger={
            <p >
              Registrarse
            </p>
          }
          modal
          nested
          closeButton
          onOpen={() => setRegisterData({ username:'',email: '', password: '' })}
        >
          {(close) => (
            <div className="customForm">
              <button
                className="btn bg-primary close btn-sm text-light"
                onClick={close}
              >
                <span>&times;</span>
              </button>
                
              <label>UserName:</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={inputHandler}
              />
              <label>Email:</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={inputHandler}
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={inputHandler}
              />

              <button
                className="btn btn-primary btn-sm col-xs-auto"
                onClick={() => {
                  buttonHandler();
                  close();
                }}
              >
                Entrar
              </button>
            </div>
          )}
        </Popup>
      ) : null}
    </>
  );
}

export default RegisterPopUp;