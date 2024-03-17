import { useState } from "react";
import { CustomForm } from "../../Components/CustomForm/CustomForm";
import { dogRegisterCall } from "../../Services/ApiCalls";
import { useSelector } from "react-redux";
import { userData } from "../userSlice";


export const DogRegister = () => {
    const userRdxDetail = useSelector(userData)
    const token = userRdxDetail.credentials.token
const [dogRegister, setDogRegister] = useState({
    
        name:"", 
        race: "",
        age: Number,
        size: "",
        gender: "", 
        weight: "",
        sociable: "",
        photo: "",
        gallery:"",

     
})
const inputHandler = (event) => {
    setDogRegister((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  
  };


  const buttonHandler = async () => {
    try {
      await dogRegisterCall(dogRegister, token);
      // Si la función dogRegisterCall es exitosa, puedes limpiar el estado de dogRegister
      setDogRegister({
        name: "",
        race: "",
        age: Number,
        size: "",
        gender: "",
        weight: "",
        sociable: "",
        photo: "",
        gallery: "",
      });
    } catch (err) {
      console.error("Ha ocurrido un error", err);
    }
  };

    return(
        <>
              <div className="container">
      <div className="col-md-6 align-self-end mt-5 mb-5">
        <div className="textContainer container-fluid" id="crearPerro">
          <div className="customForm col">
              <label>Nombre</label>
              <CustomForm
                type={"text"}
                name={"name"}
                value={dogRegister.name}
                handler={inputHandler}
                placeholder={'Nombre del perro'}
              >
              </CustomForm>
              <label>Raza</label>
              <CustomForm
                type={"text"}
                name={"race"}
                value={dogRegister.race}
                handler={inputHandler}
                placeholder={'Raza del perro'}
              >

              </CustomForm>
              <label>Edad</label>
              <CustomForm
                type={"number"}
                name={"age"}
                value={dogRegister.age}
                handler={inputHandler}
                placeholder={'Edad del perro'}
              >
              </CustomForm>
              <label>Tamaño</label>
              <CustomForm
                type={"text"}
                name={"size"}
                value={dogRegister.size}
                handler={inputHandler}
                placeholder={'Tamaño del perro'}
              >
              </CustomForm>
              <label>Sexo</label>
              <CustomForm
                type={"text"}
                name={"gender"}
                value={dogRegister.gender}
                handler={inputHandler}
                placeholder={'Sexo del perro'}
              >
              </CustomForm>
              <label>Peso</label>
              <CustomForm
                type={"text"}
                name={" weight"}
                value={dogRegister.weight}
                handler={inputHandler}
                placeholder={'Peso del perro'}
              >
              </CustomForm>
              <label>Es Sociable?</label>
              <CustomForm
                type={"text"}
                name={"sociable"}
                value={dogRegister.sociable}
                handler={inputHandler}
                placeholder={'El perro se lleva bien con otros perros, gatos y/o niños?'}
              >
              </CustomForm>
              <label>Foto</label>
              <CustomForm
                type={"text"}
                name={"photo"}
                value={dogRegister.photo}
                handler={inputHandler}
                placeholder={'Fotografía del perro'}
              >
              </CustomForm>
              <input type="submit" name="" onClick={buttonHandler} value="Registrar Perro"></input>
        </div>
        </div>
        </div>
        </div>
        </>
    );
}