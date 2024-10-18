import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Calendar, Clock, Building, User, Briefcase } from "lucide-react";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const loggedInUser = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[currentTime.getDay()];

  // Static company details
  const companyDetails = {
    name: "TechInnovate Solutions",
    founded: "2010",
    employees: "250+",
    headquarters: "San Francisco, CA",
    mission: "Empowering businesses through innovative technology solutions",
  };

  return (
    <Container fluid className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Welcome {loggedInUser.name}</h5>
        <h6>
          <User className="me-2" />
          Role: {loggedInUser.role}
        </h6>
      </div>
      <Row>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <Clock className="me-2" />
                Current Time
              </Card.Title>
              <Card.Text className="h3">
                {currentTime.toLocaleTimeString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <Calendar className="me-2" />
                Date
              </Card.Title>
              <Card.Text className="h4">{currentTime.toDateString()}</Card.Text>
              <Card.Text className="h5">{currentDay}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <Briefcase className="me-2" />
                Your Status
              </Card.Title>
              <Card.Text>Active</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <Building className="me-2" />
                Company Overview
              </Card.Title>
              <Card.Text>Name: {companyDetails.name}</Card.Text>
              <Card.Text>Founded: {companyDetails.founded}</Card.Text>
              <Card.Text>Employees: {companyDetails.employees}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Company Mission</Card.Title>
              <Card.Text>{companyDetails.mission}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
