import {Navigate, Route, Routes} from "react-router-dom"
import { Home } from "../Home/Home";
import { Login } from "../Login/Login";
import { Dogs } from "../Dogs/Dogs";
import {DogView} from '../DogView/DogView.jsx';
import { Profile } from "../Profile/Profile";
//import { AdminProfile } from "../AdminProfile/AdminProfile.jsx";
import { AdminAppointments } from "../AdminAppointments/AdminAppointments.jsx";


export const Body = () => {


    return(
        <>
           <Routes>
           <Route path="*" element={<Navigate to="/" />} />
           <Route path="/" element={<Home/>} />
           <Route path="/login" element={<Login/>} />
           <Route path="/animales" element={<Dogs/>} />
           <Route path="/animales/:id" element={<DogView/>} />
           <Route path="/perfil" element={<Profile/>} />
           <Route path="/citasadmin" element={<AdminAppointments/>} />

           </Routes>
    
      
      </>
    );
}