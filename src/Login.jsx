import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import logo from "./assets/weblogo.jpg";

import { API_ENDPOINT } from "./Api.jsx";

function LoginSignupPinterest() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // Verify if User in Session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
          setUser(token.data);
          navigate("/dashboard");
        } else {
          throw new Error("No token found");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // States for Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem('token', JSON.stringify(response));
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  // States for Signup
  const [fullname, setFullname] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/register`, {
        fullname,
        username,
        password,
      });
      localStorage.setItem("token", JSON.stringify(response));
      setError("");
      navigate("/dashboard");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a2e", minHeight: "100vh", color: "#fff" }}>
      <Navbar style={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }} variant="dark">
        <Container>
          <Navbar.Brand style={{ fontWeight: "bold" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "40px", marginRight: "10px" }}
            />
            Image Odyssey
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-5 text-center">
        <img src={logo} alt="Logo" style={{ maxWidth: "150px" }} />
        <h2 className="mt-3" style={{ color: "#a29bfe" }}>
          "Discover, Inspire, and Explore – Your World Through Every Pixel."
        </h2>

        <Row className="justify-content-center mt-4">
          <Col md={6} lg={4} className="p-3 shadow rounded" style={{ backgroundColor: "#0f3460" }}>
            <h4 style={{ color: "#e94560" }}>{isSignup ? "Signup" : "Login"}</h4>
            <Form onSubmit={isSignup ? handleSignup : handleLogin}>
              {isSignup && (
                <Form.Group controlId="formFullname" className="mt-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    style={{ backgroundColor: "#162447", color: "#fff" }}
                  />
                </Form.Group>
              )}

              <Form.Group controlId="formUsername" className="mt-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ backgroundColor: "#162447", color: "#fff" }}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ backgroundColor: "#162447", color: "#fff" }}
                />
              </Form.Group>

              {error && <p className="text-danger mt-3">{error}</p>}

              <Button
                type="submit"
                className="mt-3 w-100"
                style={{
                  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                  border: "none",
                }}
              >
                {isSignup ? "Signup" : "Login"}
              </Button>
            </Form>

            <div className="mt-3">
              <Button
                variant="link"
                onClick={() => setIsSignup(!isSignup)}
                style={{ color: "#a29bfe", textDecoration: "none" }}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Signup"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginSignupPinterest;
