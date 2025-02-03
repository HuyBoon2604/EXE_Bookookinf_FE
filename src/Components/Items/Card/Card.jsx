import React, { useEffect, useState } from "react";
import "./Card.css";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Import Arduino project images
import arduinoImage1 from '/src/assets/SliderCard/1.jpg';
import arduinoImage2 from '/src/assets/SliderCard/2.jpg';
import arduinoImage3 from '/src/assets/SliderCard/3.jpg';
import arduinoImage4 from '/src/assets/SliderCard/4.jpg';

// Fake data with Arduino projects and images
const fakeData = [
    {
        title: "Arduino Project 1",
        description: "A basic Arduino setup with LED.",
        image: arduinoImage1,
        ratingAvg: 4.5,
        ratingCount: 120,
    },
    {
        title: "Arduino Project 2",
        description: "A temperature monitoring system.",
        image: arduinoImage2,
        ratingAvg: 4.0,
        ratingCount: 95,
    },
    {
        title: "Arduino Project 3",
        description: "An automated door locking system.",
        image: arduinoImage3,
        ratingAvg: 4.8,
        ratingCount: 150,
    },
    {
        title: "Arduino Project 4",
        description: "A light intensity controller.",
        image: arduinoImage4,
        ratingAvg: 4.2,
        ratingCount: 110,
    }
];

// Convert minutes to hours function
const CoverMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

const nameNavigation = (courseName) => {
    return courseName.toLowerCase().replace(/ /g, "-");
};

const Card = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulate fetching data from an API
        setTimeout(() => {
            setData(fakeData[0]); // Simulate using the first project for now
        }, 1000);
    }, []);

    const handleOnClickCard = (courseName) => {
        window.location.href = `courses/${nameNavigation(courseName)}`;
    };

    return (
        <div id="card" onClick={() => handleOnClickCard(data.name)}>
            <div className="card-container">
                {data ? (
                    <>
                        <img
                            src={data.image}
                            className="background"
                            alt="Course"
                        />
                        <div className="card-content">
                            <p className="items-name">{data.title}</p>
                            <div className="rating-container">
                                <Stack spacing={1}>
                                    <Rating
                                        className="rating"
                                        value={data.ratingAvg}
                                        precision={0.5}
                                        readOnly
                                    />
                                </Stack>
                                <span className="total-rating">&#40;{data.ratingCount}&#41;</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </div>
    );
};

export default Card;
