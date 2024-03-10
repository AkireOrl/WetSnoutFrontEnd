import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./Home.css"
import { CustomForm } from '../../Components/CustomForm/CustomForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, userData } from '../userSlice';
import { userLogin, userRegister } from '../../Services/ApiCalls';
import { jwtDecode } from 'jwt-decode';
//-------------------------------------------------------------------------



export const Home = () => {

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

  const dispatch = useDispatch();
  const userRdxData = useSelector(userData);
  const navigate = useNavigate();


  //   useEffect (() => {
  //    console.log(registerData);

  // }, [registerData])

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
              navigate('/profile')
            });

          })
          .catch((err) => console.error("Ha ocurrido un error", err))
      });
  }

  return (
    <>

      <div className="HomeBody">
        <div className="topAbove no-gutter">
          <div className="banner">
            <div className="HomeBody col-12">
              <h1 className="titol">WetSnout</h1>

            </div>
          </div>
          <div className="row container-fluid">
            {/* Primer div */}
            <div className=" welcomeText col-md-7 center mt-5 d-flex align-items-center">
              <div className="welcomeText col-12 ">
                <h1 className="textText">Bienvenid@ a WetSnout </h1>
                <p className="textoInicial">En cada rincón de nuestro refugio, encontrarás corazones latiendo con amor. Nuestra visión es simple pero poderosa: construir puentes hacia un futuro donde cada cola tenga un final feliz.
                  <br></br>
                  Aquí, la compasión es nuestro idioma común y la empatía, nuestra guía. Nos enorgullece ofrecer refugio, cuidado y, lo más importante, esperanza a aquellos que han experimentado la adversidad.</p>

              </div>
            </div>

            {/* Segundo div */}
            <div className="col-md-5 align-self-end mt-5 mb-5">
              <div className="textContainer container-fluid">
                <Card style={{ width: '20rem' }} >
                  <Card.Img variant="top" src="/perretes.jpg" />
                  <Card.Body>
                    <Card.Title>Pawspective Strolls</Card.Title>
                    <Card.Text>
                      ¿Estás pensando en adoptar pero tienes dudas por si no congenias con tu nuevo amigo? Ponemos a tu disposición el servicio "Pasea con Perspectiva de Patas".
                    </Card.Text>
                    <a href='#FormHome'>
                      <Button variant="primary" > Entra y Pasea</Button>
                    </a>
                  </Card.Body>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="HomeCarousel">
        <Carousel data-bs-theme="light">
          <Carousel.Item>
            <img
              className="d-block w-100 "
              src="/perretes-muro.jpeg"
              alt="Second slide"
              style={{
                height: '400px',
                objectFit: 'cover',
                filter: 'brightness(0.5)',
              }}
            />
            <Carousel.Caption>
              <h5 className="carousel-titol">Exploradores intrépidos</h5>
              <p>Acompaña a estos intrépidos caninos en sus emocionantes aventuras, siempre listos para descubrir nuevos horizontes y llenar tu día de alegría y lealtad.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 "
              src="/cachorrosmarrones.jpg"
              alt="Second slide"
              style={{
                height: '400px',
                objectFit: 'cover',
                filter: 'brightness(0.5)',
              }}
            />
            <Carousel.Caption>
              <h5 className="carousel-titol">Amigos peludos para siempre</h5>
              <p>En el mundo de la lealtad y el cariño incondicional, estos adorables compañeros de cuatro patas demuestran que la amistad verdadera viene con orejas peludas y cola moviéndose de un lado a otro.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 "
              src="/cachorros.jpg"
              alt="Second slide"
              style={{
                height: '400px',
                objectFit: 'cover',
                filter: 'brightness(0.5)',
              }}
            />
            <Carousel.Caption>
              <h5 className="carousel-titol">Energía y diversión sin límites</h5>
              <p>
                Vibrantes, juguetones y llenos de vitalidad, estos perros encarnan la alegría de vivir. Sumérgete en su mundo lleno de energía positiva y contágiate de su entusiasmo contagioso.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="row container-fluid ">
        {/* Primer div */}
        <div className="col-md-7 center mt-5">
          <div className="welcomeText col-12 ">
            <h1 className="textText">Únete a la Comunidad de WetSnout</h1>
            <p className="textoInicial">¡Bienvenido a WetSnout! Estamos emocionados de tenerte como parte de nuestra comunidad. Completa el formulario de registro a continuación y comienza a explorar un mundo lleno de amistad canina, noticias emocionantes y consejos útiles. ¡Es hora de sumergirse en la experiencia WetSnout y descubrir todo lo que este universo peludo tiene para ofrecer!</p>
          </div>
        </div>

        {/* Segundo div */}
        <div className="col-md-4 align-self-end mt-5 mb-5">
          <div className="textContainer container-fluid" id="FormHome">

            <div className='customForm col'>
              <label>USERNAME</label>
              <CustomForm
                type={"text"}
                name={"username"}
                value={registerData.username}
                handler={inputHandler}
                placeholder={'Nombre de usuario'}
              >
              </CustomForm>
              <label>EMAIL</label>
              <CustomForm
                type={"email"}
                name={"email"}
                value={registerData.email}
                handler={inputHandler}
                placeholder={'Email'}
              >

              </CustomForm>
              <label>CONTRASEÑA</label>
              <CustomForm
                type={"password"}
                name={"password"}
                value={registerData.password}
                handler={inputHandler}
                placeholder={'Password'}
              >

              </CustomForm>
              <input type="submit" name="" onClick={buttonHandler} value="Registrarse"></input>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

