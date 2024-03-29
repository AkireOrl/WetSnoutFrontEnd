import axios from "axios";

const API_URL = "http://localhost:3000"
//--------------------------------------------------------------------------------

export const userRegister = async (registerData) => {
    try {
    
      const res = await axios.post(`${API_URL}/api/users/register`, registerData);

      return res.data;
    } catch (error) {
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado diferente de 2xx
        console.error('Respuesta del servidor con error:', error.response.data);
        console.error('Código de estado:', error.response.status);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
      } else {
        // Algo sucedió en la configuración de la solicitud que provocó un error
        console.error('Error de configuración de la solicitud:', error.message);
      }
      throw error; // Lanza el error para que pueda ser manejado más arriba
    }
  };

export const userLogin = async (credentials) => {  //funcionando
    try {
        const res = await axios.post(`${API_URL}/api/users/login`, credentials, {})
        const token = res.data.token

        return token
    } catch (error){
        console.error('Error en el login:', error);
    throw error;
    }
    
}

export const getAllDogs = async () =>{  
  
    const res = await axios.get(`${API_URL}/api/dogs/dogs`)

    return res
}

 export const getProfile = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(`${API_URL}/api/users/${id}`, config);

  return res.data;
};

export const updateUser = async (token, id, updateData) => {
  const config = {
      headers: {
          Authorization: "Bearer " + token
      },
      
  };

  const res = await axios.patch(`${API_URL}/api/users/${id}`,updateData, config);

  return res;
}

export const createAppointments = async( token, appointmentData) => {
  const config ={
      headers:{
          Authorization: "Bearer " + token
      }
  }
  const res = await axios.post(`${API_URL}/api/appointment/` ,appointmentData, config )

 return res.data;
}

export const getAppointments = async(token, id) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
}
const res = await axios.get(`${API_URL}/api/appointment/miscitasuser/${id}`, config )

 return res.data;
}


export const updateAppoState = async(token,id, newState) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
  }
  console.log(`Updating appointment with ID ${id} to state ${newState}`); // Add this line to print a message to the console
  const res = await axios.patch(`${API_URL}/api/appointment/appostate/${id}`,{ "is_active": newState }, config )

  return res.data;
}

export const getAllAppointments = async(token) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
}
const res = await axios.get(`${API_URL}/api/appointment/`, config )

 return res.data;
}

export const getAllUsersWithRoles = async(token, page=1)=>{
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
}
const res = await axios.get(`${API_URL}/api/users/todos?page=${page}`, config )

 return res.data;
}

export const updateUserState = async(token,id, newState) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
  }
  const res = await axios.patch(`${API_URL}/api/users/updatestate/${id}`,{ "is_active": newState }, config )
 
  return res.data;
}

export const dogRegisterCall = async ( dogRegister , token, ) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
  }
  const res = await axios.post(`${API_URL}/api/dogs/dogs`, dogRegister, config ) ;
  
  return res
}

export const updateDogState = async (token, id, newState) => {
  const config ={
    headers:{
        Authorization: "Bearer " + token
    }
  }
  const res = await axios.patch(`${API_URL}/api/dogs/updatedogstate/${id}`,{ "is_active": newState }, config )
 
  return res.data;
}