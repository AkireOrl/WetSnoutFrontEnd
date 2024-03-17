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
  const [dogs, setDogs ]= useSelector(state => state.dog.dogs) || [];
  // const dogsres = useSelector([]);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [perros, setPerros] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
   
    getAllDogs().then((res) => {
      console.log(res.data.results, "soy res")
      setPerros(res.data.results);
    });

}, []);


   useEffect(() => {
    console.log("Perros en el estado de Redux:",perros);
    // Resto del código...
  }, [dogs]);

  useEffect(() => {
    if (selectedDogId !== null) {
      if (perros && perros.length > 0) {
        const selectedDog = perros.find(perro => perro.id === parseInt(selectedDogId, 10));

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

      <div className="allBody d-flex col-12 justify-content-center">
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center flex-wrap ">
            {perros && perros.length > 0 ? (
              perros.map((perro) => {
                return (
                  <div className="col-md-4 mb-3 d-flex justify-content-center" key={perro.id}>
                    <Card style={{ width: '19rem' }}>
                      <Card.Img variant="top" style={{ width: '17rem', height: '17rem' }} src={perro.photo} />
                      <Card.Body>
                        <Card.Title>{perro.name}</Card.Title>
                        <Card.Text>Raza: {perro.race}</Card.Text>
                        <Card.Text>Tamaño: {perro.size}</Card.Text>
                        <Button variant="primary" onClick={() =>setSelectedDogId(perro.id)}
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