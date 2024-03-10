import { useEffect, useState } from "react"
import { getAllDogs } from "../../Services/ApiCalls";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



export const Dogs = () => {

    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        if (dogs.length === 0) {
            getAllDogs().then((res) => {
                setDogs(res.data.results);
            });
        }
    }, []);

    console.log(dogs, "somos perros");


    return (

        <>
            <div className="top">
                <div className="banner mb-5">
                    <div className="HomeBody col-12 ">
                        <h1 className="titol">WetSnout</h1>

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
                                                <Card.Text>{dog.race}</Card.Text>
                                                <Card.Text>{dog.size}</Card.Text>
                                                <Button variant="primary">Go somewhere</Button>
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