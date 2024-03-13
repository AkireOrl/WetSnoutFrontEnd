import { useDispatch, useSelector } from "react-redux"
import { userData } from "../userSlice"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersWithRoles } from "../../Services/ApiCalls";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { FaPowerOff } from "react-icons/fa";
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './SuperAdminUsers.css'






export const SuperAdminUsers  = () => {

    const userRdxDetail = useSelector(userData);
    const token = userRdxDetail.credentials.token
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.userId;

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            setLoading(true);
      setError(null);
          navigate("/");
        } else {
            const pageString = page.toString();
          getAllUsersWithRoles(token, pageString).then(
            (res) => {
                console.log(res);
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

    return(
        <>

        <div className="container-fluid justify-content-center">
        <div className="col-12 justify-content-center">
 {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && (
        <div className="row mb-3 justify-content-center align-items-center ">
          {Array.isArray(users) ? (
            users.map((user) => (
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
                     Role: {user.roles[0].role_name}
                    </Card.Text>
                    <div className="power-button-container">
                    <FaPowerOff  onClickCapture={() => handleClick(appointment)} />
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
    </>
  );
};


