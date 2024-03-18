import { useEffect, useState } from "react"
import { getAllDogs, updateDogState } from "../../Services/ApiCalls";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {setSelectedDog} from "../dogSlice";
import './Dogs.css';
import { jwtDecode } from "jwt-decode";
import { userData } from "../userSlice";

export const Dogs = () => {
  const userRdxDetail = useSelector(userData)
  const token = userRdxDetail.credentials.token;
  const userRol = userRdxDetail.credentials.userData?.userRoles[0];
  
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [dogs, setDogs] = useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllDogs().then((res) => {
      setDogs(res.data.results);
    });

}, []);

  useEffect(() => {
    if (selectedDogId !== null) {
      if (dogs && dogs.length > 0) {
        const selectedDog = dogs.find(dog => dog.id === parseInt(selectedDogId, 10));

        if (selectedDog) {
          dispatch(setSelectedDog(selectedDog));
          navigate(`/animales/${selectedDogId}`);
         
        } else {
          console.error("Perro no encontrado en el estado de Redux.");
        }
      } else {
        console.error("Estado de Redux no definido.");
       
      }
    }
  }, [selectedDogId]);

  const handleUpdateState = async (dogId, newState) => {
    try {
      if (dogId) {
        const response = await updateDogState(token, dogId, newState);
        
        if (response) {

          console.log('Estado actualizado con éxito');
       
          // Actualización del estado de la cita
          setDogs(prevState => {
            return prevState.map(dog => {
              
              if (dog.id === dogId) {
                
                return { ...dog, is_active: newState };
              } else {
                return dog;
              }
            });
          });
        } else {
          console.log('Estado actualizado');
        }
      } else {
        console.error('ID de la cita indefinido');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  
  const handleClick = (dog) => {
    console.log(dog)
    if (dog && dog.id !== undefined) {
      console.log(dog.id, "soy id del perro")
      const newState = !dog.is_active
      console.log(`Updating appointment with ID ${dog.id} to state ${newState}`);
      handleUpdateState(dog.id, newState);
      
     
    } else {
      console.error('ID del perro indefinido');
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
            {dogs && dogs.length > 0 ? (
              dogs
              .filter(dog => dog.is_active)
              .map((dog) => {
                return (
                  <div className="col-md-4 mb-3 d-flex justify-content-center" key={dog.id}>
                    <Card style={{ width: '19rem' }}>
                      <Card.Img variant="top" style={{ width: '17rem', height: '17rem' }} src={dog.photo} />
                      <Card.Body>
                        <Card.Title>{dog.name}</Card.Title>
                        <Card.Text>Raza: {dog.race}</Card.Text>
                        <Card.Text>Tamaño: {dog.size}</Card.Text>
                        <Button variant="primary" onClick={() =>setSelectedDogId(dog.id)}
                        >Ver Ficha</Button>
                    
                        {isLoggedIn() && userRol === "super_admin" && <button className="bg-primary btn-lg text-light rounded rounded-3" onClick={() => handleClick(dog)}>desactivar perro</button>}
                   
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