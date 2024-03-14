import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaPowerOff } from "react-icons/fa";
import { BiCheckCircle } from "react-icons/bi";
import { getAllAppointments, getProfile, updateAppoState, updateUser } from "../../Services/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData, userData } from "../userSlice";
import { jwtDecode } from "jwt-decode";
import { CustomForm } from "../../Components/CustomForm/CustomForm";
import moment from "moment";

//------------------------------------------------

export const AdminAppointments = () => {

  const userRdxDetail = useSelector(userData)
  const token = userRdxDetail.credentials.token
  console.log(token)
  


  //const [profileData, setProfileData] = useState({});
  //const [editableProfileData, setEditableProfileData] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [editableAppointmentAdmin, setEditableAppointmentAdmin] = useState();
  // const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    
    const fetchData = async () => {
      try{
      if(!token){
        navigate('/'), { state: { message: "Please log in to access this page" }}
      }else {
        const res = await getAllAppointments(token);
        setAppointmentData(res);
        console.log(res)
      }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, []);
  // const decodedToken = jwtDecode(token)
  // const userId = decodedToken.userId;


  //refactorizar con then/catch
  const handleUpdateState = async (appointmentId, newState) => {
    try {
      if (appointmentId) {
        const response = await updateAppoState(token, appointmentId, newState);
        console.log(response, "ahora si debe salir"); 
        if (response) {

          console.log('Estado actualizado con éxito');
          console.log(response, "soy tressss")
          // Uctualización del estado de la cita
          setAppointmentData(prevState => {
            return prevState.map(appointmentData => {
              console.log(appointmentData, "soy el segundo")
              if (appointmentData.id === appointmentId) {
                console.log(appointmentData, "Soy appo en funcion con Demian")
                return { ...appointmentData, is_active: newState };
              } else {
                return appointmentData;
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

  console.log(appointmentData);
  const handleClick = (appointment) => {
    console.log(appointment);
    if (appointment && appointment.id !== undefined) {
      const newState = !appointment.is_active
      console.log(`Updating appointment with ID ${appointment.id} to state ${newState}`);
      handleUpdateState(appointment.id, newState);
      
     
    } else {
      console.error('ID de la cita indefinido');
    }
  };



  //////////////////////////////////AppointmentsStart///////////////////////////////


  // console.log(appointmentData)
  //  const appointments = appointmentData;
  //  console.log(appointments);
  return (
    <>
      <div>
        <h2>Citas Activas</h2>
      </div>
      {/* /////////////////////////////////////////////////////////////////// */}
      {Array.isArray(appointmentData) && (
        <div className="container">
          <div className="row">
            {appointmentData && appointmentData.filter(appointment => appointment.is_active)
              .map((appointment, index) => (

                <div className="col-md-4 col-sm-12 text-center" key={index}>
                  {/* <h2>Appointment #{appointmentIndex + 1}</h2> */}
                  {appointment.dog && (
                    <Card style={{ width: '20rem' }}>
                      <Card.Img variant="top" src={appointment.dog.photo} />
                      <Card.Body>
                        <Card.Title>{appointment.dog.name}</Card.Title>
                        <Card.Text>
                          Fecha: {moment(appointment.date).format("DD-MM-YYYY")}

                        </Card.Text>
                        <Card.Text>
                          Hora: {appointment.hour}
                        </Card.Text>
                        <Card.Text>
                          Usuario: {appointment.user.first_name}
                        </Card.Text>
                        <Card.Text>
                          Teléfono: {appointment.user.phone}
                        </Card.Text>

                        <div className="iconTrash mt-2">
                          <FaPowerOff onClickCapture={() => handleClick(appointment)} />
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {/* //////////////////////////////////////////////////////////// */}

      <div>
      <h2>Citas Inactivas</h2>
      </div>
      {/* /////////////////////////////////////////////////////////////////// */}
      {Array.isArray(appointmentData) && (
        <div className="container">
          <div className="row">
            {appointmentData && appointmentData.filter(appointment => !appointment.is_active)
              .map((appointment, index) => (

                <div className="col-md-4 col-sm-12 text-center" key={index}>
                  {/* <h2>Appointment #{appointmentIndex + 1}</h2> */}
                  {appointment.dog && (
                    <Card style={{ width: '20rem' }}>
                      <Card.Img variant="top" src={appointment.dog.photo} />
                      <Card.Body>
                        <Card.Title>{appointment.dog.name}</Card.Title>
                        <Card.Text>
                          Fecha: {moment(appointment.date).format("DD-MM-YYYY")}

                        </Card.Text>
                        <Card.Text>
                          Hora: {appointment.hour}
                        </Card.Text>
                        <Card.Text>
                          Usuario: {appointment.user.first_name}
                        </Card.Text>
                        <Card.Text>
                          Teléfono: {appointment.user.phone}
                        </Card.Text>

                        <div className="iconTrash mt-2">
                          <BiCheckCircle onClickCapture={() => handleClick(appointment)} />
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}



    </>
  )
}