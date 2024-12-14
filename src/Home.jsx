import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const imageUrls = [
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pikpng.com%2Fpngvi%2FiJJho_cute-random-png-clipart%2F&psig=AOvVaw1oIfBIP41IDCyPG3haxgye&ust=1733582020071000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJi95rWuk4oDFQAAAAAdAAAAABAE",
  "https://placekitten.com/300/300",
  "https://via.placeholder.com/300",
  "https://picsum.photos/300",
  "https://dummyimage.com/300x300/000/fff",
  "https://loremflickr.com/320/240"
];

function Home() {
  return (
    <Container className="py-5">
      {/* Welcome Text Section */}
      <Row className="text-center mb-4">
        <Col>
          <h1 className="mb-3">Welcome to Image Odyssey</h1>
          <p>Discover, explore, and manage your visual journey through a world of stunning images.</p>
        </Col>
      </Row>

      {/* Image Gallery Section */}
      <Row>
        {imageUrls.map((url, index) => (
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={index}>
            <Card>
              <Card.Img
                variant="top"
                src={url}
                alt={`Gallery Image ${index + 1}`}
                style={{ height: '200px', objectFit: 'cover' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
