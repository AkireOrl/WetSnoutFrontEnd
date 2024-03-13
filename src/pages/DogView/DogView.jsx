import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Popup from 'reactjs-popup';
import { Col, Container, Image, Row } from "react-bootstrap";
import { createAppointments } from "../../Services/ApiCalls";
import { jwtDecode } from "jwt-decode";
import { userData } from "../userSlice";

export const DogView = () => {
  const { id } = useParams();
  const selectedDog = useSelector((state) => state.dog.selectedDog);
  const userRdxDetail = useSelector(userData)
  const token = userRdxDetail.credentials.token;
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const handleReserveClick = () => {
    setShowForm(true);
  };
  const userRol = userRdxDetail.credentials.userData?.userRoles[0];


  if (!selectedDog) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let decodeToken = jwtDecode(token);
    console.log(decodeToken.userId)


    const activityId = 1;

    const appointmentData = {
      user_id: decodeToken.userId,
      dog_id: selectedDog.id,
      activity_id: activityId, // Activity ID for walk in this case
      date: e.target.elements.date.value,
      hour: e.target.elements.time.value,
    };

    try {

      await createAppointments(token, appointmentData);
      navigate("/perfil");
    } catch (error) {
      console.error("Error creating appointment: ", error);
    }
  };
  const isLoggedIn = () => {
    if (token) {
      try {
        let decodeToken = jwtDecode(token);

        return decodeToken;
      } catch (error) {
        console.error('No estas registrado');
      }
    }
  }



  return (
    <>
      <div>
        <h2>{selectedDog.name}</h2>
        <p>Raza: {selectedDog.race}</p>
        {/* Otros detalles del perro */}
      </div>
      <div className="col-12  mb-3 text-center" key={id}>
        <div className="text-center">
          <Card >
            <Card.Img variant="top" style={{ width: '10rem' }} src={selectedDog.photo} />
            <Card.Body>
              <Card.Title>{selectedDog.name}</Card.Title>
              <Card.Text>Raza: {selectedDog.race}</Card.Text>
              <Card.Text>Tamaño: {selectedDog.size}</Card.Text>
              <Card.Text>Sociable: {selectedDog.sociable}</Card.Text>
              {/* <Button variant="primary"onClick={handleReserveClick}>Reservar Paseo</Button> */}
              <Popup
                trigger={isLoggedIn() && userRol === "user" && <button className="bg-primary btn-lg text-light rounded rounded-3" onClick={() => handleSubmit}>Reservar Cita</button>}
                modal // Habilitar modal para oscurecer el fondo
                nested // Anidado para centrar el contenido
                closeButton
              >
                {(close) => (
                  <div className="customForm">
                    <button className="btn bg-primary close btn-sm text-light" onClick={close}>
                      <span>&times;</span>
                    </button>
                    <form onSubmit={handleSubmit} className="appointmentForm">
                      <label htmlFor="date"></label>
                      <input className="inputsAppo" type="date" id="date" name="date" min={new Date()} required />

                      <label htmlFor="time"></label>
                      <input className="inputsAppo" type="time" id="time" name="time" required />

                      <button type="submit" className="mybutton">
                        Enviar
                      </button>
                    </form>

                  </div>
                )}
              </Popup>
            </Card.Body>
          </Card>


        </div>
      </div>
    </>
  );
}




