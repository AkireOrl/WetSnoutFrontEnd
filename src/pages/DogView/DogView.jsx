import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const DogView = () => {
  const { id } = useParams();
  const dogs = useSelector(state => state.dogs);
  

  if (!dogs) {
    return <p>Loading...</p>;
  }

  const selectedDog = dogs.find(dogs => dogs.id === parseInt(id));


  if (!selectedDog) {
    return <p>Perro no encontrado</p>;
  }

  return (
    <div>
      <h2>{selectedDog.name}</h2>
      <p>Raza: {selectedDog.race}</p>
      {/* Otros detalles del perro */}
    </div>
  );
};