import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getProfile } from "../../Services/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData, userData } from "../userSlice";
import { jwtDecode } from "jwt-decode";
import { CustomForm } from "../../Components/CustomForm/CustomForm";
// import moment from "moment";
// import { AppointmentCard } from "../../Components/AppointmentsCard/AppointmentsCard.jsx";



export const Profile = () => {
  const userRdxDetail = useSelector(userData)

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const token = userRdxDetail.credentials.token
  const decodedToken = jwtDecode(token)
 
  const userId = decodedToken.userId;

  const dispatch = useDispatch();
  const [editableProfileData, setEditableProfileData] = useState({});
 
console.log(profileData)
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/register");
      } else {
        const id = decodedToken.userId;
        console.log(id, "soy id aquí")
        const res = await getProfile(token, id );
        setProfileData(res);

        //logica para determinar que entra en el seteditableprofiledata
        setEditableProfileData({
          username: res.profileData?.username,
          name: res.profileData?.first_name,
          surname: res.profileData?.last_name,
          photo: res.profileData?.photo
          
        });
        
      }
    };

    fetchData();
  }, []);


  useEffect(()=>{
    
  } , [profileData]);



  const inputHandler = (event) => {
    setEditableProfileData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
     
    }));
    
  };

  const buttonHandler = () => {
    setIsEditing(!isEditing);
  };

  
  const saveChanges = async () => {
    if (editableProfileData) {
      // Actualizar el perfil del usuario en la base de datos
      const updatedData = {
        name: editableProfileData.name,
        username: editableProfileData.username,
        surname: editableProfileData.surname,
        photo: editableProfileData.photo,
      };
     
  
      if (token) {
        try {
        //   updateUser(token, updatedData);
          setProfileData((prevState) => ({
            ...prevState,
            profileUser: {
              ...prevState.profileUser,
              name: updatedData.name,
              username: updatedData.username,
              surname: updatedData.surname,
              photo: updatedData.photo,
            },
          }));
          setIsEditing(false);
        } catch (error) {
          console.error("Error al actualizar el usuario: ", error.response);
        }
      } else {
        console.error("algo falla en función de guardar");
      }
    } else {
      console.error("userData is undefined");
    }
  };
  return (
    <>
    <h1>{profileData.username}</h1>
      <div className="profileDesign">
        <div className="userInfo">
          <img src={profileData.profileUser?.photo}></img>
          <h1 className="">{profileData.profileUser?.username}</h1>
          <button onClick={() => buttonHandler()}>
            {isEditing ? "Ocultar edición" : "Editar perfil"}
          </button>
          </div>
          <div className="updateData">
          {isEditing ? (
            <>
              <CustomForm
                name="name"
                type="text"
                handler={inputHandler}
                value={editableProfileData.name}
                placeholder="Nombre"
               
              ></CustomForm>
              <CustomForm
                name="surname"
                type="text"
                handler={inputHandler}
                value={editableProfileData.surname}
                placeholder="Apellido"
              ></CustomForm>
                <CustomForm
                name="email"
                type="email"
                handler={inputHandler}
                value={editableProfileData.email}
                placeholder="email"
              ></CustomForm>
               <CustomForm
                name="photo"
                type="text"
                handler={inputHandler}
                value={editableProfileData.photo}
                placeholder="Cambia tu foto"
              ></CustomForm>
            </>
          ) : null}
        </div>

        {isEditing ? (
          <button onClick={saveChanges}>Guardar cambios</button>
        ) : null}

        <h2>{profileData.profileUser?.name}</h2>
        <h2>{profileData.profileUser?.surname}</h2>
        <p>{profileData.profileUser?.email}</p>




        {/* <div className="appointmentsUserContainer col-9">
          {profileData.appointments && profileData.userArtistIds.map((userArtistId, index) => (
            <div className="col-md-3" key={index}>
            <AppointmentCard
            
              artistName={userArtistId}
              date={moment(profileData.appointments[index].date).format("DD-MM-YYYY")}
              hour={profileData.appointments[index].hour}

            />
            </div>
          ))}
        
        </div> */}
      </div>
      
    </>
  )
};


