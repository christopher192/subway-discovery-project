import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { GoogleApiWrapper, Map, Marker, Circle, InfoWindow } from "google-maps-react";
import BreadCrumb from '../../Components/Common/BreadCrumb';

const LoadingContainer = () => <div>Loading...</div>

const Home = (props) => {
    document.title = "Google Maps";

    const [currentLocation, setCurrentLocation] = useState({ lat: 3.1390, lng: 101.6869 });
    const [outlets, setOutlets] = useState(null);
    const [updatedOutlets, setUpdatedOutlets] = useState(null);
    const [selectedOutlet, setSelectedOutlet] = useState(null);

    const mapStyles = {
        width: '100%',
        height: '100%',
    };

    // function to calculate distance between two points using haversine formula
    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371.0; // radius of the Earth in kilometers

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    };

    // function to convert degrees to radians
    const toRadians = (degrees) => {
        return degrees * Math.PI / 180;
    };

    // function to check if circles intersect
    // const checkIntersection = (outlet1, outlet2) => {
    //     const distance = haversine(outlet1.latitude, outlet1.longitude, outlet2.latitude, outlet2.longitude);
    //     return distance <= 1; // assuming 1km radius
    // };

    const handleMarkerMouseover = (props, marker, e) => {
        setSelectedOutlet(props.outlet);
    }

    const handleMarkerMouseout = (props, marker, e) => {
        setSelectedOutlet(null);
    }

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

    useEffect(() => {
        if (outlets !== null) {
            let updatedOutlets = [];

            outlets.forEach((outlet, index) => {
                let isIntersect = false;
                let allIntersectedOutlets = [];
                let intersectedOutlets = [];
                let distances = []
                let count = 0;

                outlets.forEach((otherOutlet, otherIndex) => {
                    // skip checking against itself
                    if (index !== otherIndex) {
                        const distance = haversine(
                            outlet.latitude,
                            outlet.longitude,
                            otherOutlet.latitude,
                            otherOutlet.longitude
                        );

                        count = count + 1;

                        allIntersectedOutlets.push(otherOutlet.location_name);
                        distances.push(distance);

                        // check if the distance is less than or equal to 1 km (1000 meters)
                        if (distance <= 2.0) {
                            isIntersect = true;
                            intersectedOutlets.push(otherOutlet.location_namae);
                            // console.log(outlet.location_name, otherOutlet.location_name);
                        }
                    }
                });

                const allIntersectedOutletWithDistances = {};

                for (let i = 0; i < allIntersectedOutlets.length; i++) {
                    allIntersectedOutletWithDistances[allIntersectedOutlets[i]] = distances[i];
                }

                const dataToSave = {
                    outletLocationName: outlet.location_name,
                    intersectedOutlets: intersectedOutlets,
                    allIntersectedOutlet: allIntersectedOutletWithDistances
                };

                if (outlet.location_name == "Subway Ativo Plaza") {
                    console.log(dataToSave);
                }

                updatedOutlets.push({ ...outlet, intersectedOutlets });
            });

            setUpdatedOutlets(updatedOutlets);
        }
    }, [outlets]);

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
                                        {updatedOutlets !== null && (
                                            <Map
                                                google = {props.google}
                                                zoom = {11}
                                                style = {mapStyles}
                                                initialCenter = {currentLocation}
                                            >
                                                {updatedOutlets.map((outlet, index) => (
                                                    <Marker
                                                        key = {index}
                                                        position = {{ lat: outlet.latitude, lng: outlet.longitude }}
                                                        onClick={() => {}}
                                                        onMouseover = {handleMarkerMouseover}
                                                        onMouseout = {handleMarkerMouseout}
                                                        outlet = {outlet}
                                                    />
                                                ))}
                                                {updatedOutlets.map((outlet, index) => (
                                                    <Circle
                                                        key = {index}
                                                        radius = {1000} // 1km
                                                        center = {{ lat: outlet.latitude, lng: outlet.longitude }}
                                                        strokeColor = '#FF0000'
                                                        strokeOpacity = {0.8}
                                                        strokeWeight = {2}
                                                        fillColor = {outlet.intersectedOutlets.length > 0 ? '#00FF00' : 'transparent'}
                                                    />
                                                ))}
                                                {selectedOutlet && (
                                                    <InfoWindow
                                                        position = {{ lat: selectedOutlet.latitude, lng: selectedOutlet.longitude }}
                                                        visible = {true}
                                                    >
                                                        <div>
                                                            <h6>{selectedOutlet.location_name}</h6>
                                                        </div>
                                                    </InfoWindow>
                                                )}
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