import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPopup from '../LoginPopup/LoginPopup';
import { useState } from 'react';

//-----------------------------------------------------------
export const Header = () => {

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
          isAdmin ? navigate('/tatuprofile') : navigate('/profile');
        });

      })
      .catch((err) => console.error("Ha ocurrido un error", err))
  };





  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="container-fluid r d-flex flex-row">
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">
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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
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
