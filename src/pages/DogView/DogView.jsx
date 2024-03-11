import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const DogView = () => {
  const { id } = useParams();
  const selectedDog = useSelector((state) => state.dog.selectedDog);

  if (!selectedDog) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{selectedDog.name}</h2>
      <p>Raza: {selectedDog.race}</p>
      {/* Otros detalles del perro */}
    </div>
  );
};



