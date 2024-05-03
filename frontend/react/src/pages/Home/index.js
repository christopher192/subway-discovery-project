import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { GoogleApiWrapper, Map, Marker, Circle, InfoWindow } from "google-maps-react";
import BreadCrumb from '../../Components/Common/BreadCrumb';

const mapStyles = {
    width: '100%',
    height: '100%',
};

const LoadingContainer = () => <div>Loading...</div>

const Home = (props) => {
    document.title = "Google Maps";
    const [currentLocation, setCurrentLocation] = useState({ lat: 3.1390, lng: 101.6869 });
    const [outlets, setOutlets] = useState(null);

    useEffect(() => {
        // if ("geolocation" in navigator) {
        //     navigator.geolocation.getCurrentPosition(function (position) {
        //         setCurrentLocation({
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         });
        //         console.log(position.coords.latitude);
        //         console.log(position.coords.longitude);
        //     });
        // }

        fetch('http://127.0.0.1:5000/get_outlets')
            .then(response => response.json())
            .then(data => {
                setOutlets(data["data"]);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <React.Fragment>
            <div className = "page-content">
                <Container fluid>
                <BreadCrumb title = "Google Maps" pageTitle = "Home" />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Subway (Kuala Lumpur)</h4>
                                </CardHeader>
                                <CardBody>
                                    <div id = "gmaps-markers" className = "gmaps" style = {{ position: "relative" }}>
                                    {outlets !== null && (
                                        <Map
                                            google = {props.google}
                                            zoom = {11}
                                            style = {mapStyles}
                                            initialCenter = {currentLocation}
                                        >
                                            {outlets.map((outlet, index) => (
                                                <Marker
                                                    key = {index}
                                                    position = {{ lat: outlet.latitude, lng: outlet.longitude }}
                                                />
                                            ))}
                                            {outlets.map((outlet, index) => (
                                                <Circle
                                                    key = {index}
                                                    radius = {1000}
                                                    center = {{ lat: outlet.latitude, lng: outlet.longitude }}
                                                    strokeColor = '#FF0000'
                                                    strokeOpacity = {0.8}
                                                    strokeWeight = {2}
                                                    fillColor = 'transparent'
                                                />
                                            ))}
                                        </Map>
                                    )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default (
    GoogleApiWrapper({
        apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
        LoadingContainer: LoadingContainer,
        v: "3",
    })(Home)
)