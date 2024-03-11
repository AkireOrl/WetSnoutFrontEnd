import { useEffect, useState } from "react"
import { getAllDogs } from "../../Services/ApiCalls";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {dogSlice,setSelectedDog} from "../dogSlice";
import './Dogs.css';

export const Dogs = () => {
  const dispatch = useDispatch();
  const dogs = useSelector(state => state.dog.dogs) || [];
  const [selectedDogId, setSelectedDogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (dogs.length === 0) {
      getAllDogs().then((res) => {
        dispatch(dogSlice.actions.setDogs(res.data.results));
      });
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("Perros en el estado de Redux:", dogs);
    // Resto del código...
  }, [dogs]);

  useEffect(() => {
    if (selectedDogId !== null) {
      if (dogs && dogs.length > 0) {
        const selectedDog = dogs.find(dog => dog.id === parseInt(selectedDogId, 10));

        if (selectedDog) {
          dispatch(setSelectedDog(selectedDog));
          navigate(`/animales/${selectedDogId}`);
          console.log(selectedDogId);
          // dispatch(selectedDogId);
        } else {
          console.error("Perro no encontrado en el estado de Redux.");
          // Puedes manejar el caso en el que el perro no se encuentre en el estado de Redux
        }
      } else {
        console.error("Estado de Redux no definido.");
        // Puedes manejar el caso en el que el estado de Redux sea undefined
      }
    }
  }, [selectedDogId]);

  console.log(dogs, "somos perros");

  return (
    <>
      <div className="top">
        <div className="banner-dog mb-5">
          <div className="HomeBody col-12 ">
            <h1 className="titol">Nuestros Peludos</h1>

          </div>
        </div>
      </div>

      <div className="allBody d-flex ">
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center flex-wrap">
            {dogs && dogs.length > 0 ? (
              dogs.map((dog, index) => {
                return (
                  <div className="col-md-4 mb-3 d-flex" key={index}>
                    <Card style={{ width: '18rem' }}>
                      <Card.Img variant="top" style={{ width: '10rem' }} src={dog.photo} />
                      <Card.Body>
                        <Card.Title>{dog.name}</Card.Title>
                        <Card.Text>Raza: {dog.race}</Card.Text>
                        <Card.Text>Tamaño: {dog.size}</Card.Text>
                        <Button variant="primary" onClick={() =>setSelectedDogId(dog.id)}
                        >Ver Ficha</Button>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })
            ) : (
              <p>No hay animales para mostrar.</p>
                        )}
                    </div>
                </div>
            </div>



        </>
    )
}