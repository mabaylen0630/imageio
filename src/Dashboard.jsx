import React, { useEffect, useState } from 'react';  
import { data, useNavigate } from 'react-router-dom';  
import axios from 'axios';  

import Container from 'react-bootstrap/Container';  
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';  
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';  
import Button from 'react-bootstrap/Button';  
import { jwtDecode } from 'jwt-decode';  
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import { API_ENDPOINT } from './Api';  

import Swal from 'sweetalert2';

import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

import logo from "./assets/weblogo.jpg";

function Dashboard() {  
  const [user, setUser] = useState(null);  
  const [users, setUsers] = useState([]);  
  const [show, setShow] = useState(false);  
  const [show1, setShow1] = useState(false);  
  const [selectedUser, setSelectedUser] = useState(null);
  const [fullname, setFullname] = useState("");  
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");  
  const [validationError, setValidationError] = useState({});  
  const [isUpdating, setIsUpdating] = useState(false);  
  const [currentUserId, setCurrentUserId] = useState(null);  
  const navigate = useNavigate();  

  const token = JSON.parse(localStorage.getItem('token'))?.data?.token;
  const headers = {  
    accept: 'application/json',  
    Authorization: token  
  };

  useEffect(() => {  
    const fetchDecodedUserID = async () => {  
      try {  
        const response = JSON.parse(localStorage.getItem('token'));  
        setUser(response.data);  
        const decoded_token = jwtDecode(response.data.token);
        setUser(decoded_token);
      } catch (error) {  
        navigate('/login');  
      }  
    };  
    fetchDecodedUserID();  
  }, []);  

  useEffect(() => {  
    fetchUsers();  
  }, []);  

  const fetchUsers = async () => {  
    await axios.get(`${API_ENDPOINT}/user`, { headers }).then(({ data }) => {  
      setUsers(data);  
    });  
  };  

  const handleLogout = async () => {  
    try {  
      localStorage.removeItem('token');  
      navigate('/login');  
    } catch (error) {  
      console.error('Logout failed:', error);  
    }  
  };  

  const deleteUser = async (id) => {  
    const isConfirm = await Swal.fire({  
      title: 'Are you sure?',  
      text: "You won't be able to revert this!",  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',  
      confirmButtonText: 'Yes, delete it!'  
    }).then((result) => result.isConfirmed);  

    if (!isConfirm) {  
      return;  
    }  

    await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers }).then(() => {  
      Swal.fire({  
        icon: "success",  
        text: "Successfully Deleted" 
      });
      fetchUsers();
    }).catch(({ response: { data } }) => {  
      Swal.fire({  
        text: data.message,  
        icon: "error"
      });  
    });
  };

  const handleShowCreate = () => {  
    resetForm();  
    setIsUpdating(false);  
    setShow(true);  
  };

  const handleShowUpdate = (user) => {  
    setFullname(user.fullname);  
    setUsername(user.username);  
    setPassword('');  
    setCurrentUserId(user.user_id);  
    setIsUpdating(true);  
    setShow(true);  
  };

  const handleClose = () => {  
    setShow(false);  
    resetForm();  
  };

  const handleShowDetails = (row_users) => {  
    setSelectedUser(row_users);  
    setShow1(true);  
  };

  const handleCloseDetails = () => setShow1(false);

  const resetForm = () => {  
    setFullname("");  
    setUsername("");  
    setPassword("");  
    setValidationError({});  
    setCurrentUserId(null);  
  };

  const handleCreateOrUpdateUser = async (e) => {  
    e.preventDefault();  

    const payload = { fullname, username, password };  
    const endpoint = `${API_ENDPOINT}/user${isUpdating ? `/${currentUserId}` : ''}`;  
    const method = isUpdating ? 'put' : 'post';  

    try {  
      const response = await axios[method](endpoint, payload, { headers });  
      Swal.fire({  
        icon: "success",  
        text: isUpdating ? "Successfully Updated" : "Successfully Added"   
      });  
      fetchUsers();  
      handleClose();  
    } catch (error) {  
      if (error.response && error.response.status === 422) {  
        setValidationError(error.response.data.errors);  
      } else {  
        Swal.fire({  
          text: error.response?.data?.message || "An error occurred",  
          icon: "error"  
        });  
      }  
    }  
  };

  const createUser = async (e) => {
    e.preventDefault();
  
    const payload = { fullname, username, password };
    const endpoint = `${API_ENDPOINT}/user`;
  
    try {
      const response = await axios.post(endpoint, payload, { headers });
      Swal.fire({
        icon: "success",
        text: "Successfully Added",
      });
      fetchUsers(); // Fetch updated user list
      handleClose(); // Close the modal
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors); // Handle validation errors
      } else {
        Swal.fire({
          text: error.response?.data?.message || "An error occurred",
          icon: "error",
        });
      }
    }
  };
  
  

  return (  
    <>  
      <Navbar style={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }} variant="dark">  
      <Container>  
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" width="7%" className="me-2" />Image Odyssey.
        </Navbar.Brand>  
        <Nav className="me-auto">  
          <Nav.Link href="#users">Accounts</Nav.Link>  
          <Nav.Link href="#departments">Gallery</Nav.Link>  
          <Nav.Link href="#courses">New</Nav.Link>  
        </Nav>  

        <Navbar.Collapse id="basic-navbar-nav">  
          <Nav className="ms-auto">  
            <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">  
              <NavDropdown.Item href="#">Profile</NavDropdown.Item>  
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>  
              <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>  
            </NavDropdown>  
          </Nav>  
        </Navbar.Collapse>  
      </Container>  
    </Navbar>   
      <br />

      <div className="container">
        <div className='col-12'>  
          <Button variant='btn btn-primary mb-2 float-end btn-sm me-2' onClick={handleShowCreate}>Create User</Button>  
        </div>

        <table className='table table-bordered'>  
          <thead>  
            <tr>  
              <th style={{padding: 1, margin: 0}}>ID</th>  
              <th style={{padding: 1, margin: 0}}>Username</th>  
              <th style={{padding: 1, margin: 0}}>Fullname</th>  
              <th style={{padding: 1, margin: 0}}>
                <center>Action</center>
              </th>  
            </tr>  
          </thead>  
          <tbody>  
            {users.length > 0 && users.map((row_users) => (  
              <tr key={row_users.user_id}>  
                <td style={{padding: 1, margin: 0}}>{row_users.user_id}</td>  
                <td style={{padding: 1, margin: 0}}>{row_users.username}</td>  
                <td style={{padding: 1, margin: 0}}>{row_users.fullname}</td>  
                <td style={{padding: 1, margin: 0}}>  
                  <center>  
                    <Button variant='secondary' size='sm' onClick={() => handleShowDetails(row_users)}>Read</Button> &nbsp;
                    <Button variant='warning' size='sm' onClick={() => handleShowUpdate(row_users)}>Update</Button> &nbsp;
                    <Button variant='danger' size='sm' onClick={() => deleteUser(row_users.user_id)}>Delete</Button>  
                  </center>  
                </td>  
              </tr>  
            ))}  
          </tbody> 
        </table>  
      </div>

      <Modal show={show} onHide={handleClose}>  
        <Modal.Header closeButton>  
          <Modal.Title>{isUpdating ? 'Update User' : 'Create User'}</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <Form onSubmit={handleCreateOrUpdateUser}>  
            <Row>  
              <Col>  
                <Form.Group controlId="Name">  
                  <Form.Label>Fullname</Form.Label>  
                  <Form.Control type="text" value={fullname} onChange={(event)=>{setFullname(event.target.value)}} required />  
                </Form.Group>  
              </Col>  
            </Row>  
            <Row className="mt-3">  
              <Col>  
                <Form.Group controlId="Email">  
                  <Form.Label>Username</Form.Label>  
                  <Form.Control type="text" value={username} onChange={(event)=>{setUsername(event.target.value)}} required />  
                </Form.Group>  
              </Col>  
            </Row>  
            <Row className="mt-3">  
              <Col>  
                <Form.Group controlId="Password">  
                  <Form.Label>Password</Form.Label>  
                  <Form.Control type="password" value={password} onChange={(event)=>{setPassword(event.target.value)}} required />  
                </Form.Group>  
              </Col>  
            </Row>  
            {Object.keys(validationError).length > 0 && (  
              <div className="mt-3 alert alert-danger">  
                <ul className="mb-0">  
                  {Object.entries(validationError).map(([key, value]) => (  
                    <li key={key}>{value}</li>  
                  ))}  
                </ul>  
              </div>  
            )}  
            <Button variant="primary" className="mt-4" type="submit">{isUpdating ? 'Update' : 'Save'}</Button>  
          </Form>  
        </Modal.Body>  
      </Modal>

      <Modal show={show1} onHide={handleCloseDetails}>  
        <Modal.Header closeButton>  
          <Modal.Title>Details</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          {selectedUser && (  
            <div>  
              <p>Username: {selectedUser.username}</p>  
              <p>Fullname: {selectedUser.fullname}</p>  
            </div>  
          )}  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="secondary" onClick={handleCloseDetails}>Close</Button>  
        </Modal.Footer>  
      </Modal>
    </>
  );
}

export default Dashboard;
