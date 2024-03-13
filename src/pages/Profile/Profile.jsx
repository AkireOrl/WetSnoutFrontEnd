import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./Profile.css";
import { getAppointments, getProfile, updateAppoState, updateUser } from "../../Services/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData, userData } from "../userSlice";
import { jwtDecode } from "jwt-decode";
import { CustomForm } from "../../Components/CustomForm/CustomForm";
import moment from "moment";
// import { AppointmentCard } from "../../Components/AppointmentsCard/AppointmentsCard.jsx";



export const Profile = () => {
  const userRdxDetail = useSelector(userData)
  const token = userRdxDetail.credentials.token
  const decodedToken = jwtDecode(token)
  const userId = decodedToken.userId;


  const [profileData, setProfileData] = useState({});
  const [appointmentData, setAppointmentData] = useState([])
  const [editableProfileData, setEditableProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
 

  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/register");
      } else {
        const id = decodedToken.userId;
        console.log(id, "soy id aquí");
        const res = await getProfile(token, id);
        setProfileData(res);

        // lógica para determinar qué entra en seteditableprofiledata
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
  }, [token, decodedToken.userId]);

  // useEffect(() => {
  //   getAppointments(token, userId).then((res) => {
  //     setAppointmentData(res);
  //   });
    
  // },[]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAppointments(token, userId);
        setAppointmentData(res);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
  
    fetchData();
  }, [token, userId]);

  // useEffect(() => {
  //   getAppointments(token, userId).then(
  //     (res) => { setAppointmentData(res) }

  //   )

  // }, []);

  console.log(appointmentData, "soy appo en perfil")
  console.log(profileData, "Soy Perfil")

  const inputHandler = (event) => {
    setEditableProfileData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,

    }));

  };

  const buttonHandler = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateState = async (appointmentId, newState) => {
    try {
      if (appointmentId) {
        const response = await updateAppoState(token, appointmentId, newState);

        if (response.data) {

          console.log('Estado actualizado con éxito');
          // Uctualización del estado de la cita
          setAppointmentData(prevState => {
            return prevState.map(appointment => {
              if (appointment.appointment_id === appointmentId) {
                return { ...appointment, is_active: newState };
              } else {
                return appointment;
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


  const handleClick = (appointment) => {
    console.log(appointment);
    if (appointment && appointment.appointment_id !== undefined) {
      const newState = !appointment.is_active
      console.log(`Updating appointment with ID ${appointment.appointment_id} to state ${newState}`);
      handleUpdateState(appointment.appointment_id, newState);
      // handleUpdateState(appointment.filter((appointment) => appointment.id !== id));
      window.location.reload();
    } else {
      console.error('ID de la cita indefinido');
    }
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
        phone: editableProfileData.phone,
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
          <img style={{ width: '10rem' }} src={profileData.photo}></img>
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

        <div className="col-md-5 align-self-end mt-5 mb-5">
          {appointmentData.appointments && appointmentData.appointments
            .filter(appointment => appointment.is_active)
            .map((appointment, appointmentIndex) => (
              <div className="textContainer container-fluid" key={appointmentIndex}>
                {/* <h2>Appointment #{appointmentIndex + 1}</h2> */}
                {appointment.dog_profile && (
                  <Card style={{ width: '20rem' }}>
                    <Card.Img variant="top" src={appointment.dog_profile.photo} />
                    <Card.Body>
                      <Card.Title>{appointment.dog_profile.name}</Card.Title>
                      <Card.Text>
                        {moment(appointment.date).format("DD-MM-YYYY")}
                      </Card.Text>
                      <Card.Text>
                        {appointment.hour}
                      </Card.Text>
                      <div className="iconTrash mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" onClickCapture={() => handleClick(appointment, 0)}>
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </div>
            ))}
        </div>

      </div>

    </>
  )
};


