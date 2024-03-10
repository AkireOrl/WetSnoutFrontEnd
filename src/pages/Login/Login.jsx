

import { useEffect, useState } from "react";
// import "./Login.css";
import { CustomForm } from "../../Components/CustomForm/CustomForm";
import { userLogin } from "../../Services/ApiCalls";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { login, userData } from "../userSlice";
import { useDispatch, useSelector } from "react-redux";

export const Login = () => {

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    // instancio redux en modo escritura
    const dispatch = useDispatch()

    // instancio redux en modo lectura
    const userRdxData = useSelector(userData)

    const navigate = useNavigate();

    const inputHandler = (event) => {
        setCredentials((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const buttonHandler = () => {
        userLogin(credentials)
            .then((token) => {
                if (!token) {
                    navigate("/login");
                    return null;
                }
                const decodedToken = jwtDecode(token)

                const data = {
                    token: token,
                    userData: decodedToken
                }
                dispatch(login({ credentials: data }))
                const isAdmin = decodedToken.userRoles.includes("admin");
                setTimeout(() => {
                    isAdmin ? navigate('/tatuprofile') : navigate('/profile');
                });

            })
            .catch((err) => console.error("Ha ocurrido un error", err))
    };


    useEffect(() => {
        if (!userRdxData) {
            navigate();
        }
    }, [userRdxData, navigate]);



    return (
        <div className="login">
            <div className="loginDiv">
                <div className="input">
                    <div className="inputBox">

                        <label>EMAIL</label>
                        <CustomForm
                            type={"email"}
                            name={"email"}
                            handler={inputHandler}
                        ></CustomForm>
                        <label>CONTRASEÑA</label>
                        <CustomForm
                            type={"password"}
                            name={"password"}
                            handler={inputHandler}
                        ></CustomForm>
                        <input type="submit" name="" onClick={buttonHandler} value="Entrar"></input>
                        {/* <h1>{userData.name}</h1> */}
                    </div>
                </div>

            </div>
        </div>
    );
};