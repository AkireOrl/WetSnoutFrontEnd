import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPopup from '../LoginPopup/LoginPopup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, userData } from '../../pages/userSlice';

//-----------------------------------------------------------
export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRdxData = useSelector(userData);


  const token = userRdxData.credentials.token
  const decoded = userRdxData.credentials.userData

  const [showPopup, setShowPopup] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });


  const buttonHandler = () => {
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
        const isAdmin = decodedToken.userRoles.includes("admin");
        setTimeout(() => {
          isAdmin ? navigate('/tatuprofile') : navigate('/perfil');
        });

      })
      .catch((err) => console.error("Ha ocurrido un error", err))
  };

  const logMeOut = () => {
    dispatch(logout({ credentials: { token: null, userData: null}}));
  
      navigate('/')
    
  };




  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="container-fluid d-flex flex-row">
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">
              <img
                src="/WetSnout.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Navbar.Brand href="#home">WetSnout</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/animales"> Perretes</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              {!token ? (
                <>
              <NavDropdown.Item href="#action/3.1">Nologuii</NavDropdown.Item>
              </>
              ): decoded.userRoles[0] === "admin" ? (
                <>
              <NavDropdown.Item href="/perfil">ConLoguinn</NavDropdown.Item>
              </>
              ): decoded.userRoles[0] === "super_admin" ?  (
                <>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              </> 
              ): (
                <>
                <NavDropdown.Item href="/perfil">Soy User</NavDropdown.Item>
                </> 
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logMeOut()}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ml-auto btnlogin ">
        {/* <button className="bg-primary text-light rounded rounded-3" onClick={() => setShowPopup(true)}>
          Login
        </button> */}
        {<LoginPopup show={showPopup} onClose={() => setShowPopup(false)} />}
      </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

