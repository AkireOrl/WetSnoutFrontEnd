import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getProfile, updateUser } from "../../Services/ApiCalls";
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
          username: res.profileUser?.username,
          first_name: res.profileUser?.first_name,
          last_name: res.profileUser?.last_name,
          photo: res.profileUser?.photo,
          phone: res.profileUser?.phone
          
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
        first_name: editableProfileData.first_name,
        username: editableProfileData.username,
        email: editableProfileData.email,
        last_name: editableProfileData.last_name,
        photo: editableProfileData.photo,
        phone:  editableProfileData.phone,
      };
     
  
      if (token) {
        try {
          const id = decodedToken.userId;

          updateUser(token, id, updatedData);
          setProfileData((prevState) => ({
            ...prevState,
            profileUser: {
              ...prevState.profileUser,
              first_name: updatedData.first_name,
              username: updatedData.username,
              email: updatedData.email,
              last_name: updatedData.last_name,
              photo: updatedData.photo,
              phone: updatedData.phone,
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
   
      <div className="profileDesign">
        <div className="userInfo">
          <img style={{width: '10rem'}} src={profileData.photo}></img>
          <h1 className="">{profileData.username}</h1>
          <h3 className="">{profileData.email}</h3>
          <h3 className="">{profileData.first_name}</h3>
          <h3 className="">{profileData.last_name}</h3>
          <h3 className="">{profileData.phone}</h3>
          <h3 className="">{profileData.city}</h3>
          <button onClick={() => buttonHandler()}>
            {isEditing ? "Ocultar edición" : "Editar perfil"}
          </button>
          </div>
          <div className="updateData">
          {isEditing ? (
            <>
              <CustomForm
                name="first_name"
                type="text"
                handler={inputHandler}
                value={editableProfileData.first_name}
                placeholder="Nombre"
               
              ></CustomForm>
              <CustomForm
                name="last_name"
                type="text"
                handler={inputHandler}
                value={editableProfileData.last_name}
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
               <CustomForm
                name="phone"
                type="text"
                handler={inputHandler}
                value={editableProfileData?.phone}
                placeholder="Cambia tu numero"
              ></CustomForm>
            </>
          ) : null}
        </div>

        {isEditing ? (
          <button onClick={saveChanges}>Guardar cambios</button>
        ) : null}

        {/* <h2>{profileData.name}</h2>
        <h2>{profileData.profileUser?.surname}</h2>
        <p>{profileData.profileUser?.email}</p> */}




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


