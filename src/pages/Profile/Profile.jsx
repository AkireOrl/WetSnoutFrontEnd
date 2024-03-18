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




export const Profile = () => {
  const userRdxDetail = useSelector(userData)
  const token = userRdxDetail.credentials.token
  const decodedToken = jwtDecode(token)
  const userId = decodedToken.userId;


  const [profileData, setProfileData] = useState({
    profileUser: { // Inicializar profileUser aquí
      first_name: '',
      username: '',
      email: '',
      last_name: '',
      photo: '',
      phone: '',
    },
  });
  const [appointmentData, setAppointmentData] = useState([])
  const [editableProfileData, setEditableProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);



  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/home");
      } else {
        const id = decodedToken.userId;
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

    
  useEffect(() => {
    if (!userId || !token || !profileData.appointments || profileData.appointments.length === 0) {
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getAppointments(token, userId);
        setAppointmentData(res);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, [token, userId, profileData]);
  

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
          //cambiar estos console por mensajes impresos en pantalla.
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
 
    if (appointment && appointment.appointment_id !== undefined) {
      const newState = !appointment.is_active
      console.log(`Updating appointment with ID ${appointment.appointment_id} to state ${newState}`);
      handleUpdateState(appointment.appointment_id, newState);
     
      window.location.reload();
    } else {
      console.error('ID de la cita indefinido');
    }
  };


  const saveChanges = () => {
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
        const id = decodedToken.userId;
      
        updateUser(token, id, updatedData)
          .then(() => {

            setProfileData((prevState) => ({
              ...prevState,
              profileUser: {
                ...prevState.profileUser,
                ...updatedData,
              },
            }));
            console.log("Datos actualizados en profileData:", profileData);
            setIsEditing(false);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error al actualizar el usuario: ", error.response);
          });

      } else {
        console.error("algo falla en función de guardar");
      }
    } else {
      console.error("userData is undefined");
    }
  };


  return (
    <>

      <div className="profileDesign text-center">
        <div className="userInfo container-fluid">
          <div className=" justify-content-center">
          {/* Columna para la imagen y el nombre de usuario */}
      <div className="col-md-12 d-flex flex-column justify-content-center">
        <div className="userProfileData ">
          <div className="row align-items-center">
            <div className="col-4">
              <img style={{ width: '5rem', paddingTop: '1em' }} src={profileData.user?.photo} alt="Profile" />
            </div>
            <div className="col-8 d-flex align-items-center">
              <h1 className="userName">{profileData.user?.username}</h1>
            </div>
          </div>
                  <div className="d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center justify-content-center">
                  <p className="labelData me-2">Email: </p>
                  <p className="userData">{profileData.user?.email}</p>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <p className="labelData me-2">Nombre: </p>
                  <p className="userData">{profileData.user?.first_name}</p>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <p className="labelData me-2">Apellido: </p>
                  <p className="userData">{profileData.user?.last_name}</p>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <p className="labelData me-2">Teléfono: </p>
                  <p className="userData me-2">{profileData.user?.phone}</p>
                </div>
                <div className="d-flex align-items-center justify-content-center text-align">
                  <p className="labelData me-2">Ciudad: </p>
                  <p className="userData">{profileData?.city}</p>
                </div>
              </div>
              </div>
              <div className="updateUserInfo mb-3">
                <button className="bg-primary btn-lg text-light rounded rounded-3 mb-2" onClick={() => buttonHandler()}>
                  {isEditing ? "Ocultar edición" : "Editar perfil"}
                </button>
              </div>
              {/* Formulario de edición */}
              {isEditing && (
                <div className="updateData">
                  <div className="row">
                    <div className="col mb-2">
                      <CustomForm
                        name="first_name"
                        type="text"
                        handler={inputHandler}
                        value={editableProfileData.first_name}
                        placeholder="Nombre"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-2">
                      <CustomForm
                        name="last_name"
                        type="text"
                        handler={inputHandler}
                        value={editableProfileData.last_name}
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-2">
                      <CustomForm
                        name="email"
                        type="email"
                        handler={inputHandler}
                        value={editableProfileData.email}
                        placeholder="email"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-2">
                      <CustomForm
                        name="photo"
                        type="text"
                        handler={inputHandler}
                        value={editableProfileData.photo}
                        placeholder="Cambia tu foto"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-2">
                      <CustomForm
                        name="phone"
                        type="text"
                        handler={inputHandler}
                        value={editableProfileData?.phone}
                        placeholder="Cambia tu numero"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="bg-primary btn-lg text-light rounded rounded-3 mb-2" onClick={saveChanges}>Guardar cambios</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
  {appointmentData.appointments && appointmentData.appointments.filter(appointment => appointment.is_active).length > 0 ? (
    <h2>Tus Pasesos Programados:</h2>
  ) : (
    <p>No tienes paseos programados, ¿a qué esperas?.</p>
  )}
</div>

      <div className="container-fluid justify-content-center">
        <div className="row mb-3 justify-content-center">
          {appointmentData.appointments && appointmentData.appointments
            .filter(appointment => appointment.is_active)
            .map((appointment, appointmentIndex) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={appointmentIndex}>
             
                {appointment.dog_profile && (
                  <Card style={{ width: '20rem' }}>
                    <Card.Img variant="top" style={{ width: '200px', height: '200px' }} src={appointment.dog_profile.photo} />
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
  );
}


