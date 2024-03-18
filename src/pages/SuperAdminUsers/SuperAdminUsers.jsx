import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersWithRoles, updateUserState } from "../../Services/ApiCalls";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { FaPowerOff } from "react-icons/fa";
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BiCheckCircle } from "react-icons/bi";
import './SuperAdminUsers.css';

export const SuperAdminUsers = () => {
  const userRdxDetail = useSelector(userData);
  const token = userRdxDetail.credentials.token;
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const userRole = decodedToken.userRoles[0];

  // State for Modal and Form
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      setLoading(true);
      setError(null);
      navigate("/");
    } else {
      const pageString = page.toString();
      getAllUsersWithRoles(token, pageString).then(
        (res) => {
         
          setUsers(res.users);
          setTotalPages(Math.ceil(res.total / 10));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [page]);

  const up = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const down = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleUpdateState = async (userId, newState) => {
    try {
      if (userId) {
        const response = await updateUserState(token, userId, newState);

        if (response) {
          console.log('Estado de usuario actualizado con éxito');

          // Actualización del estado de los usuarios
          setUsers(prevUsers => {
            return prevUsers.map(currentUser => {
              if (currentUser.id === userId) {
                return { ...currentUser, is_active: newState };
              } else {
                return currentUser;
              }
            });
          });
        } else {
          console.log('Estado de usuario no actualizado');
        }
      } else {
        console.error('ID de usuario indefinido');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  const handleClick = async (user) => {
    try {
      const newState = !user.is_active;
      await handleUpdateState(user.id, newState); // Actualizar estado del usuario en la API
  
      // Actualizar estado local del componente
      setUsers(prevUsers => prevUsers.map(currentUser => {
        if (currentUser.id === user.id) {
          return { ...currentUser, is_active: newState };
        } else {
          return currentUser;
        }
      }));
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
    }
  };


  return (
    <>
     <div className="text-center">
        <h2>Usuarios Activos</h2>
      </div>
      <div className="container-fluid justify-content-center">
        <div className="col-12 justify-content-center">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && (
            <div className="row mb-3 justify-content-center align-items-center ">
              {Array.isArray(users) ? (
                users.filter(user => user.is_active)
                .map((user) => (
                  <Card key={user.id} style={{ width: "22rem" }}>
                    <div className="d-flex align-items-center">
                      <div className="circle-image me-3">
                        <Card.Img
                          variant="top"
                          src={user.photo}
                          className="rounded-circle"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title> {user.username}</Card.Title>
                        <Card.Text>
                          Nombre: {user.first_name}
                        </Card.Text>
                        <Card.Text>
                          Apellido: {user.last_name}
                        </Card.Text>
                        <Card.Text>
                          Email: {user.email}
                        </Card.Text>
                        <Card.Text>
                          Roles: {user.roles ? user.roles.map(role => role.role_name).join(", ") : ""}
                        </Card.Text>
                        <div className="power-button-container">
                          <FaPowerOff onClickCapture={() => handleClick(user)} />
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No users found</p>
              )}
              <div className="d-flex justify-content-center mt-3">
                <Button onClick={down} disabled={page === 1}>
                  Previous
                </Button>
                <span className="mx-3">Page {page}</span>
                <Button onClick={up} disabled={page === totalPages}>
                  Next
               </Button>
              </div>
            </div>
            )}      
            </div>      
            </div>   
        <div className="text-center">
        <h2>Usuarios Inactivos</h2>
      </div> 

      <div className="container-fluid justify-content-center">
        <div className="col-12 justify-content-center">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && (
            <div className="row mb-3 justify-content-center align-items-center ">
              {Array.isArray(users) ? (
                users.filter(user => !user.is_active)
                .map((user) => (
                  <Card key={user.id} style={{ width: "22rem" }}>
                    <div className="d-flex align-items-center">
                      <div className="circle-image me-3">
                        <Card.Img
                          variant="top"
                          src={user.photo}
                          className="rounded-circle"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title> {user.username}</Card.Title>
                        <Card.Text>
                          Nombre: {user.first_name}
                        </Card.Text>
                        <Card.Text>
                          Apellido: {user.last_name}
                        </Card.Text>
                        <Card.Text>
                          Email: {user.email}
                        </Card.Text>
                        <Card.Text>
                          Roles: {user.roles ? user.roles.map(role => role.role_name).join(", ") : ""}
                        </Card.Text>
                        <div className="power-button-container">
                        <BiCheckCircle onClickCapture={() => handleClick(user)} />
                        
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No users found</p>
              )}
           
            </div>
            )}      
            </div>      
            </div>   
          

            </>
            
            );
};