import axios from "axios";

const API_URL = "http://localhost:3000"
//--------------------------------------------------------------------------------

export const userRegister = async (registerData) => {
    try {
      console.log(registerData);
      const res = await axios.post(`http://localhost:3000/api/users/register`, registerData);
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
    console.log(res, "somos llamada")
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
// export const updateUser = async (token, updateData) => {
//   const config = {
//       headers: {
//           Authorization: "Bearer " + token
//       },
//   };

//   const res = await axios.patch(`${API_URL}/api/users/`,updateData, config);
 
//   return res.data;
// }